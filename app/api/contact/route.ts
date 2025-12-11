/**
 * Contact Form API Route
 * 
 * Handles contact form submissions and sends emails via Resend.
 */

import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

// Initialize Resend with API key
const resend = new Resend(process.env.RESEND_API_KEY);

interface ContactFormData {
  name: string;
  email: string;
  phone?: string;
  reason: 'general' | 'appointment' | 'partnership' | 'support';
  preferredTime?: string;
  message: string;
  locale: 'en' | 'ar';
}

const reasonLabels = {
  general: { en: 'General Inquiry', ar: 'استفسار عام' },
  appointment: { en: 'Book an Appointment', ar: 'حجز موعد' },
  partnership: { en: 'Partnership Opportunity', ar: 'فرصة شراكة' },
  support: { en: 'Technical Support', ar: 'الدعم الفني' },
};

export async function POST(request: NextRequest) {
  try {
    const body: ContactFormData = await request.json();
    
    // Validate required fields
    if (!body.name || !body.email || !body.reason || !body.message) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(body.email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    const reasonLabel = reasonLabels[body.reason]?.en || body.reason;
    const isAppointment = body.reason === 'appointment';

    // Build email HTML content
    const emailHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>New Contact Form Submission</title>
        </head>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #0041A8 0%, #007BFF 100%); padding: 30px; border-radius: 12px 12px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 24px;">
              ${isAppointment ? '📅 New Appointment Request' : '✉️ New Contact Form Submission'}
            </h1>
          </div>
          
          <div style="background: #f9fafb; padding: 30px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 12px 12px;">
            <div style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
              <h2 style="color: #0063AF; margin-top: 0; font-size: 18px;">Contact Details</h2>
              
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 8px 0; color: #6b7280; width: 140px;"><strong>Name:</strong></td>
                  <td style="padding: 8px 0;">${body.name}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #6b7280;"><strong>Email:</strong></td>
                  <td style="padding: 8px 0;"><a href="mailto:${body.email}" style="color: #0063AF;">${body.email}</a></td>
                </tr>
                ${body.phone ? `
                <tr>
                  <td style="padding: 8px 0; color: #6b7280;"><strong>Phone:</strong></td>
                  <td style="padding: 8px 0;"><a href="tel:${body.phone}" style="color: #0063AF;">${body.phone}</a></td>
                </tr>
                ` : ''}
                <tr>
                  <td style="padding: 8px 0; color: #6b7280;"><strong>Reason:</strong></td>
                  <td style="padding: 8px 0;">
                    <span style="background: ${isAppointment ? '#dbeafe' : '#f3f4f6'}; color: ${isAppointment ? '#1d4ed8' : '#374151'}; padding: 4px 12px; border-radius: 20px; font-size: 14px;">
                      ${reasonLabel}
                    </span>
                  </td>
                </tr>
                ${body.preferredTime ? `
                <tr>
                  <td style="padding: 8px 0; color: #6b7280;"><strong>Preferred Time:</strong></td>
                  <td style="padding: 8px 0;">${body.preferredTime}</td>
                </tr>
                ` : ''}
                <tr>
                  <td style="padding: 8px 0; color: #6b7280;"><strong>Language:</strong></td>
                  <td style="padding: 8px 0;">${body.locale === 'ar' ? 'Arabic' : 'English'}</td>
                </tr>
              </table>
            </div>
            
            <div style="background: white; padding: 20px; border-radius: 8px;">
              <h2 style="color: #0063AF; margin-top: 0; font-size: 18px;">Message</h2>
              <p style="margin: 0; white-space: pre-wrap;">${body.message}</p>
            </div>
            
            <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #e5e7eb; text-align: center; color: #6b7280; font-size: 14px;">
              <p style="margin: 0;">This message was sent from the FiftyFifty ToolKit contact form.</p>
            </div>
          </div>
        </body>
      </html>
    `;

    // Send email via Resend
    const { data, error } = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || 'FiftyFifty ToolKit <onboarding@resend.dev>',
      to: process.env.CONTACT_EMAIL || 'contact@fiftyfifty.org',
      replyTo: body.email,
      subject: isAppointment 
        ? `📅 Appointment Request from ${body.name}`
        : `✉️ Contact Form: ${reasonLabel} from ${body.name}`,
      html: emailHtml,
    });

    if (error) {
      console.error('Resend error:', error);
      
      // Provide more specific error messages
      let errorMessage = 'Failed to send email';
      if (error.message?.includes('not verified')) {
        errorMessage = 'Email service configuration error. Please contact the administrator.';
      } else if (error.message?.includes('API key')) {
        errorMessage = 'Email service not configured. Please contact the administrator.';
      }
      
      return NextResponse.json(
        { error: errorMessage },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { success: true, messageId: data?.id },
      { status: 200 }
    );
  } catch (error) {
    console.error('Contact form error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

