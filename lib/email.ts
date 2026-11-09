export interface LeadEmailAlertData {
  leadId: string;
  firstName: string;
  country: string;
}

export async function sendLeadNotificationEmail(data: LeadEmailAlertData): Promise<{ success: boolean; message?: string }> {
  const apiKey = process.env.RESEND_API_KEY;
  const recipientEmail = process.env.LEAD_NOTIFICATION_EMAIL || 'info@zynthexion.com';
  
  if (!apiKey) {
    console.warn('RESEND_API_KEY is not configured in environment variables. Email notification skipped.');
    return { success: false, message: 'RESEND_API_KEY environment variable missing' };
  }

  // Email alert to the team contains lead ID, first name and country only.
  // Contact details stay in the admin view behind login.
  const subjectText = `New Lead: ${data.leadId} - ${data.firstName} (${data.country})`;

  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #f4f6f8; margin: 0; padding: 20px; color: #333; }
          .container { max-width: 560px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; border: 1px solid #e1e8ed; box-shadow: 0 4px 12px rgba(0,0,0,0.05); }
          .header { background: #122617; color: #ffffff; padding: 24px; text-align: center; }
          .header h1 { margin: 0; font-size: 20px; font-weight: 800; letter-spacing: -0.5px; color: #F5D328; }
          .badge { display: inline-block; background: #183825; color: #EBF2E8; font-size: 11px; font-weight: 700; padding: 4px 12px; border-radius: 20px; margin-top: 10px; text-transform: uppercase; border: 1px solid rgba(245, 211, 40, 0.3); }
          .content { padding: 24px; }
          .field-group { margin-bottom: 16px; border-bottom: 1px solid #f0f4f8; padding-bottom: 12px; }
          .field-group:last-child { border-bottom: none; }
          .label { font-size: 11px; font-weight: 700; color: #183825; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 4px; }
          .value { font-size: 15px; font-weight: 600; color: #1e293b; }
          .notice-box { background: #F9F8F3; border: 1px solid #E8F0C8; border-radius: 12px; padding: 16px; margin-top: 20px; font-size: 12px; color: #374F3E; line-height: 1.5; }
          .admin-btn { display: inline-block; background: #122617; color: #F5D328; font-weight: 700; font-size: 14px; padding: 12px 24px; border-radius: 10px; text-decoration: none; margin-top: 14px; }
          .footer { background: #f8fafc; padding: 14px 24px; text-align: center; font-size: 11px; color: #64748b; border-top: 1px solid #e2e8f0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>New Lead Alert</h1>
            <div class="badge">Sample Request</div>
          </div>
          <div class="content">
            <div class="field-group">
              <div class="label">Lead ID</div>
              <div class="value font-mono">${data.leadId}</div>
            </div>
            
            <div class="field-group">
              <div class="label">First Name</div>
              <div class="value">${data.firstName}</div>
            </div>

            <div class="field-group">
              <div class="label">Country</div>
              <div class="value">${data.country}</div>
            </div>

            <div class="notice-box">
              <strong>Privacy Protection:</strong> Phone numbers and personal details are kept in the admin dashboard behind login.
              <div style="text-align: center;">
                <a href="https://rodasi.com/admin" class="admin-btn" target="_blank">
                  View in Admin Dashboard
                </a>
              </div>
            </div>
          </div>
          <div class="footer">
            Rodasi Eldercare • Product of Zynthexion Technologies Private Limited
          </div>
        </div>
      </body>
    </html>
  `;

  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        from: 'Rodasi Leads <onboarding@resend.dev>',
        to: [recipientEmail],
        subject: subjectText,
        html: htmlContent
      })
    });

    const resData = await res.json();
    if (!res.ok) {
      console.error('Resend API error:', resData);
      return { success: false, message: resData.message || 'Email delivery failed' };
    }

    return { success: true };
  } catch (err: any) {
    console.error('Failed to send lead alert email:', err);
    return { success: false, message: err.message };
  }
}

export interface LuxuryInquiryEmailData {
  fullName: string;
  whatsappNumber: string;
  email?: string;
  currentLocation: string;
  inquiryFor: string;
  villaType: string;
  timeline: string;
  notes?: string;
  inquiryId: string;
}

export async function sendLuxuryInquiryEmail(data: LuxuryInquiryEmailData): Promise<{ success: boolean; message?: string }> {
  const apiKey = process.env.RESEND_API_KEY;
  const recipientEmail = process.env.LEAD_NOTIFICATION_EMAIL || 'info@zynthexion.com';

  if (!apiKey) {
    console.warn('RESEND_API_KEY is not configured. Luxury email skipped.');
    return { success: false, message: 'RESEND_API_KEY missing' };
  }

  const subjectText = `Luxury Living Inquiry: ${data.inquiryId} - ${data.fullName} (${data.currentLocation})`;

  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
      </head>
      <body style="font-family: sans-serif; padding: 20px;">
        <h2>Luxury Living Inquiry</h2>
        <p><strong>Name:</strong> ${data.fullName}</p>
        <p><strong>WhatsApp:</strong> ${data.whatsappNumber}</p>
        <p><strong>Email:</strong> ${data.email || 'N/A'}</p>
        <p><strong>Location:</strong> ${data.currentLocation}</p>
        <p><strong>Inquiring For:</strong> ${data.inquiryFor}</p>
        <p><strong>Villa Type:</strong> ${data.villaType}</p>
        <p><strong>Timeline:</strong> ${data.timeline}</p>
        <p><strong>Notes:</strong> ${data.notes || 'None'}</p>
      </body>
    </html>
  `;

  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        from: 'Rodasi Living <onboarding@resend.dev>',
        to: [recipientEmail],
        subject: subjectText,
        html: htmlContent
      })
    });
    return { success: res.ok };
  } catch (error: any) {
    return { success: false, message: error?.message };
  }
}
