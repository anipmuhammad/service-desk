import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const dataFile = path.join(process.cwd(), "src", "data", "data.json");

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const name = body.name || "Anonymous";

    // Read existing data
    const rawData = fs.readFileSync(dataFile, "utf8");
    const queue = rawData ? JSON.parse(rawData) : [];

    // Generate new queue number
    const newQueueNumber = queue.length + 1;

    // Add new record
    const newEntry = {
      name,
      queueNumber: newQueueNumber,
      createdAt: new Date().toISOString(),
    };
    queue.push(newEntry);

    // Save to file
    fs.writeFileSync(dataFile, JSON.stringify(queue, null, 2));

    return NextResponse.json({ queueNumber: newQueueNumber });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to add to queue" }, { status: 500 });
  }
}
