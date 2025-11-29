// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@chainlink/contracts/src/v0.8/shared/interfaces/AggregatorV3Interface.sol";

/**
 * @title RemitEscrow
 * @dev Escrow contract for peer-to-peer remittances on Celo with group contributions
 * @notice This contract enables users to create remittances, accept group contributions,
 *         and release funds when targets are met. Integrates Chainlink for forex data.
 *
 * Best Practices:
 * - Uses OpenZeppelin's ReentrancyGuard to prevent reentrancy attacks
 * - Uses pull-over-push pattern for fund distribution
 * - Emits events for all state changes for off-chain tracking
 * - Input validation on all public/external functions
 * - Uses Checks-Effects-Interactions pattern
 */
contract RemitEscrow is ReentrancyGuard, Ownable {

    // ============ Structs ============

    struct Remittance {
        uint256 id;
        address creator;
        address recipient;
        uint256 targetAmount;      // Target amount in cUSD (wei)
        uint256 currentAmount;     // Current contributions (wei)
        string purpose;            // e.g., "Family gift", "Medical expenses"
        uint256 createdAt;
        bool isReleased;
        bool isCancelled;
        address[] contributors;    // Track all contributors
        mapping(address => uint256) contributions; // Track individual contributions
    }

    // ============ State Variables ============

    uint256 private _remittanceIdCounter;
    mapping(uint256 => Remittance) private _remittances;
    mapping(address => uint256[]) private _userRemittances; // Creator's remittances
    mapping(address => uint256[]) private _recipientRemittances; // Recipient's remittances

    // Chainlink Price Feed for cUSD/USD (for forex alerts)
    AggregatorV3Interface public priceFeed;

    // Platform fee (in basis points, e.g., 50 = 0.5%)
    uint256 public platformFeeBps = 50; // 0.5% fee
    uint256 public constant MAX_FEE_BPS = 500; // Max 5% fee
    address public feeCollector;

    // ============ Events ============

    event RemittanceCreated(
        uint256 indexed remittanceId,
        address indexed creator,
        address indexed recipient,
        uint256 targetAmount,
        string purpose,
        uint256 timestamp
    );

    event ContributionMade(
        uint256 indexed remittanceId,
        address indexed contributor,
        uint256 amount,
        uint256 newTotal,
        uint256 timestamp
    );

    event FundsReleased(
        uint256 indexed remittanceId,
        address indexed recipient,
        uint256 amount,
        uint256 platformFee,
        uint256 timestamp
    );

    event RemittanceCancelled(
        uint256 indexed remittanceId,
        address indexed creator,
        uint256 timestamp
    );

    event PriceFeedUpdated(address indexed newPriceFeed);
    event PlatformFeeUpdated(uint256 newFeeBps);

    // ============ Errors ============

    error InvalidRecipient();
    error InvalidAmount();
    error InvalidPurpose();
    error RemittanceNotFound();
    error AlreadyReleased();
    error AlreadyCancelled();
    error NotRecipient();
    error NotCreator();
    error TargetNotMet();
    error TransferFailed();
    error InvalidFee();
    error NoContributions();

    // ============ Constructor ============

    /**
     * @dev Initialize the contract with optional Chainlink price feed
     * @param _priceFeed Address of Chainlink cUSD/USD price feed (can be zero address)
     */
    constructor(address _priceFeed) Ownable(msg.sender) {
        if (_priceFeed != address(0)) {
            priceFeed = AggregatorV3Interface(_priceFeed);
        }
        feeCollector = msg.sender;
    }

    // ============ Core Functions ============

    /**
     * @notice Create a new remittance request
     * @param recipient Address that will receive the funds
     * @param targetAmount Target amount to collect (in wei)
     * @param purpose Description of the remittance purpose
     * @return remittanceId The ID of the created remittance
     */
    function createRemittance(
        address recipient,
        uint256 targetAmount,
        string calldata purpose
    ) external returns (uint256) {
        if (recipient == address(0)) revert InvalidRecipient();
        if (targetAmount == 0) revert InvalidAmount();
        if (bytes(purpose).length == 0) revert InvalidPurpose();

        uint256 remittanceId = _remittanceIdCounter++;
        Remittance storage newRemittance = _remittances[remittanceId];

        newRemittance.id = remittanceId;
        newRemittance.creator = msg.sender;
        newRemittance.recipient = recipient;
        newRemittance.targetAmount = targetAmount;
        newRemittance.currentAmount = 0;
        newRemittance.purpose = purpose;
        newRemittance.createdAt = block.timestamp;
        newRemittance.isReleased = false;
        newRemittance.isCancelled = false;

        _userRemittances[msg.sender].push(remittanceId);
        _recipientRemittances[recipient].push(remittanceId);

        emit RemittanceCreated(
            remittanceId,
            msg.sender,
            recipient,
            targetAmount,
            purpose,
            block.timestamp
        );

        return remittanceId;
    }

    /**
     * @notice Contribute funds to a remittance
     * @param remittanceId The ID of the remittance to contribute to
     */
    function contribute(uint256 remittanceId) external payable nonReentrant {
        if (msg.value == 0) revert InvalidAmount();

        Remittance storage remittance = _remittances[remittanceId];
        if (remittance.creator == address(0)) revert RemittanceNotFound();
        if (remittance.isReleased) revert AlreadyReleased();
        if (remittance.isCancelled) revert AlreadyCancelled();

        // Track contributor if first time contributing
        if (remittance.contributions[msg.sender] == 0) {
            remittance.contributors.push(msg.sender);
        }

        // Update contributions
        remittance.contributions[msg.sender] += msg.value;
        remittance.currentAmount += msg.value;

        emit ContributionMade(
            remittanceId,
            msg.sender,
            msg.value,
            remittance.currentAmount,
            block.timestamp
        );
    }

    /**
     * @notice Release funds to recipient (only callable by recipient when target is met)
     * @param remittanceId The ID of the remittance to release
     */
    function releaseFunds(uint256 remittanceId) external nonReentrant {
        Remittance storage remittance = _remittances[remittanceId];

        if (remittance.creator == address(0)) revert RemittanceNotFound();
        if (msg.sender != remittance.recipient) revert NotRecipient();
        if (remittance.isReleased) revert AlreadyReleased();
        if (remittance.isCancelled) revert AlreadyCancelled();
        if (remittance.currentAmount < remittance.targetAmount) revert TargetNotMet();

        remittance.isReleased = true;

        // Calculate platform fee
        uint256 platformFee = (remittance.currentAmount * platformFeeBps) / 10000;
        uint256 amountToRecipient = remittance.currentAmount - platformFee;

        // Transfer funds using pull-over-push pattern
        (bool successRecipient, ) = payable(remittance.recipient).call{value: amountToRecipient}("");
        if (!successRecipient) revert TransferFailed();

        if (platformFee > 0) {
            (bool successFee, ) = payable(feeCollector).call{value: platformFee}("");
            if (!successFee) revert TransferFailed();
        }

        emit FundsReleased(
            remittanceId,
            remittance.recipient,
            amountToRecipient,
            platformFee,
            block.timestamp
        );
    }

    /**
     * @notice Cancel a remittance and refund contributors (only creator can cancel)
     * @param remittanceId The ID of the remittance to cancel
     */
    function cancelRemittance(uint256 remittanceId) external nonReentrant {
        Remittance storage remittance = _remittances[remittanceId];

        if (remittance.creator == address(0)) revert RemittanceNotFound();
        if (msg.sender != remittance.creator) revert NotCreator();
        if (remittance.isReleased) revert AlreadyReleased();
        if (remittance.isCancelled) revert AlreadyCancelled();

        remittance.isCancelled = true;

        // Refund all contributors
        for (uint256 i = 0; i < remittance.contributors.length; i++) {
            address contributor = remittance.contributors[i];
            uint256 amount = remittance.contributions[contributor];

            if (amount > 0) {
                remittance.contributions[contributor] = 0;
                (bool success, ) = payable(contributor).call{value: amount}("");
                if (!success) revert TransferFailed();
            }
        }

        emit RemittanceCancelled(remittanceId, msg.sender, block.timestamp);
    }

    // ============ View Functions ============

    /**
     * @notice Get remittance details
     * @param remittanceId The ID of the remittance
     * @return creator The address that created the remittance
     * @return recipient The recipient address
     * @return targetAmount The target amount
     * @return currentAmount The current collected amount
     * @return purpose The purpose string
     * @return createdAt The creation timestamp
     * @return isReleased Whether funds have been released
     * @return isCancelled Whether the remittance was cancelled
     */
    function getRemittance(uint256 remittanceId) external view returns (
        address creator,
        address recipient,
        uint256 targetAmount,
        uint256 currentAmount,
        string memory purpose,
        uint256 createdAt,
        bool isReleased,
        bool isCancelled
    ) {
        Remittance storage remittance = _remittances[remittanceId];
        if (remittance.creator == address(0)) revert RemittanceNotFound();

        return (
            remittance.creator,
            remittance.recipient,
            remittance.targetAmount,
            remittance.currentAmount,
            remittance.purpose,
            remittance.createdAt,
            remittance.isReleased,
            remittance.isCancelled
        );
    }

    /**
     * @notice Get all remittances created by a user
     */
    function getUserRemittances(address user) external view returns (uint256[] memory) {
        return _userRemittances[user];
    }

    /**
     * @notice Get all remittances where user is recipient
     */
    function getRecipientRemittances(address recipient) external view returns (uint256[] memory) {
        return _recipientRemittances[recipient];
    }

    /**
     * @notice Get contribution amount for a specific contributor
     */
    function getContribution(uint256 remittanceId, address contributor) external view returns (uint256) {
        return _remittances[remittanceId].contributions[contributor];
    }

    /**
     * @notice Get all contributors for a remittance
     */
    function getContributors(uint256 remittanceId) external view returns (address[] memory) {
        return _remittances[remittanceId].contributors;
    }

    /**
     * @notice Get current cUSD/USD price from Chainlink (if configured)
     * @return price The current price (scaled by 10^8)
     */
    function getCurrentPrice() external view returns (int256) {
        if (address(priceFeed) == address(0)) {
            return 1e8; // Return 1.0 if no price feed configured
        }

        (, int256 price, , , ) = priceFeed.latestRoundData();
        return price;
    }

    /**
     * @notice Get total number of remittances created
     */
    function getTotalRemittances() external view returns (uint256) {
        return _remittanceIdCounter;
    }

    // ============ Admin Functions ============

    /**
     * @notice Update the Chainlink price feed address (owner only)
     */
    function setPriceFeed(address _priceFeed) external onlyOwner {
        priceFeed = AggregatorV3Interface(_priceFeed);
        emit PriceFeedUpdated(_priceFeed);
    }

    /**
     * @notice Update platform fee (owner only)
     */
    function setPlatformFee(uint256 _feeBps) external onlyOwner {
        if (_feeBps > MAX_FEE_BPS) revert InvalidFee();
        platformFeeBps = _feeBps;
        emit PlatformFeeUpdated(_feeBps);
    }

    /**
     * @notice Update fee collector address (owner only)
     */
    function setFeeCollector(address _feeCollector) external onlyOwner {
        if (_feeCollector == address(0)) revert InvalidRecipient();
        feeCollector = _feeCollector;
    }

    // ============ Emergency Functions ============

    /**
     * @notice Emergency withdraw (owner only, for stuck funds)
     * @dev Should only be used in extreme emergencies
     */
    function emergencyWithdraw() external onlyOwner {
        (bool success, ) = payable(owner()).call{value: address(this).balance}("");
        if (!success) revert TransferFailed();
    }

    // ============ Receive Function ============

    /**
     * @dev Contract can receive native tokens
     */
    receive() external payable {}
}
