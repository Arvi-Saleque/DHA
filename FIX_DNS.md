# Fix MongoDB Atlas DNS Connection Issue

The error `queryTxt EREFUSED` means your network/ISP is blocking MongoDB's SRV DNS records.

## Quick Fix Options:

### Option 1: Change Windows DNS to Google DNS (RECOMMENDED)
1. Open PowerShell as **Administrator**
2. Run these commands:
```powershell
# Get your network adapter name
Get-NetAdapter

# Set DNS to Google DNS (replace "Ethernet" with your adapter name)
Set-DnsClientServerAddress -InterfaceAlias "Ethernet" -ServerAddresses ("8.8.8.8","8.8.4.4")

# Flush DNS cache
ipconfig /flushdns
```

### Option 2: Get Standard Connection String from MongoDB Atlas
1. Go to MongoDB Atlas Dashboard: https://cloud.mongodb.com
2. Click **"Connect"** button on your cluster
3. Choose **"Connect your application"**
4. Look for **"Use a standard connection string instead"** or similar option
5. Copy the connection string that starts with `mongodb://` (not `mongodb+srv://`)
6. Replace the MONGODB_URI in .env.local with this new string

### Option 3: Use VPN or Mobile Hotspot
Some ISPs block MongoDB SRV queries. Try:
- Connect to a VPN service
- Use your phone's mobile hotspot
- Contact your ISP to unblock DNS queries

### Option 4: Use Cloudflare DNS
Similar to Google DNS:
```powershell
Set-DnsClientServerAddress -InterfaceAlias "Ethernet" -ServerAddresses ("1.1.1.1","1.0.0.1")
ipconfig /flushdns
```

## After fixing DNS, restart the server:
```bash
npm run dev
```

Then test: http://localhost:3002/api/test-db
