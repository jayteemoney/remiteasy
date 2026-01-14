/**
 * RPC Rate Limiting Utility
 * Prevents excessive calls to the blockchain RPC by throttling requests
 */

interface RateLimitOptions {
    maxRequests: number
    windowMs: number
}

class RateLimiter {
    private requests: number[] = []
    private options: RateLimitOptions

    constructor(options: RateLimitOptions) {
        this.options = options
    }

    /**
     * Checks if a request is allowed under the rate limit
     * Returns true if allowed, false if throttled
     */
    canRequest(): boolean {
        const now = Date.now()
        // Remove expired requests
        this.requests = this.requests.filter(timestamp => now - timestamp < this.options.windowMs)

        if (this.requests.length < this.options.maxRequests) {
            this.requests.push(now)
            return true
        }

        return false
    }

    /**
     * Executes a request with rate limiting
     * Throws an error if rate limit is exceeded
     */
    async execute<T>(requestFn: () => Promise<T>): Promise<T> {
        if (!this.canRequest()) {
            throw new Error('Rate limit exceeded. Please wait a moment before trying again.')
        }
        return requestFn()
    }
}

// Global rate limiter for RPC calls: 50 requests per 10 seconds
export const rpcRateLimiter = new RateLimiter({
    maxRequests: 50,
    windowMs: 10000,
})
