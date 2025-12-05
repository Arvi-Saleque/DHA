# Newsletter System - Setup Instructions

## 🎉 What's Been Implemented

Your website now has a complete newsletter subscription system with email notifications!

### ✅ Features:
1. **Newsletter Subscription Form** - In footer (appears on all pages)
2. **Subscriber Management** - Admin panel at `/admin/newsletter`
3. **Email Notifications** - Send updates to all subscribers
4. **Contact Messages** - Admin dashboard at `/admin/dashboard`
5. **Reply to Messages** - Direct email reply from dashboard

---

## 📧 Email Service Setup (Resend)

To send actual emails to subscribers, you need to set up Resend (it's free and easy):

### Step 1: Get Resend API Key

1. Go to [resend.com](https://resend.com)
2. Sign up for a free account (100 emails/day free)
3. Once logged in, go to **API Keys** section
4. Click **Create API Key**
5. Copy your API key

### Step 2: Configure Environment Variables

Open your `.env.local` file and update:

```env
# Resend Email Service
RESEND_API_KEY=re_your_actual_api_key_here
RESEND_FROM_EMAIL=onboarding@resend.dev

# Optional: Use your verified domain
# RESEND_FROM_EMAIL=notifications@yourdomain.com
```

### Step 3: (Optional) Add Your Domain

For production:
1. Go to Resend dashboard → **Domains**
2. Add your domain (e.g., `yourdomain.com`)
3. Update DNS records as instructed
4. Once verified, update `RESEND_FROM_EMAIL` to use your domain

---

## 🚀 How to Use

### For Visitors:

1. **Subscribe to Newsletter:**
   - Scroll to footer on any page
   - Enter email in "Newsletter" section
   - Click "Subscribe"

### For Admins:

1. **View Subscribers:**
   - Go to `/admin/newsletter`
   - See all subscribers with stats

2. **Send Notifications:**
   - Go to `/admin/newsletter`
   - Fill in the notification form:
     - Choose type (News & Events or Academic)
     - Enter title and message
     - Add optional link
   - Click "Send to X Subscriber(s)"

3. **View Contact Messages:**
   - Go to `/admin/dashboard`
   - See all messages from "Send us a Message" form
   - Click to view details
   - Reply via email or mark as replied

---

## 📝 Testing Without Resend

The system works without the API key configured:
- Subscription form will save emails to database ✅
- Admin can view all subscribers ✅
- Notification form will show email preview ✅
- Actual emails won't be sent (until API key is added) ⏸️

---

## 🎯 Email Templates

When you send notifications, subscribers receive:
- Professional HTML email with your branding
- Responsive design (looks good on mobile)
- Clear call-to-action button (if link provided)
- Unsubscribe information
- Newsletter type badge (News or Academic)

---

## 📊 Admin Features

### `/admin/newsletter` - Newsletter Management
- Total subscribers count
- Active subscribers
- New subscribers this month
- Send custom notifications
- Unsubscribe users
- View subscription dates

### `/admin/dashboard` - Contact Messages
- View all contact form submissions
- See unread message count
- Read message details
- Reply via email (opens email client)
- Mark as replied
- Delete messages

---

## 🔐 Security Notes

- Never commit `.env.local` to Git (already in `.gitignore`)
- Keep your Resend API key secret
- API keys are only used server-side (Next.js API routes)
- Subscriber emails are stored securely in MongoDB

---

## 💡 Tips

1. **Test First:** Before adding API key, test the subscription form to ensure data is saved
2. **Check Spam:** First emails might go to spam folder
3. **Verify Domain:** For better deliverability, verify your domain in Resend
4. **Monitor Usage:** Free plan has 100 emails/day (enough for testing)
5. **Upgrade Plan:** For production with many subscribers, consider paid plan

---

## 🐛 Troubleshooting

**Subscription form not working?**
- Check MongoDB connection
- Ensure API route `/api/newsletter` is accessible

**Emails not sending?**
- Verify RESEND_API_KEY is set correctly in `.env.local`
- Check Resend dashboard for errors
- Look at server logs for error messages

**Admin panel not showing subscribers?**
- Check MongoDB connection
- Ensure you're logged in as admin
- Check browser console for errors

---

## 📦 Packages Installed

- `resend` - Email service integration

---

## 🎨 Customization

To customize email templates, edit:
`src/app/api/newsletter/notify/route.ts`

Look for the `emailHtml` variable to modify:
- Colors
- Layout
- Branding
- Text content

---

## Need Help?

If you encounter any issues:
1. Check server logs for errors
2. Verify environment variables
3. Test API endpoints individually
4. Check Resend dashboard for delivery status

---

**System is ready to use! 🎉**
