import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Newsletter from "@/models/Newsletter";
import { Resend } from "resend";

// POST - Send notification to all subscribers
export async function POST(request: Request) {
  // Initialize Resend only when the route is called, not at build time
  const resend = new Resend(process.env.RESEND_API_KEY);
  try {
    await connectDB();
    const body = await request.json();
    
    const { type, title, message, link } = body;
    
    if (!type || !title || !message) {
      return NextResponse.json(
        { success: false, message: "Type, title, and message are required" },
        { status: 400 }
      );
    }

    // Get all active subscribers
    const subscribers = await Newsletter.find({ status: "active" });
    
    if (subscribers.length === 0) {
      return NextResponse.json({ 
        success: false, 
        message: "No active subscribers found" 
      });
    }

    const siteUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const siteName = process.env.NEXT_PUBLIC_SITE_NAME || 'Madrasa Management';
    const fromEmail = process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev';

    // Email HTML template
    const emailHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${title}</title>
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
            transition: background 0.3s;
          }
          .button:hover {
            background: #0e7490;
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
          .footer a:hover {
            text-decoration: underline;
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
            <span class="badge">${type === 'news' ? '📰 News & Events' : '📚 Academic Update'}</span>
            <h2 class="title">${title}</h2>
            <div class="message">${message.replace(/\n/g, '<br>')}</div>
            ${link ? `
              <div style="text-align: center;">
                <a href="${link}" class="button">View Details →</a>
              </div>
            ` : ''}
          </div>
          <div class="footer">
            <p><strong>Thank you for staying connected with us!</strong></p>
            <div class="divider"></div>
            <p>You're receiving this email because you subscribed to our newsletter.</p>
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

    const emailText = `${siteName}\n\n${type === 'news' ? 'NEWS & EVENTS' : 'ACADEMIC UPDATE'}\n\n${title}\n\n${message}\n\n${link ? `View more: ${link}\n\n` : ''}---\nYou're receiving this email because you subscribed to our newsletter.\nVisit: ${siteUrl}`;

    // Send emails using Resend
    if (process.env.RESEND_API_KEY && process.env.RESEND_API_KEY !== 'your-resend-api-key') {
      try {
        console.log(`📧 Sending emails to ${subscribers.length} subscriber(s)...`);
        console.log('📧 From email:', fromEmail);
        console.log('📧 Subscribers:', subscribers.map(s => s.email).join(', '));
        
        // Send to all subscribers in batch
        const emailPromises = subscribers.map(async (subscriber) => {
          try {
            const result = await resend.emails.send({
              from: fromEmail,
              to: subscriber.email,
              subject: `${type === 'news' ? '📰 News Update' : '📚 Academic Update'}: ${title}`,
              html: emailHtml,
              text: emailText,
            });
            console.log(`✅ Email sent to ${subscriber.email}`, result);
            return { success: true, email: subscriber.email, result };
          } catch (error) {
            console.error(`❌ Failed to send email to ${subscriber.email}:`, error);
            return { success: false, email: subscriber.email, error };
          }
        });

        const results = await Promise.all(emailPromises);
        const successful = results.filter(r => r.success).length;
        const failed = results.filter(r => !r.success).length;
        
        console.log(`✅ Successfully sent ${successful} email(s)`);
        if (failed > 0) {
          console.log(`❌ Failed to send ${failed} email(s)`);
        }

        return NextResponse.json({ 
          success: true, 
          message: `Email notifications sent to ${successful} subscriber(s)${failed > 0 ? ` (${failed} failed)` : ''}`,
          subscribersCount: subscribers.length,
          successful,
          failed,
          results,
        });
      } catch (emailError) {
        console.error('❌ Error sending emails:', emailError);
        return NextResponse.json({ 
          success: false, 
          message: 'Failed to send email notifications. Please check your Resend API key.',
          error: emailError instanceof Error ? emailError.message : String(emailError)
        }, { status: 500 });
      }
    } else {
      // API key not configured - return preview
      console.log('⚠️ RESEND_API_KEY not configured. Email preview prepared.');
      console.log('📧 Would send to:', subscribers.length, 'subscribers');
      
      return NextResponse.json({ 
        success: true, 
        message: `Email preview prepared for ${subscribers.length} subscriber(s). Configure RESEND_API_KEY to send actual emails.`,
        subscribersCount: subscribers.length,
        note: 'Resend API key not configured. Add RESEND_API_KEY to your .env file.',
        emailPreview: {
          subject: `${type === 'news' ? '📰 News Update' : '📚 Academic Update'}: ${title}`,
          recipients: subscribers.map(s => s.email),
        }
      });
    }
  } catch (error: unknown) {
    console.error("Error sending notification:", error);
    return NextResponse.json(
      { 
        success: false,
        message: "Failed to send notification", 
        error: error instanceof Error ? error.message : String(error) 
      },
      { status: 500 }
    );
  }
}
