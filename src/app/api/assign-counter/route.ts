import { NextResponse } from "next/server";
import { google } from "googleapis";
import { JWT } from "google-auth-library";

const SHEET_NAME = "Sheet2";
const SPREADSHEET_ID = process.env.SPREADSHEET_ID!;

export async function POST(req: Request) {
  const { rowIndex, counter } = await req.json();

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

  // Update column G (Counter) in the given row index
  await sheets.spreadsheets.values.update({
    spreadsheetId: SPREADSHEET_ID,
    range: `${SHEET_NAME}!G${rowIndex}`, // Column G for counter
    valueInputOption: "USER_ENTERED",
    requestBody: {
      values: [[counter]],
    },
  });

  return NextResponse.json({ message: "Counter assigned successfully" });
}
