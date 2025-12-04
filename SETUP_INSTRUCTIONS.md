# MongoDB Atlas Setup Instructions

## What You Need to Do:

### 1. MongoDB Atlas Setup (CURRENT STEP)

Based on your screenshot, you're on the right page!

#### A. Create Cluster:
1. ✅ You see the "Create a cluster" button - **Click "+ Create"**
2. Select **M0 Free tier**
3. Choose **AWS** as provider
4. Select region closest to you
5. Name: `madrasa-cluster`
6. Click **Create Deployment**

#### B. Create Database User (After cluster creation):
1. MongoDB will prompt: "Create a database user"
2. **Username:** `madrasaAdmin` (or your choice)
3. **Password:** Click "Autogenerate" and **COPY IT** (save somewhere safe!)
4. Click **Create Database User**

#### C. Whitelist IP Address:
1. Next prompt: "Where would you like to connect from?"
2. Click **"Add My Current IP Address"**
3. For development, also add: **"Allow Access from Anywhere"** (0.0.0.0/0)
4. Click **Finish and Close**

#### D. Get Connection String:
1. After cluster is ready (takes 1-3 minutes)
2. Click **"Connect"** button
3. Choose **"Drivers"**
4. Select **Node.js** driver
5. **Copy the connection string** - looks like:
   ```
   mongodb+srv://madrasaAdmin:<password>@madrasa-cluster.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
6. **Important:** Replace `<password>` with your actual password

### 2. Update Your .env.local File

Open the `.env.local` file in your project and:

1. Replace this line:
   ```
   MONGODB_URI=mongodb+srv://madrasaAdmin:<password>@madrasa-cluster.xxxxx.mongodb.net/madrasa_db?retryWrites=true&w=majority
   ```
   
   With your actual connection string from MongoDB Atlas

2. Make sure to:
   - Replace `<password>` with your database user password
   - Add `/madrasa_db` before the `?` to specify database name
   - Keep `?retryWrites=true&w=majority` at the end

3. Example of what it should look like:
   ```
   MONGODB_URI=mongodb+srv://madrasaAdmin:MySecurePass123@madrasa-cluster.abc123.mongodb.net/madrasa_db?retryWrites=true&w=majority
   ```

### 3. Install Required Packages

Open terminal in your project and run:

```bash
npm install mongoose bcryptjs jsonwebtoken
npm install -D @types/bcryptjs @types/jsonwebtoken
```

### 4. Test Connection

After I create the connection files, you can test by:

```bash
npm run dev
```

Then visit: http://localhost:3000/api/test-db

---

## Quick Checklist:

- [ ] MongoDB Atlas cluster created
- [ ] Database user created and password saved
- [ ] IP address whitelisted
- [ ] Connection string copied
- [ ] .env.local file updated with real connection string
- [ ] Packages installed
- [ ] Connection tested

---

## Common Issues:

**"MongoServerError: bad auth"**
- Check your password in connection string is correct
- Make sure you replaced `<password>` with actual password

**"Connection timeout"**
- Check IP whitelist in MongoDB Atlas
- Add 0.0.0.0/0 to allow all IPs (for development)

**"Database not found"**
- Make sure you added `/madrasa_db` in connection string
- Database will be created automatically when first data is inserted

---

## Next Steps After Setup:

1. I'll create the MongoDB connection file
2. Create authentication API routes
3. Create admin dashboard
4. Implement CRUD operations for each feature

Let me know when you've completed the MongoDB setup steps above!
