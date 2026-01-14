/**
 * Smart Contract Error Mapping
 * Maps raw contract error codes and messages to user-friendly, actionable feedback
 */

export enum ErrorCode {
    INVALID_RECIPIENT = 'InvalidRecipient',
    INVALID_AMOUNT = 'InvalidAmount',
    INVALID_PURPOSE = 'InvalidPurpose',
    REMITTANCE_NOT_FOUND = 'RemittanceNotFound',
    NOT_RECIPIENT = 'NotRecipient',
    NOT_CREATOR = 'NotCreator',
    TARGET_NOT_MET = 'TargetNotMet',
    ALREADY_RELEASED = 'AlreadyReleased',
    ALREADY_CANCELLED = 'AlreadyCancelled',
    TRANSFER_FAILED = 'TransferFailed',
    INVALID_FEE = 'InvalidFee',
    OWNABLE_UNAUTHORIZED = 'OwnableUnauthorizedAccount',
}

export interface AppError {
    code: string
    message: string
    action?: string
}

/**
 * Maps a raw error (from wagmi/viem) to a user-friendly AppError
 */
export function mapContractError(error: any): AppError {
    const errorMessage = error?.message || String(error)

    // Check for custom contract errors in the message
    if (errorMessage.includes(ErrorCode.INVALID_RECIPIENT)) {
        return {
            code: ErrorCode.INVALID_RECIPIENT,
            message: 'The recipient address is invalid.',
            action: 'Please check the address and try again.',
        }
    }

    if (errorMessage.includes(ErrorCode.INVALID_AMOUNT)) {
        return {
            code: ErrorCode.INVALID_AMOUNT,
            message: 'The amount provided is invalid.',
            action: 'Ensure the amount is greater than zero and you have sufficient balance.',
        }
    }

    if (errorMessage.includes(ErrorCode.INVALID_PURPOSE)) {
        return {
            code: ErrorCode.INVALID_PURPOSE,
            message: 'The purpose description is required.',
            action: 'Please enter a brief description for this remittance.',
        }
    }

    if (errorMessage.includes(ErrorCode.REMITTANCE_NOT_FOUND)) {
        return {
            code: ErrorCode.REMITTANCE_NOT_FOUND,
            message: 'The requested remittance could not be found.',
            action: 'It may have been cancelled or the ID is incorrect.',
        }
    }

    if (errorMessage.includes(ErrorCode.NOT_RECIPIENT)) {
        return {
            code: ErrorCode.NOT_RECIPIENT,
            message: 'Only the designated recipient can release these funds.',
            action: 'Please switch to the recipient wallet address.',
        }
    }

    if (errorMessage.includes(ErrorCode.NOT_CREATOR)) {
        return {
            code: ErrorCode.NOT_CREATOR,
            message: 'Only the creator can cancel this remittance.',
            action: 'Please switch to the wallet that created this request.',
        }
    }

    if (errorMessage.includes(ErrorCode.TARGET_NOT_MET)) {
        return {
            code: ErrorCode.TARGET_NOT_MET,
            message: 'The target amount has not been reached yet.',
            action: 'Wait for more contributions before releasing funds.',
        }
    }

    if (errorMessage.includes(ErrorCode.ALREADY_RELEASED)) {
        return {
            code: ErrorCode.ALREADY_RELEASED,
            message: 'Funds for this remittance have already been released.',
        }
    }

    if (errorMessage.includes(ErrorCode.ALREADY_CANCELLED)) {
        return {
            code: ErrorCode.ALREADY_CANCELLED,
            message: 'This remittance has already been cancelled.',
        }
    }

    // Handle common wallet/network errors
    if (errorMessage.includes('user rejected') || errorMessage.includes('User rejected')) {
        return {
            code: 'USER_REJECTED',
            message: 'Transaction was cancelled in your wallet.',
            action: 'Please try again and approve the transaction.',
        }
    }

    if (errorMessage.includes('insufficient funds')) {
        return {
            code: 'INSUFFICIENT_FUNDS',
            message: 'You do not have enough CELO/cUSD to cover this transaction.',
            action: 'Add more funds to your wallet and try again.',
        }
    }

    // Default fallback error
    return {
        code: 'UNKNOWN_ERROR',
        message: 'An unexpected error occurred with the transaction.',
        action: 'Please try again or contact support if the issue persists.',
    }
}
