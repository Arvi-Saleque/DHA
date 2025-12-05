# Quick Start - AUTOMATIC Newsletter Notifications

## 🎉 NEW: Fully Automatic!

**No manual email sending needed!** When you add content in the admin panel, subscribers are notified automatically.

---

## 🚀 5-Minute Setup

### Step 1: Get Resend API Key
1. Go to https://resend.com
2. Sign up (free account)
3. Navigate to "API Keys"
4. Click "Create API Key"
5. Copy the key (starts with `re_`)

### Step 2: Update Environment
Open `.env.local` and replace:
```env
RESEND_API_KEY=your-resend-api-key
```
With your actual key:
```env
RESEND_API_KEY=re_abc123xyz789...
```

### Step 3: Restart Server
```bash
# Stop the server (Ctrl+C)
npm run dev
```

### Step 4: Test It!
1. Subscribe via footer: `http://localhost:3000` (scroll to bottom)
2. Add an assignment or news in admin panel
3. Check your email! 📧 (Automatic notification sent!)

---

## ✨ What's Automatic Now

When you add content, emails are sent **automatically**:
- ✅ New assignment → Email sent
- ✅ Exam routine updated → Email sent
- ✅ Class routine added → Email sent
- ✅ Scholarship awarded → Email sent
- ✅ Exam results published → Email sent
- ✅ News/event posted → Email sent

**No manual sending required!**

---

## 📍 Important URLs

- **Admin Dashboard**: `/admin/dashboard` - Contact messages
- **Newsletter Admin**: `/admin/newsletter` - Manage subscribers & send emails
- **Public Contact**: `/contact` - Contact form
- **Footer**: Every page - Newsletter subscription

---

## ✅ Quick Test Checklist

- [ ] Subscribe via footer form
- [ ] Check subscriber appears in `/admin/newsletter`
- [ ] Send test notification
- [ ] Check email inbox (and spam)
- [ ] Submit contact form
- [ ] View message in `/admin/dashboard`
- [ ] Reply via email button

---

## 🎯 Common Issues

**"No subscribers found"**
→ Subscribe via footer first

**"Email preview prepared" message**
→ Add RESEND_API_KEY to .env.local

**Email not received**
→ Check spam folder
→ Verify API key is correct
→ Check Resend dashboard for errors

**Cannot access admin panel**
→ Login at `/admin/login`

---

## 📧 Default Settings

- **From Email**: `onboarding@resend.dev` (Resend's default)
- **Site Name**: `Madrasa Management`
- **Site URL**: `http://localhost:3000`

To customize, update `.env.local`:
```env
RESEND_FROM_EMAIL=notifications@yourdomain.com
NEXT_PUBLIC_SITE_NAME=Your School Name
NEXT_PUBLIC_APP_URL=https://yourwebsite.com
```

---

## 🎨 Email Template Location

To customize email design:
```
src/app/api/newsletter/notify/route.ts
```
Look for `emailHtml` variable (around line 40)

---

## 💾 Database Collections

- `contactmessages` - Contact form submissions
- `newsletters` - Email subscribers

View in MongoDB Compass or Atlas dashboard.

---

**That's it! You're ready to go! 🚀**

For detailed docs, see `NEWSLETTER_SETUP.md`
