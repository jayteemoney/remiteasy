import { ethers } from "hardhat";

/**
 * Deployment script for RemitEscrow contract
 *
 * This script:
 * 1. Deploys the RemitEscrow contract
 * 2. Optionally configures a Chainlink price feed for cUSD/USD rates
 * 3. Saves deployment info for frontend integration
 *
 * Usage:
 *   npx hardhat run scripts/deploy.ts --network celoSepolia
 */

async function main() {
  console.log("🚀 Starting RemitEscrow deployment...\n");

  const [deployer] = await ethers.getSigners();
  const balance = await ethers.provider.getBalance(deployer.address);

  console.log("📋 Deployment Details:");
  console.log("  Deployer address:", deployer.address);
  console.log("  Account balance:", ethers.formatEther(balance), "CELO");
  console.log("  Network:", (await ethers.provider.getNetwork()).name);
  console.log("  Chain ID:", (await ethers.provider.getNetwork()).chainId);
  console.log("");

  // Chainlink Price Feed Addresses for Celo
  // Note: On Celo Alfajores (testnet), price feeds might not be available
  // Using zero address will make the contract return a default 1.0 price
  const PRICE_FEED_ADDRESS = ethers.ZeroAddress; // Update if Chainlink feed is available on Celo Alfajores

  console.log("📝 Contract Configuration:");
  console.log("  Price Feed:", PRICE_FEED_ADDRESS === ethers.ZeroAddress ? "None (will use default)" : PRICE_FEED_ADDRESS);
  console.log("");

  // Deploy RemitEscrow
  console.log("⏳ Deploying RemitEscrow contract...");
  const RemitEscrow = await ethers.getContractFactory("RemitEscrow");
  const remitEscrow = await RemitEscrow.deploy(PRICE_FEED_ADDRESS);

  await remitEscrow.waitForDeployment();
  const contractAddress = await remitEscrow.getAddress();

  console.log("✅ RemitEscrow deployed successfully!");
  console.log("  Contract address:", contractAddress);
  console.log("");

  // Get deployment transaction details
  const deploymentTx = remitEscrow.deploymentTransaction();
  if (deploymentTx) {
    console.log("📊 Deployment Transaction:");
    console.log("  Transaction hash:", deploymentTx.hash);
    console.log("  Block number:", deploymentTx.blockNumber);
    console.log("  Gas used:", deploymentTx.gasLimit.toString());
    console.log("");
  }

  // Verify initial contract state
  const platformFee = await remitEscrow.platformFeeBps();
  const feeCollector = await remitEscrow.feeCollector();
  const owner = await remitEscrow.owner();

  console.log("🔍 Contract State:");
  console.log("  Owner:", owner);
  console.log("  Platform fee:", Number(platformFee) / 100, "%");
  console.log("  Fee collector:", feeCollector);
  console.log("  Total remittances:", (await remitEscrow.getTotalRemittances()).toString());
  console.log("");

  // Save deployment info for frontend
  const deploymentInfo = {
    network: (await ethers.provider.getNetwork()).name,
    chainId: Number((await ethers.provider.getNetwork()).chainId),
    contractAddress: contractAddress,
    deployer: deployer.address,
    timestamp: new Date().toISOString(),
    blockNumber: deploymentTx?.blockNumber,
    transactionHash: deploymentTx?.hash,
  };

  console.log("💾 Deployment Info:");
  console.log(JSON.stringify(deploymentInfo, null, 2));
  console.log("");

  console.log("✨ Deployment complete!");
  console.log("");
  console.log("📋 Next Steps:");
  console.log("  1. Save the contract address for frontend configuration");
  console.log("  2. Update frontend/.env with VITE_CONTRACT_ADDRESS=" + contractAddress);
  console.log("  3. Verify the contract on Celoscan (optional):");
  console.log("     npx hardhat verify --network celoSepolia " + contractAddress + " " + PRICE_FEED_ADDRESS);
  console.log("  4. Test the contract functions before frontend integration");
  console.log("");
}

// Execute deployment
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Deployment failed:");
    console.error(error);
    process.exit(1);
  });
