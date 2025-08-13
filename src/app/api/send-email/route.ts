import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import fs from 'fs';
import path from 'path';

const DATA_FILE = path.join(process.cwd(), 'public', 'data.json');

export async function POST(req: Request) {
  const body = await req.json();
  const { email, service, name } = body;

  if (!email || !service) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
  }

  // Read existing data
  let data: any[] = [];
  try {
    data = JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));
  } catch (err) {
    data = [];
  }

  // Generate queue number
  const queueNumber = `Q${(data.length + 1).toString().padStart(4, '0')}`;

  // Send email
  try {
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
  subject: `New IT Service Request`,
  text: `A new request has been submitted.\n\nEmail: ${email}\nService: ${service}\nQueue Number: ${queueNumber}`,
};


    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error('❗ Error sending email:', error);
    return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
  }

  // Append new request to data.json
  const newRequest = {
    time: new Date().toLocaleString('en-MY', { timeZone: 'Asia/Kuala_Lumpur' }),
    service,
    email,
    queue: queueNumber,
    status: 'Pending',
    counter: ''
  };

  data.push(newRequest);

  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
  } catch (err) {
    return NextResponse.json({ error: 'Failed to write data file.' }, { status: 500 });
  }

  // ✅ Return queueNumber so frontend can use it
  return NextResponse.json({
    message: 'Email sent and request logged successfully',
    queueNumber
  });
}
