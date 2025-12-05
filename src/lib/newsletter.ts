// Helper function to notify newsletter subscribers
export async function notifySubscribers(data: {
  type: "news" | "academic";
  title: string;
  message: string;
  link?: string;
}) {
  try {
    const response = await fetch("/api/newsletter/notify", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Error notifying subscribers:", error);
    return { success: false, error };
  }
}

// Server-side function for automatic notifications
export async function sendAutomaticNotification(data: {
  type: "news" | "academic";
  title: string;
  message: string;
  link?: string;
}) {
  try {
    // Import dynamically to avoid edge runtime issues
    const Newsletter = (await import("@/models/Newsletter")).default;
    const { Resend } = await import("resend");
    const connectDB = (await import("@/lib/mongodb")).default;

    await connectDB();
    
    const subscribers = await Newsletter.find({ status: "active" });
    
    if (subscribers.length === 0) {
      console.log("📧 No subscribers to notify");
      return { success: true, message: "No subscribers" };
    }

    const resendApiKey = process.env.RESEND_API_KEY;
    
    if (!resendApiKey || resendApiKey === 'your-resend-api-key') {
      console.log(`📧 Would notify ${subscribers.length} subscribers (Resend not configured)`);
      return { success: true, message: "Preview mode - Resend not configured" };
    }

    const resend = new Resend(resendApiKey);
    const siteUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const siteName = process.env.NEXT_PUBLIC_SITE_NAME || 'Madrasa Management';
    const fromEmail = process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev';

    const emailHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${data.title}</title>
        <style>
          body { 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            line-height: 1.6; 
            color: #333; 
            margin: 0;
            padding: 0;
            background-color: #f4f4f4;
          }
          .container { 
            max-width: 600px; 
            margin: 20px auto;
            background: white;
            border-radius: 10px;
            overflow: hidden;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
          }
          .header { 
            background: linear-gradient(135deg, #0891b2 0%, #06b6d4 100%); 
            color: white; 
            padding: 40px 30px; 
            text-align: center;
          }
          .header h1 {
            margin: 0;
            font-size: 28px;
            font-weight: 600;
          }
          .content { 
            padding: 40px 30px;
            background: #ffffff;
          }
          .badge { 
            background: #dbeafe; 
            color: #1e40af; 
            padding: 6px 12px; 
            border-radius: 6px; 
            font-size: 13px; 
            display: inline-block;
            margin-bottom: 20px;
            font-weight: 500;
          }
          .title {
            color: #0891b2;
            font-size: 24px;
            margin: 20px 0 15px;
            font-weight: 600;
          }
          .message {
            font-size: 16px;
            line-height: 1.8;
            color: #4b5563;
            margin: 20px 0;
          }
          .button { 
            display: inline-block; 
            background: #0891b2; 
            color: white; 
            padding: 14px 32px; 
            text-decoration: none; 
            border-radius: 6px; 
            margin: 25px 0;
            font-weight: 500;
          }
          .footer { 
            background: #f9fafb; 
            padding: 30px; 
            text-align: center;
            border-top: 1px solid #e5e7eb;
          }
          .footer p {
            margin: 8px 0;
            font-size: 13px;
            color: #6b7280;
          }
          .footer a {
            color: #0891b2;
            text-decoration: none;
          }
          .divider {
            height: 1px;
            background: #e5e7eb;
            margin: 25px 0;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>📬 ${siteName}</h1>
          </div>
          <div class="content">
            <span class="badge">${data.type === 'news' ? '📰 News & Events' : '📚 Academic Update'}</span>
            <h2 class="title">${data.title}</h2>
            <div class="message">${data.message.replace(/\n/g, '<br>')}</div>
            ${data.link ? `
              <div style="text-align: center;">
                <a href="${data.link}" class="button">View Details →</a>
              </div>
            ` : ''}
          </div>
          <div class="footer">
            <p><strong>This is an automatic notification</strong></p>
            <div class="divider"></div>
            <p>You're receiving this because you subscribed to our newsletter.</p>
            <p>
              <a href="${siteUrl}">Visit Website</a> | 
              <a href="${siteUrl}/contact">Contact Us</a>
            </p>
            <p style="margin-top: 15px; font-size: 12px; color: #9ca3af;">
              To unsubscribe, please visit our website and manage your subscription.
            </p>
          </div>
        </div>
      </body>
      </html>
    `;

    const emailText = `${siteName}\n\n${data.type === 'news' ? 'NEWS & EVENTS' : 'ACADEMIC UPDATE'}\n\n${data.title}\n\n${data.message}\n\n${data.link ? `View more: ${data.link}\n\n` : ''}---\nThis is an automatic notification.\nYou're receiving this because you subscribed to our newsletter.`;

    // Send emails in background
    const emailPromises = subscribers.map(subscriber => 
      resend.emails.send({
        from: fromEmail,
        to: subscriber.email,
        subject: `${data.type === 'news' ? '📰 News Update' : '📚 Academic Update'}: ${data.title}`,
        html: emailHtml,
        text: emailText,
      }).catch(err => {
        console.error(`Failed to send email to ${subscriber.email}:`, err);
        return null;
      })
    );

    await Promise.allSettled(emailPromises);
    
    console.log(`✅ Sent automatic notification to ${subscribers.length} subscribers: ${data.title}`);
    
    return { 
      success: true, 
      message: `Notification sent to ${subscribers.length} subscribers`,
      subscribersCount: subscribers.length 
    };
  } catch (error) {
    console.error("Error sending automatic notification:", error);
    return { success: false, error };
  }
}
