# 🔧 Transaction Failure - Diagnosis & Fix

## Issues Found

### 1. ✅ React Warning - FIXED
**Error:** "Cannot update a component while rendering a different component"
**Fix Applied:** Moved state updates from render to `useEffect` hook
**Status:** ✅ Fixed in RemitForm.tsx

### 2. ⚠️ Transaction Failing - Multiple Possible Causes

---

## Common Causes & Solutions

### Cause #1: Wrong Network in MetaMask

**Symptoms:**
- Transaction confirms in MetaMask
- But then fails immediately
- No transaction hash appears on blockchain

**Solution:**

1. **Open MetaMask**
2. **Check which network you're connected to**
   - Should say: **"Celo Sepolia Testnet"**
   - NOT: "Ethereum Mainnet", "Hardhat", or "Localhost"

3. **If wrong network, add Celo Sepolia:**
   - Click network dropdown
   - Click "Add Network"
   - Manual entry:
     ```
     Network Name: Celo Sepolia Testnet
     RPC URL: https://forno.celo-sepolia.celo-testnet.org/
     Chain ID: 11142220
     Currency Symbol: CELO
     Block Explorer: https://sepolia.celoscan.io
     ```

4. **Switch to Celo Sepolia**
5. **Refresh the page**
6. **Try transaction again**

---

### Cause #2: Insufficient Testnet CELO

**Symptoms:**
- Transaction shows in MetaMask
- Fails with "insufficient funds" or similar

**Solution:**

1. **Check your CELO balance in MetaMask**
   - Should have at least 0.1 CELO for gas

2. **Get free testnet CELO:**
   - Visit: https://faucet.celo.org/alfajores
   - **IMPORTANT:** Switch faucet to "Sepolia" mode (not Alfajores!)
   - Paste your wallet address
   - Complete captcha
   - Wait 30-60 seconds
   - You should receive 5-10 testnet CELO

3. **Verify balance updated in MetaMask**

4. **Try transaction again**

---

### Cause #3: Gas Estimation Failure

**Symptoms:**
- MetaMask can't estimate gas
- Transaction fails before you even confirm

**Possible Issues:**
1. Contract function reverts
2. Invalid input parameters
3. Network connectivity issues

**Solutions:**

**A. Check Your Inputs:**
- **Recipient:** Must be valid address (0x...)
- **Amount:** Must be > 0
- **Purpose:** Must not be empty

**B. Test with Minimal Values:**
```
Recipient: Your own address
Amount: 0.1 (small amount)
Purpose: Test
```

**C. Check Contract is Deployed:**
Visit: https://sepolia.celoscan.io/address/0x6F491FaBdEc72fD14e9E014f50B2ffF61C508bf1

Should show:
- ✅ Contract exists
- ✅ Has code (not "No Contract Code")
- ✅ Has transactions

---

### Cause #4: RPC Connection Issues

**Symptoms:**
- Slow response
- Transactions hang
- Network errors

**Solution:**

1. **Check RPC URL in .env:**
   ```bash
   cat frontend/.env | grep RPC
   ```
   Should show: `VITE_RPC_URL=https://forno.celo-sepolia.celo-testnet.org/`

2. **Test RPC connectivity:**
   ```bash
   curl -X POST https://forno.celo-sepolia.celo-testnet.org/ \
     -H "Content-Type: application/json" \
     -d '{"jsonrpc":"2.0","method":"eth_blockNumber","params":[],"id":1}'
   ```
   Should return a block number

3. **Try alternative RPC:**
   Update `frontend/.env`:
   ```
   VITE_RPC_URL=https://alfajores-forno.celo-testnet.org/
   ```

4. **Restart dev server:**
   - Press Ctrl+C in terminal
   - Run: `npm run dev`

---

## Step-by-Step Debugging

### Step 1: Verify Network

```bash
# In browser console (F12):
window.ethereum.request({ method: 'eth_chainId' })
```

**Expected:** `"0xa9fd0c"` (hex for 11142220)
**If different:** You're on wrong network!

### Step 2: Verify Balance

```bash
# In browser console:
window.ethereum.request({
  method: 'eth_getBalance',
  params: [YOUR_ADDRESS, 'latest']
})
```

**Expected:** Should return a value in hex (not "0x0")
**If "0x0":** You have no CELO, get from faucet!

### Step 3: Verify Contract Exists

```bash
# In browser console:
window.ethereum.request({
  method: 'eth_getCode',
  params: ['0x6F491FaBdEc72fD14e9E014f50B2ffF61C508bf1', 'latest']
})
```

**Expected:** Long hex string (contract code)
**If "0x":** Contract not deployed on this network!

### Step 4: Check Transaction Error

1. Open browser console (F12)
2. Go to "Console" tab
3. Try to create remittance
4. Look for error message
5. Common errors:
   - "insufficient funds" → Get testnet CELO
   - "execution reverted" → Check inputs
   - "network error" → Check RPC connection
   - "nonce too high" → Reset MetaMask (Settings → Advanced → Reset Account)

---

## Quick Fix Checklist

Run through this checklist:

- [ ] **React warning fixed** (refresh browser to load new code)
- [ ] **MetaMask connected to Celo Sepolia** (Chain ID: 11142220)
- [ ] **Have testnet CELO** (at least 0.1 CELO for gas)
- [ ] **Valid recipient address** (starts with 0x, 42 characters)
- [ ] **Valid amount** (greater than 0, e.g., 0.1 or 1)
- [ ] **Non-empty purpose** (any text)
- [ ] **Contract verified** (visit Celoscan link above)
- [ ] **No console errors** (check F12 console)

---

## If Still Failing

### Get Detailed Error Info:

1. **Open browser DevTools (F12)**
2. **Go to Console tab**
3. **Clear console (🚫 icon)**
4. **Try creating remittance**
5. **Copy the FULL error message**
6. **Share the error for specific diagnosis**

### Common Error Messages:

**Error:** "execution reverted: InvalidRecipient"
**Fix:** Recipient address is zero address (0x0000...) - use valid address

**Error:** "execution reverted: InvalidAmount"
**Fix:** Amount is 0 - enter positive number

**Error:** "execution reverted: InvalidPurpose"
**Fix:** Purpose is empty - enter text

**Error:** "insufficient funds for gas"
**Fix:** Get testnet CELO from faucet

**Error:** "nonce too high"
**Fix:** MetaMask → Settings → Advanced → Reset Account (won't lose funds)

---

## Working Test Transaction

To verify everything works, try this exact transaction:

```
Network: Celo Sepolia (Chain ID: 11142220)
Recipient: 0x70997970C51812dc3A010C7d01b50e0d17dc79C8
Amount: 0.1
Purpose: Test Transaction

Expected Gas: ~150,000 gas (~$0.01)
Expected Total: 0.1 CELO + gas
```

If this works → Your setup is correct!
If this fails → Check network and balance

---

## Emergency Reset

If nothing works:

1. **Refresh browser** (Ctrl + Shift + R)
2. **Disconnect wallet** (in app)
3. **Reset MetaMask account:**
   - MetaMask → Settings → Advanced
   - "Reset Account" (clears transaction history)
4. **Reconnect wallet**
5. **Verify network is Celo Sepolia**
6. **Try again with 0.1 CELO**

---

## Expected Successful Flow

When it works correctly, you'll see:

1. Click "Create Remittance"
2. MetaMask popup appears
3. Shows:
   ```
   Network: Celo Sepolia Testnet
   Contract: 0x6F49...8bf1
   Amount: 0 CELO (for create, only gas)
   Gas: ~$0.01
   ```
4. Click "Confirm"
5. Transaction pending...
6. ✅ Success notification
7. Remittance card appears (within 3 seconds)
8. Check on Celoscan: https://sepolia.celoscan.io/

---

## Still Stuck?

Share this info for diagnosis:

1. **MetaMask network name:** ___________
2. **MetaMask chain ID:** ___________
3. **CELO balance:** ___________
4. **Full error message from console:** ___________
5. **Input values used:**
   - Recipient: ___________
   - Amount: ___________
   - Purpose: ___________

This will help identify the exact issue!
