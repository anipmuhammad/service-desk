import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { google } from 'googleapis';

const SHEET_NAME = 'Sheet1';
const SPREADSHEET_ID = process.env.SPREADSHEET_ID!;

export async function POST(req: Request) {
  const body = await req.json();
  const { email, service } = body;

  if (!email || !service) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
  }

  try {
    // ✅ Authenticate
    const authClient = new google.auth.JWT({
      email: process.env.GOOGLE_CLIENT_EMAIL,
      key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    const sheets = google.sheets({ version: 'v4', auth: authClient });

    // ✅ Fetch emails and names (A:B)
    const sheetRes = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: `${SHEET_NAME}!A2:B`,
    });

    const rows = sheetRes.data.values || [];
    const submittedEmail = email.trim().toLowerCase();

    // ✅ Find matching email and name
    const match = rows.find(row => row[0]?.trim().toLowerCase() === submittedEmail);
    if (!match) {
      return NextResponse.json({ error: 'Email not authorized' }, { status: 403 });
    }

    const userName = match[1] || 'Unknown User';

    // ✅ Get existing Sheet2 data to count rows for queue number
    const sheet2Res = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: 'Sheet2!A2:A',
    });

    const existingRows = sheet2Res.data.values || [];
    const queueNumber = `Q${(existingRows.length + 1).toString().padStart(4, '0')}`; // e.g. Q0001

    // ✅ Send email
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER!,
        pass: process.env.EMAIL_PASS!,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: 'muhd.hanif9991@gmail.com',
      subject: `New IT Service Request from ${userName}`,
      text: `A new request has been submitted.\n\nName: ${userName}\nEmail: ${email}\nService: ${service}\nQueue Number: ${queueNumber}`,
    };

    await transporter.sendMail(mailOptions);

    // ✅ Append data to Sheet2 (A: Time, B: Service, C: Email, D: Name, E: Queue Number)
    await sheets.spreadsheets.values.append({
      spreadsheetId: SPREADSHEET_ID,
      range: 'Sheet2!A:E',
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values: [[
          new Date().toLocaleString('en-MY', { timeZone: 'Asia/Kuala_Lumpur' }),
          service,
          email,
          userName,
          queueNumber
        ]],
      },
    });

    return NextResponse.json({ message: 'Email sent and request logged successfully', queueNumber });

  } catch (error) {
    console.error('❗ Error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
