import { NextResponse } from 'next/server';
import { google } from 'googleapis';
import { JWT } from 'google-auth-library';

const SHEET_NAME = "Sheet2";
const SPREADSHEET_ID = process.env.SPREADSHEET_ID!;

export async function GET() {
  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: process.env.GOOGLE_CLIENT_EMAIL,
      private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    },
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });

  const authClient = (await auth.getClient()) as JWT;

  const sheets = google.sheets({
    version: "v4",
    auth: authClient,
  });

  const result = await sheets.spreadsheets.values.get({
    spreadsheetId: SPREADSHEET_ID,
    range: `${SHEET_NAME}!A:G`,
  });

  const rows = result.data.values || [];

  // Add 2 to i because:
  // - +1 to skip header
  // - +1 because spreadsheet is 1-indexed (row 2 is first data row)
  const data = rows.slice(1).map((row, i) => ({
    rowIndex: i + 2, // actual row number in spreadsheet
    time: row[0],
    issue: row[1],
    email: row[2],
    name: row[3],
    queue: row[4],
    status: row[5] || "Pending",
    counter: row[6] || "",
  }));

  return NextResponse.json(data);
}
