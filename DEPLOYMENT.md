# RemitEasy Deployment Guide

Complete guide for deploying RemitEasy to production.

## Prerequisites

- Node.js 18+ installed
- Git repository set up
- Vercel account (https://vercel.com)
- Celo wallet with testnet CELO for gas
- WalletConnect Project ID (https://cloud.walletconnect.com)

---

## 1. Smart Contract Deployment to Celo Sepolia

### Step 1: Configure Environment

Create `contracts/.env`:

```bash
# Your deployer private key (DO NOT commit!)
PRIVATE_KEY=your_private_key_here

# Celo Sepolia RPC
CELO_SEPOLIA_RPC=https://forno.celo-sepolia.celo-testnet.org

# Optional: Celoscan API key for verification
CELOSCAN_API_KEY=your_celoscan_api_key
```

### Step 2: Deploy Contract

```bash
cd contracts
npm run deploy:sepolia
```

### Step 3: Verify Contract on Celoscan

```bash
npx hardhat verify --network celoSepolia <CONTRACT_ADDRESS> <PRICE_FEED_ADDRESS>

# For RemitEscrow deployed with no price feed (zero address):
npx hardhat verify --network celoSepolia 0x6F491FaBdEc72fD14e9E014f50B2ffF61C508bf1 0x0000000000000000000000000000000000000000
```

### Step 4: Note Deployment Information

Save the following from deployment output:
- Contract Address
- Transaction Hash
- Block Number
- Deployer Address

**Current Deployment:**
- Network: Celo Sepolia
- Contract: `0x6F491FaBdEc72fD14e9E014f50B2ffF61C508bf1`
- Explorer: https://sepolia.celoscan.io/address/0x6F491FaBdEc72fD14e9E014f50B2ffF61C508bf1

---

## 2. Frontend Deployment to Vercel

### Option A: Deploy via Vercel CLI (Recommended)

#### Step 1: Install Vercel CLI

```bash
npm install -g vercel
```

#### Step 2: Login to Vercel

```bash
vercel login
```

#### Step 3: Deploy

```bash
# From project root
vercel

# For production deployment
vercel --prod
```

#### Step 4: Set Environment Variables

After first deployment, go to Vercel Dashboard → Project Settings → Environment Variables and add:

```
VITE_CONTRACT_ADDRESS=0x6F491FaBdEc72fD14e9E014f50B2ffF61C508bf1
VITE_RPC_URL=https://forno.celo-sepolia.celo-testnet.org/
VITE_CHAIN_ID=11142220
VITE_WALLETCONNECT_PROJECT_ID=your_walletconnect_project_id
```

#### Step 5: Redeploy

```bash
vercel --prod
```

### Option B: Deploy via Vercel Dashboard

#### Step 1: Push to GitHub

```bash
git add .
git commit -m "Ready for deployment"
git push origin main
```

#### Step 2: Import to Vercel

1. Go to https://vercel.com/new
2. Import your GitHub repository
3. Configure build settings:
   - Framework Preset: **Vite**
   - Root Directory: **frontend**
   - Build Command: `npm run build`
   - Output Directory: `dist`

#### Step 3: Add Environment Variables

In Vercel project settings, add all environment variables from Step 4 above.

#### Step 4: Deploy

Click **Deploy** button.

---

## 3. Post-Deployment Verification

### Test the Deployment

1. **Visit the deployed URL**
   - Example: https://remiteasy.vercel.app

2. **Test wallet connection**
   - Click "Connect Wallet"
   - Connect with MetaMask
   - Switch to Celo Sepolia if prompted

3. **Test MiniPay phone resolution**
   - Toggle to "Phone (MiniPay)" mode
   - Click "Show test phone numbers"
   - Select a test number
   - Verify it resolves to an address

4. **Create a test remittance**
   - Enter target amount (e.g., 10 cUSD)
   - Enter purpose
   - Submit transaction
   - Confirm in wallet

5. **Verify on Celoscan**
   - Check transaction appears on blockchain
   - Verify contract interaction

### Update README with Live URL

Update the README.md with your deployed URL:

```markdown
## Live Demo

**Frontend:** https://your-app.vercel.app
**Smart Contract:** https://sepolia.celoscan.io/address/0x6F491FaBdEc72fD14e9E014f50B2ffF61C508bf1
```

---

## 4. Monitoring & Maintenance

### Vercel Analytics

Enable Vercel Analytics in dashboard:
- Project Settings → Analytics → Enable

### Sentry Error Tracking (Optional)

1. Create Sentry account
2. Add Sentry SDK:
   ```bash
   cd frontend
   npm install @sentry/react
   ```

3. Configure in `main.tsx`

### Contract Monitoring

- Monitor transactions: https://sepolia.celoscan.io
- Check contract balance regularly
- Monitor gas costs

---

## 5. Mainnet Deployment (Future)

When ready for mainnet:

### Contract Changes

1. Update `hardhat.config.ts`:
   ```typescript
   celoMainnet: {
     url: "https://forno.celo.org",
     accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
     chainId: 42220,
   }
   ```

2. Deploy to mainnet:
   ```bash
   npm run deploy:mainnet
   ```

### Frontend Changes

1. Update environment variables:
   ```
   VITE_CHAIN_ID=42220
   VITE_RPC_URL=https://forno.celo.org
   VITE_CONTRACT_ADDRESS=<new_mainnet_address>
   ```

2. Update Wagmi config for mainnet
3. Add mainnet price feed address
4. Thorough testing before launch

---

## 6. Troubleshooting

### Common Issues

**Build fails on Vercel:**
- Check Node.js version (use 18+)
- Verify all dependencies in package.json
- Check build logs for specific errors

**Wallet connection fails:**
- Verify WalletConnect Project ID
- Check RPC URL is accessible
- Ensure chain ID is correct

**Transactions fail:**
- Check wallet has sufficient CELO for gas
- Verify contract address is correct
- Check network is Celo Sepolia

**Phone resolution not working:**
- Verify test numbers are in minipay.ts
- Check console for errors
- Ensure @celo/identity is installed

### Get Help

- GitHub Issues: https://github.com/your-repo/issues
- Celo Discord: https://discord.gg/celo
- Vercel Support: https://vercel.com/support

---

## 7. Security Checklist

Before mainnet deployment:

- [ ] Audit smart contract code
- [ ] Test all functions thoroughly
- [ ] Set up monitoring and alerts
- [ ] Enable rate limiting on frontend
- [ ] Add proper error handling
- [ ] Implement access controls
- [ ] Test with multiple wallets
- [ ] Verify gas optimization
- [ ] Check for reentrancy vulnerabilities
- [ ] Test emergency functions
- [ ] Set up backup RPC providers
- [ ] Configure CORS properly
- [ ] Add CSP headers
- [ ] Enable HTTPS only
- [ ] Test on multiple devices/browsers

---

## Success! 🎉

Your RemitEasy dApp is now deployed and ready for the hackathon!

**Share your deployment:**
- Frontend URL
- Contract address
- Demo video
- GitHub repository

Good luck with your submission!
