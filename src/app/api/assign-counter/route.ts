import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const DATA_FILE = path.join(process.cwd(), "public", "data.json");

export async function POST(req: Request) {
  const { rowIndex, counter } = await req.json();

  // Read data from JSON file
  let data: any[] = [];
  try {
    data = JSON.parse(fs.readFileSync(DATA_FILE, "utf-8"));
  } catch (err) {
    return NextResponse.json({ error: "Failed to read data file." }, { status: 500 });
  }

  // Check if rowIndex is valid
  if (rowIndex < 1 || rowIndex > data.length) {
    return NextResponse.json({ error: "Invalid row index." }, { status: 400 });
  }

  // Update counter for the given row (rowIndex is 1-based)
  data[rowIndex - 1].counter = counter;

  // Write updated data back to JSON file
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
  } catch (err) {
    return NextResponse.json({ error: "Failed to write data file." }, { status: 500 });
  }

  return NextResponse.json({ message: "Counter assigned successfully" });
}