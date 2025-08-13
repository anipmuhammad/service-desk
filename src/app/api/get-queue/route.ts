import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const DATA_FILE = path.join(process.cwd(), 'public', 'data.json');

export async function GET() {
  let rows: any[] = [];
  try {
    rows = JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));
  } catch (err) {
    return NextResponse.json({ error: 'Failed to read data file.' }, { status: 500 });
  }

  // Map data to expected format
  const data = rows.map((row, i) => ({
    rowIndex: i + 1, // 1-based index for compatibility
    time: row.time || "",
    issue: row.service || row.issue || "",
    email: row.email || "",
    name: row.name || "",
    queue: row.queueNumber || row.queue || "",
    status: row.status || "Pending",
    counter: row.counter || "",
  }));

  return NextResponse.json(data);
}