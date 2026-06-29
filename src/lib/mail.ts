import nodemailer from 'nodemailer';

interface BookingData {
  id: string;
  patientName: string;
  patientEmail: string;
  patientPhone: string;
  department: string;
  doctorId: string;
  doctorName: string;
  date: string;
  time: string;
  symptoms: string;
  status: string;
  createdAt: string;
}

interface EnquiryData {
  id: string;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  createdAt: string;
}

export async function sendNotificationEmail(
  data: any,
  type: 'booking' | 'enquiry'
): Promise<boolean> {
  const recipient = process.env.NOTIFICATION_EMAIL || 'mail.vmcmedical@gmail.com';
  
  // SMTP credentials from environment
  const smtpHost = process.env.SMTP_HOST || '';
  const smtpPort = parseInt(process.env.SMTP_PORT || '587', 10);
  const smtpUser = process.env.SMTP_USER || process.env.GMAIL_USER || '';
  const smtpPass = process.env.SMTP_PASS || process.env.GMAIL_PASS || '';
  const smtpSecure = process.env.SMTP_SECURE === 'true';

  let subject = '';
  let htmlContent = '';

  if (type === 'booking') {
    const booking = data as BookingData;
    subject = `📅 VMC Booking Confirmed - ${booking.patientName} (${booking.date})`;
    htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.05);">
        <div style="background-color: #043f65; padding: 20px; text-align: center; color: white;">
          <h2 style="margin: 0; font-size: 24px; font-weight: bold; letter-spacing: 0.5px;">VMC Medical Center</h2>
          <p style="margin: 5px 0 0 0; opacity: 0.8; font-size: 14px;">New Appointment Confirmation</p>
        </div>
        <div style="padding: 25px; background-color: #ffffff; color: #333333; line-height: 1.6;">
          <p style="font-size: 16px; margin-top: 0;">Hello Admin,</p>
          <p style="font-size: 15px;">A new appointment booking has been registered. Below are the details:</p>
          
          <table style="width: 100%; border-collapse: collapse; margin: 20px 0; font-size: 14px;">
            <tr style="background-color: #f7fafc;">
              <td style="padding: 10px; border-bottom: 1px solid #edf2f7; font-weight: bold; width: 140px; color: #4a5568;">Booking ID</td>
              <td style="padding: 10px; border-bottom: 1px solid #edf2f7; font-family: monospace; font-weight: bold; color: #043f65;">${booking.id}</td>
            </tr>
            <tr>
              <td style="padding: 10px; border-bottom: 1px solid #edf2f7; font-weight: bold; color: #4a5568;">Patient Name</td>
              <td style="padding: 10px; border-bottom: 1px solid #edf2f7;">${booking.patientName}</td>
            </tr>
            <tr style="background-color: #f7fafc;">
              <td style="padding: 10px; border-bottom: 1px solid #edf2f7; font-weight: bold; color: #4a5568;">Patient Email</td>
              <td style="padding: 10px; border-bottom: 1px solid #edf2f7;"><a href="mailto:${booking.patientEmail}" style="color: #0871b2; text-decoration: none;">${booking.patientEmail}</a></td>
            </tr>
            <tr>
              <td style="padding: 10px; border-bottom: 1px solid #edf2f7; font-weight: bold; color: #4a5568;">Patient Phone</td>
              <td style="padding: 10px; border-bottom: 1px solid #edf2f7;"><a href="tel:${booking.patientPhone}" style="color: #0871b2; text-decoration: none;">${booking.patientPhone}</a></td>
            </tr>
            <tr style="background-color: #f7fafc;">
              <td style="padding: 10px; border-bottom: 1px solid #edf2f7; font-weight: bold; color: #4a5568;">Department</td>
              <td style="padding: 10px; border-bottom: 1px solid #edf2f7; text-transform: uppercase;">${booking.department}</td>
            </tr>
            <tr>
              <td style="padding: 10px; border-bottom: 1px solid #edf2f7; font-weight: bold; color: #4a5568;">Specialist Doctor</td>
              <td style="padding: 10px; border-bottom: 1px solid #edf2f7; font-weight: bold; color: #043f65;">${booking.doctorName}</td>
            </tr>
            <tr style="background-color: #f7fafc;">
              <td style="padding: 10px; border-bottom: 1px solid #edf2f7; font-weight: bold; color: #4a5568;">Date</td>
              <td style="padding: 10px; border-bottom: 1px solid #edf2f7;">${booking.date}</td>
            </tr>
            <tr>
              <td style="padding: 10px; border-bottom: 1px solid #edf2f7; font-weight: bold; color: #4a5568;">Time Slot</td>
              <td style="padding: 10px; border-bottom: 1px solid #edf2f7;">${booking.time}</td>
            </tr>
            <tr style="background-color: #f7fafc;">
              <td style="padding: 10px; border-bottom: 1px solid #edf2f7; font-weight: bold; color: #4a5568;">Status</td>
              <td style="padding: 10px; border-bottom: 1px solid #edf2f7; font-weight: bold; color: #95c83e;">${booking.status.toUpperCase()}</td>
            </tr>
          </table>
          
          <div style="background-color: #f7fafc; padding: 15px; border-radius: 6px; border-left: 4px solid #0871b2; margin-top: 15px;">
            <h4 style="margin: 0 0 5px 0; font-size: 14px; color: #2d3748;">Symptoms/Notes:</h4>
            <p style="margin: 0; font-size: 13px; color: #4a5568; white-space: pre-wrap;">${booking.symptoms || 'No symptoms or notes provided.'}</p>
          </div>
        </div>
        <div style="background-color: #f7fafc; padding: 15px; text-align: center; border-top: 1px solid #edf2f7; color: #718096; font-size: 12px;">
          This is an automated notification from the VMC Portal system.<br/>
          &copy; ${new Date().getFullYear()} VMC Medical Center. All rights reserved.
        </div>
      </div>
    `;
  } else {
    const enq = data as EnquiryData;
    subject = `✉️ VMC Contact Enquiry - ${enq.subject}`;
    htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.05);">
        <div style="background-color: #043f65; padding: 20px; text-align: center; color: white;">
          <h2 style="margin: 0; font-size: 24px; font-weight: bold; letter-spacing: 0.5px;">VMC Medical Center</h2>
          <p style="margin: 5px 0 0 0; opacity: 0.8; font-size: 14px;">New Contact/Enquiry Form Submission</p>
        </div>
        <div style="padding: 25px; background-color: #ffffff; color: #333333; line-height: 1.6;">
          <p style="font-size: 16px; margin-top: 0;">Hello Admin,</p>
          <p style="font-size: 15px;">A new contact enquiry has been received. Below are the details:</p>
          
          <table style="width: 100%; border-collapse: collapse; margin: 20px 0; font-size: 14px;">
            <tr>
              <td style="padding: 10px; border-bottom: 1px solid #edf2f7; font-weight: bold; width: 140px; color: #4a5568;">Name</td>
              <td style="padding: 10px; border-bottom: 1px solid #edf2f7; font-weight: bold;">${enq.name}</td>
            </tr>
            <tr style="background-color: #f7fafc;">
              <td style="padding: 10px; border-bottom: 1px solid #edf2f7; font-weight: bold; color: #4a5568;">Email Address</td>
              <td style="padding: 10px; border-bottom: 1px solid #edf2f7;"><a href="mailto:${enq.email}" style="color: #0871b2; text-decoration: none;">${enq.email}</a></td>
            </tr>
            <tr>
              <td style="padding: 10px; border-bottom: 1px solid #edf2f7; font-weight: bold; color: #4a5568;">Phone Number</td>
              <td style="padding: 10px; border-bottom: 1px solid #edf2f7;">${enq.phone ? `<a href="tel:${enq.phone}" style="color: #0871b2; text-decoration: none;">${enq.phone}</a>` : 'Not provided'}</td>
            </tr>
            <tr style="background-color: #f7fafc;">
              <td style="padding: 10px; border-bottom: 1px solid #edf2f7; font-weight: bold; color: #4a5568;">Subject</td>
              <td style="padding: 10px; border-bottom: 1px solid #edf2f7; font-weight: bold; color: #043f65;">${enq.subject}</td>
            </tr>
          </table>
          
          <div style="background-color: #f7fafc; padding: 15px; border-radius: 6px; border-left: 4px solid #95c83e; margin-top: 15px;">
            <h4 style="margin: 0 0 5px 0; font-size: 14px; color: #2d3748;">Message:</h4>
            <p style="margin: 0; font-size: 13px; color: #4a5568; white-space: pre-wrap;">${enq.message}</p>
          </div>
        </div>
        <div style="background-color: #f7fafc; padding: 15px; text-align: center; border-top: 1px solid #edf2f7; color: #718096; font-size: 12px;">
          This is an automated notification from the VMC Portal system.<br/>
          &copy; ${new Date().getFullYear()} VMC Medical Center. All rights reserved.
        </div>
      </div>
    `;
  }

  // Check if SMTP is configured. If not, log to console
  if (!smtpUser || !smtpPass) {
    console.log(`\n======================================================`);
    console.log(`[SMTP SIMULATOR] Email Notification standard logger:`);
    console.log(`To: ${recipient}`);
    console.log(`Subject: ${subject}`);
    console.log(`Body (Text-approximate):`);
    console.log(`------------------------------------------------------`);
    if (type === 'booking') {
      const b = data as BookingData;
      console.log(`Booking ID: ${b.id}`);
      console.log(`Patient: ${b.patientName} (${b.patientEmail}, ${b.patientPhone})`);
      console.log(`Department: ${b.department.toUpperCase()}`);
      console.log(`Doctor: ${b.doctorName}`);
      console.log(`Date/Time: ${b.date} at ${b.time}`);
      console.log(`Symptoms: ${b.symptoms}`);
    } else {
      const e = data as EnquiryData;
      console.log(`Enquiry from: ${e.name} (${e.email}, ${e.phone || 'N/A'})`);
      console.log(`Subject: ${e.subject}`);
      console.log(`Message: ${e.message}`);
    }
    console.log(`======================================================\n`);
    return true;
  }

  try {
    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: smtpSecure,
      auth: {
        user: smtpUser,
        pass: smtpPass,
      },
    });

    const info = await transporter.sendMail({
      from: `"VMC Portal Notification" <${smtpUser}>`,
      to: recipient,
      subject: subject,
      html: htmlContent,
    });

    console.log(`[SMTP SENDER] Mail successfully sent: ${info.messageId}`);
    return true;
  } catch (err) {
    console.error(`[SMTP ERROR] Failed to send email via SMTP:`, err);
    return false;
  }
}

export async function sendPatientConfirmationEmail(booking: any): Promise<boolean> {
  const recipient = booking.patientEmail;
  
  // SMTP credentials from environment
  const smtpHost = process.env.SMTP_HOST || '';
  const smtpPort = parseInt(process.env.SMTP_PORT || '587', 10);
  const smtpUser = process.env.SMTP_USER || process.env.GMAIL_USER || '';
  const smtpPass = process.env.SMTP_PASS || process.env.GMAIL_PASS || '';
  const smtpSecure = process.env.SMTP_SECURE === 'true';

  const subject = `✅ Appointment Confirmed at VMC Medical Center - ${booking.patientName}`;
  
  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.05);">
      <div style="background-color: #043f65; padding: 20px; text-align: center; color: white;">
        <h2 style="margin: 0; font-size: 24px; font-weight: bold; letter-spacing: 0.5px;">VMC Medical Center</h2>
        <p style="margin: 5px 0 0 0; opacity: 0.8; font-size: 14px;">Appointment Confirmed</p>
      </div>
      <div style="padding: 25px; background-color: #ffffff; color: #333333; line-height: 1.6;">
        <p style="font-size: 16px; margin-top: 0;">Dear ${booking.patientName},</p>
        <p style="font-size: 15px;">We are pleased to inform you that your appointment request at VMC Medical Center has been **confirmed** by our administration team. Below are your appointment details:</p>
        
        <table style="width: 100%; border-collapse: collapse; margin: 20px 0; font-size: 14px;">
          <tr style="background-color: #f7fafc;">
            <td style="padding: 10px; border-bottom: 1px solid #edf2f7; font-weight: bold; width: 140px; color: #4a5568;">Booking ID</td>
            <td style="padding: 10px; border-bottom: 1px solid #edf2f7; font-family: monospace; font-weight: bold; color: #043f65;">${booking.id}</td>
          </tr>
          <tr>
            <td style="padding: 10px; border-bottom: 1px solid #edf2f7; font-weight: bold; color: #4a5568;">Specialist</td>
            <td style="padding: 10px; border-bottom: 1px solid #edf2f7; font-weight: bold; color: #043f65;">${booking.doctorName}</td>
          </tr>
          <tr style="background-color: #f7fafc;">
            <td style="padding: 10px; border-bottom: 1px solid #edf2f7; font-weight: bold; color: #4a5568;">Department</td>
            <td style="padding: 10px; border-bottom: 1px solid #edf2f7; text-transform: uppercase;">${booking.department}</td>
          </tr>
          <tr>
            <td style="padding: 10px; border-bottom: 1px solid #edf2f7; font-weight: bold; color: #4a5568;">Date</td>
            <td style="padding: 10px; border-bottom: 1px solid #edf2f7; font-weight: bold;">${booking.date}</td>
          </tr>
          <tr style="background-color: #f7fafc;">
            <td style="padding: 10px; border-bottom: 1px solid #edf2f7; font-weight: bold; color: #4a5568;">Time Slot</td>
            <td style="padding: 10px; border-bottom: 1px solid #edf2f7; font-weight: bold;">${booking.time}</td>
          </tr>
          <tr>
            <td style="padding: 10px; border-bottom: 1px solid #edf2f7; font-weight: bold; color: #4a5568;">Status</td>
            <td style="padding: 10px; border-bottom: 1px solid #edf2f7; font-weight: bold; color: #95c83e;">CONFIRMED</td>
          </tr>
        </table>
        
        <p style="font-size: 14px; color: #4a5568;">Please arrive 10-15 minutes prior to your scheduled time slot. If you need to reschedule or have any questions, feel free to contact us at <a href="tel:+919633248480" style="color: #0871b2; text-decoration: none;">+91 9633248480</a>.</p>
        
        <p style="font-size: 14px; color: #4a5568; margin-bottom: 0;">Thank you for choosing VMC Medical Center.</p>
      </div>
      <div style="background-color: #f7fafc; padding: 15px; text-align: center; border-top: 1px solid #edf2f7; color: #718096; font-size: 12px;">
        This is an automated confirmation email from VMC Medical Center.<br/>
        &copy; ${new Date().getFullYear()} VMC Medical Center. All rights reserved.
      </div>
    </div>
  `;

  // Check if SMTP is configured. If not, log to console
  if (!smtpUser || !smtpPass) {
    console.log(`\n======================================================`);
    console.log(`[SMTP SIMULATOR] Patient Confirmation Email standard logger:`);
    console.log(`To: ${recipient}`);
    console.log(`Subject: ${subject}`);
    console.log(`Body (Text-approximate):`);
    console.log(`------------------------------------------------------`);
    console.log(`Booking ID: ${booking.id}`);
    console.log(`Patient: ${booking.patientName} (${booking.patientEmail})`);
    console.log(`Doctor: ${booking.doctorName}`);
    console.log(`Date/Time: ${booking.date} at ${booking.time}`);
    console.log(`======================================================\n`);
    return true;
  }

  try {
    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: smtpSecure,
      auth: {
        user: smtpUser,
        pass: smtpPass,
      },
    });

    const info = await transporter.sendMail({
      from: `"VMC Medical Center" <${smtpUser}>`,
      to: recipient,
      subject: subject,
      html: htmlContent,
    });

    console.log(`[SMTP SENDER] Patient confirmation email successfully sent to ${recipient}: ${info.messageId}`);
    return true;
  } catch (err) {
    console.error(`[SMTP ERROR] Failed to send patient confirmation email:`, err);
    return false;
  }
}
