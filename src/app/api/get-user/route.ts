import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";

// API to fetch user details by Aadhaar and Voter ID
export async function POST(req: NextRequest) {
  try {
    const { aadhaar, voterId } = await req.json();

    if (!aadhaar || !voterId) {
      throw new Error("Aadhaar and Voter ID are required.");
    }

    // Query to fetch user from the database
    const [rows]: any = await pool.query(
      "SELECT * FROM users WHERE aadhaar = ? AND voter_id = ?",
      [aadhaar, voterId]
    );

    if (rows.length === 0) {
      return NextResponse.json({ success: false, error: "User not found." });
    }

    return NextResponse.json({ success: true, user: rows[0] });
  } catch (error) {
    console.error("Error fetching user:", error);
    return NextResponse.json({ success: false, error: (error as Error).message });
  }
}
