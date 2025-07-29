import type { NextApiRequest, NextApiResponse } from "next";
import nodemailer from "nodemailer";
import { google } from "googleapis";
import { JWT } from "google-auth-library";

// Setup Google Auth
const auth = new google.auth.GoogleAuth({
  credentials: {
    client_email: process.env.GOOGLE_CLIENT_EMAIL,
    private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
  },
  scopes: ["https://www.googleapis.com/auth/spreadsheets"],
});

const SPREADSHEET_ID = process.env.SPREADSHEET_ID!;
const AUTH_SHEET = "Account";  // For authorized emails
const REQUEST_SHEET = "Sheet2"; // For logging the requests

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { email, service, name } = req.body;

  if (!email || !service || !name) {
    return res.status(400).json({ message: "Missing email, service, or name" });
  }

  try {
    // Authenticate with Google Sheets
    const authClient = (await auth.getClient()) as JWT;
    const sheets = google.sheets({ version: "v4", auth: authClient });

    // Validate email from "Account" sheet
    const result = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: `${AUTH_SHEET}!A:A`,
    });

    const rows = result.data.values || [];
    const authorizedEmails = rows.flat().map((e) => e.trim().toLowerCase());

    const submittedEmail = email.trim().toLowerCase();
    if (!authorizedEmails.includes(submittedEmail)) {
      return res.status(403).json({ message: "Email not authorized" });
    }

    // Generate queue number (based on row count in Sheet2)
    const requestSheetData = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: `${REQUEST_SHEET}!A:A`,
    });

    const existingRequests = requestSheetData.data.values || [];
    const queueNumber = `Q${String(existingRequests.length).padStart(3, "0")}`; // e.g., Q001

    const timestamp = new Date().toLocaleString("en-MY", {
      timeZone: "Asia/Kuala_Lumpur",
    });

    // Log the request in Sheet2 (Time | Issue | Email | Name | Queue)
    await sheets.spreadsheets.values.append({
      spreadsheetId: SPREADSHEET_ID,
      range: `${REQUEST_SHEET}!A:E`,
      valueInputOption: "USER_ENTERED",
      requestBody: {
        values: [[timestamp, service, submittedEmail, name, queueNumber]],
      },
    });

    // Send email
    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: "muhd.hanif9991@gmail.com",
      subject: "New Service Desk Request",
      text: `New IT Service Desk Request:\n\nService: ${service}\nEmail: ${submittedEmail}\nName: ${name}\nQueue Number: ${queueNumber}`,
    });

    return res.status(200).json({
      message: "Request submitted successfully",
      queueNumber,
    });

  } catch (error) {
    console.error("❗ Server error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}
