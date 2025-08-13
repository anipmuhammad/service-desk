// src/pages/api/send-email.ts (or app/api/send-email/route.ts if using App Router)

import { NextApiRequest, NextApiResponse } from "next";
import fs from "fs";
import path from "path";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { email, service } = req.body;

  if (!email || !service) {
    return res.status(400).json({ error: "Missing email or service" });
  }

  // Generate queue number
  const queueNumber = Math.floor(1000 + Math.random() * 9000).toString();

  // Path to data.json
  const filePath = path.join(process.cwd(), "data.json");
  let queueData: any[] = [];

  if (fs.existsSync(filePath)) {
    queueData = JSON.parse(fs.readFileSync(filePath, "utf-8"));
  }

  // Add new entry
  queueData.push({
    queueNumber,
    email,
    service,
    createdAt: new Date().toISOString(),
  });

  // Save file
  fs.writeFileSync(filePath, JSON.stringify(queueData, null, 2));

  // Return queueNumber so client can redirect with it
  return res.status(200).json({ success: true, queueNumber });
}
