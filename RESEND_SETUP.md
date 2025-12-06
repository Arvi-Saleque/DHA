# 🚨 RESEND EMAIL SETUP - PRODUCTION FIX

## Current Issue
Your Resend API key is in **test mode**, which only allows sending to your verified email (`alifsalek.as@gmail.com`). 

Error: `"You can only send testing emails to your own email address"`

---

## ✅ SOLUTION: Verify Your Domain on Resend

### Step 1: Add Domain to Resend
1. Go to: **https://resend.com/domains**
2. Click **"Add Domain"**
3. Enter your domain: `darulhikmah.edu.bd` (or whatever your production domain is)

### Step 2: Add DNS Records
Resend will provide DNS records like:
```
Type: TXT
Name: resend._domainkey
Value: v=DKIM1; k=rsa; p=MIGfMA0GCSqG...
```

Add these records to your domain registrar (GoDaddy, Namecheap, etc.)

### Step 3: Verify Domain
- Wait 5-10 minutes for DNS propagation
- Click **"Verify"** in Resend dashboard
- Status should change to ✅ **Verified**

### Step 4: Update Vercel Environment Variables
In Vercel Project Settings → Environment Variables:

```env
RESEND_API_KEY=re_xxxxxxxxxxxxxxx
RESEND_FROM_EMAIL=noreply@darulhikmah.edu.bd
NEXT_PUBLIC_APP_URL=https://your-production-domain.vercel.app
```

**Important:** Change `RESEND_FROM_EMAIL` from `onboarding@resend.dev` to your verified domain!

### Step 5: Redeploy
After saving env vars, go to Vercel Dashboard → Deployments → Click "Redeploy"

---

## 🔄 ALTERNATIVE: Test Mode (For Testing Only)

If you just want to test emails quickly:

1. Go to: **https://resend.com/audiences**
2. Add your test recipient emails as **Test Recipients**
3. Keep using `onboarding@resend.dev` as FROM address
4. This allows sending to those specific emails without domain verification

---

## 📝 Current Configuration

Your current setup in code:
- ✅ Error handling: Already implemented
- ✅ Graceful fallback: Already working
- ✅ Automatic notifications: Already integrated in all APIs
- ⚠️ FROM email: Currently `onboarding@resend.dev` (needs to be changed after domain verification)

---

## 🎯 After Setup Works

Once domain is verified and emails are working:

1. **Test it**: Add a new assignment/news from admin panel
2. **Check inbox**: Subscribers should receive email
3. **Monitor**: Check Vercel logs (Functions tab) for email sending status

---

## 🆘 Still Having Issues?

Check these:
1. Verify env variables are saved in Vercel (Settings → Environment Variables)
2. Check you redeployed after adding env vars
3. Look at Vercel function logs for error messages
4. Ensure subscribers exist in database (`/api/newsletter` endpoint)
5. Make sure RESEND_API_KEY is correct (starts with `re_`)

---

## 📧 Email Flow in Your App

**Automatic Notifications** (when admin adds content):
- Assignments → Email sent automatically
- Exam Routine → Email sent automatically  
- Class Routine → Email sent automatically
- Scholarship → Email sent automatically
- Exam Results → Email sent automatically
- News & Events → Email sent automatically
- Curriculum → Email sent automatically
- Syllabus → Email sent automatically
- Academic Calendar → Email sent automatically
- Admission Fee → Email sent automatically
- Next Exams → Email sent automatically
- Today's Absences → Email sent automatically

**Manual Notifications** (from admin panel):
- `/admin/newsletter` → Send custom emails to all subscribers

All emails now have improved error handling for domain verification issues!
