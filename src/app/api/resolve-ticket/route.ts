// /src/app/api/resolve-ticket/route.ts
import { google } from "googleapis";
import { JWT } from "google-auth-library";
import { NextRequest, NextResponse } from "next/server";

const SHEET_NAME = "Sheet2";
const SPREADSHEET_ID = process.env.SPREADSHEET_ID!;

export async function POST(req: NextRequest) {
  const { rowIndex } = await req.json();

  // Step 1: Create Google Auth
  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: process.env.GOOGLE_CLIENT_EMAIL,
      private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    },
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });

  // ✅ Step 2: Cast the auth client to JWT
  const authClient = (await auth.getClient()) as JWT;

  // Step 3: Create sheets client
  const sheets = google.sheets({
    version: "v4",
    auth: authClient,
  });

  // Step 4: Update cell with "Resolved"
  await sheets.spreadsheets.values.update({
    spreadsheetId: SPREADSHEET_ID,
    range: `${SHEET_NAME}!F${rowIndex}`, // Column F = Status
    valueInputOption: "USER_ENTERED",
    requestBody: {
      values: [["Resolved"]],
    },
  });

  return NextResponse.json({ message: "Status updated" });
}
