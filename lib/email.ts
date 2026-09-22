export interface LeadEmailData {
  fullName: string;
  whatsappNumber: string;
  nrkLocation: string;
  parentTown: string;
  leadType: 'Lead_Submitted' | 'Callback_Requested';
  selectedPlanName?: string;
  leadId?: string;
}

export async function sendLeadNotificationEmail(data: LeadEmailData): Promise<{ success: boolean; message?: string }> {
  const apiKey = process.env.RESEND_API_KEY;
  const recipientEmail = process.env.LEAD_NOTIFICATION_EMAIL || 'info@zynthexion.com';
  
  if (!apiKey) {
    console.warn('RESEND_API_KEY is not configured in environment variables. Email notification skipped.');
    return { success: false, message: 'RESEND_API_KEY environment variable missing' };
  }

  const isCallback = data.leadType === 'Callback_Requested';
  const subjectText = isCallback
    ? `📞 CARE MANAGER REQUEST: ${data.fullName} (${data.nrkLocation})`
    : `🎉 NEW THANAL LEAD: ${data.fullName} (${data.parentTown})`;

  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #f4f6f8; margin: 0; padding: 20px; color: #333; }
          .container { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; border: 1px solid #e1e8ed; box-shadow: 0 4px 12px rgba(0,0,0,0.05); }
          .header { background: #044749; color: #ffffff; padding: 28px 24px; text-align: center; }
          .header h1 { margin: 0; font-size: 22px; font-weight: 800; letter-spacing: -0.5px; }
          .badge { display: inline-block; background: #E66323; color: #ffffff; font-size: 12px; font-weight: 700; padding: 4px 12px; border-radius: 20px; margin-top: 10px; text-transform: uppercase; }
          .content { padding: 28px 24px; }
          .field-group { margin-bottom: 20px; border-bottom: 1px solid #f0f4f8; padding-bottom: 14px; }
          .field-group:last-child { border-bottom: none; }
          .label { font-size: 12px; font-weight: 700; color: #044749; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 4px; }
          .value { font-size: 16px; font-weight: 600; color: #1e293b; }
          .cta-box { background: #fff7ed; border: 1px solid #ffedd5; border-radius: 12px; padding: 18px; margin-top: 24px; text-align: center; }
          .wa-btn { display: inline-block; background: #25D366; color: #ffffff; font-weight: 700; font-size: 15px; padding: 12px 24px; border-radius: 8px; text-decoration: none; margin-top: 10px; }
          .footer { background: #f8fafc; padding: 16px 24px; text-align: center; font-size: 12px; color: #64748b; border-top: 1px solid #e2e8f0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Thanal Eldercare Lead Notification</h1>
            <div class="badge">${isCallback ? 'Callback Requested' : 'Lead Registration'}</div>
          </div>
          <div class="content">
            <div class="field-group">
              <div class="label">Customer Full Name</div>
              <div class="value">${data.fullName}</div>
            </div>
            
            <div class="field-group">
              <div class="label">WhatsApp Number</div>
              <div class="value"><a href="https://wa.me/${data.whatsappNumber.replace(/[^0-9]/g, '')}" style="color: #E66323; text-decoration: none;">${data.whatsappNumber}</a></div>
            </div>

            <div class="field-group">
              <div class="label">Expat / NRK Location</div>
              <div class="value">${data.nrkLocation}</div>
            </div>

            <div class="field-group">
              <div class="label">Parent's Town / Area in Kannur</div>
              <div class="value">${data.parentTown}</div>
            </div>

            <div class="field-group">
              <div class="label">Selected Coverage Plan</div>
              <div class="value">${data.selectedPlanName || 'Thanal Inaugural Pilot Plan'}</div>
            </div>

            <div class="cta-box">
              <div style="font-weight: 700; color: #9a3412; margin-bottom: 4px;">Direct Quick Action</div>
              <div style="font-size: 13px; color: #c2410c;">Contact this customer on WhatsApp immediately:</div>
              <a href="https://wa.me/${data.whatsappNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Hi ${data.fullName}, thank you for registering with Thanal Eldercare. I am your Care Manager.`)}" class="wa-btn" target="_blank">
                Chat on WhatsApp with ${data.fullName}
              </a>
            </div>
          </div>
          <div class="footer">
            Received via Thanal Landing Page • Product of Zynthexion Technologies Pvt. Ltd.
          </div>
        </div>
      </body>
    </html>
  `;

  // Resend API endpoint
  // Try sending from info@zynthexion.com first. If domain isn't verified yet on Resend, fallback to onboarding@resend.dev
  const fromEmail = process.env.RESEND_FROM_EMAIL || 'info@zynthexion.com';

  const sendWithEmail = async (sender: string) => {
    return await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: `Thanal Care <${sender}>`,
        to: [recipientEmail],
        subject: subjectText,
        html: htmlContent
      })
    });
  };

  try {
    let response = await sendWithEmail(fromEmail);
    
    // Fallback if domain is unverified on Resend sandbox mode
    if (!response.ok) {
      const errText = await response.text();
      console.warn(`Resend email from ${fromEmail} failed (${response.status}): ${errText}. Retrying with onboarding@resend.dev...`);
      response = await sendWithEmail('onboarding@resend.dev');
    }

    if (response.ok) {
      const result = await response.json();
      console.log('Lead notification email sent successfully:', result);
      return { success: true };
    } else {
      const errText = await response.text();
      console.error('Resend API error:', errText);
      return { success: false, message: errText };
    }
  } catch (error: any) {
    console.error('Failed to dispatch lead email:', error);
    return { success: false, message: error?.message || 'Email dispatch failed' };
  }
}
