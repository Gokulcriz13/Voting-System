import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const { aadhaar, voterId, otp } = await req.json();

    if (!aadhaar || !voterId || !otp) {
      throw new Error("Missing Aadhaar, Voter ID, or OTP.");
    }

    // Retrieve the user from the database
    const [rows]: any = await pool.query(
      "SELECT * FROM users WHERE aadhaar = ? AND voter_id = ?",
      [aadhaar, voterId]
    );

    if (rows.length === 0) {
      throw new Error("User not found.");
    }

    // Validate OTP (in real-world scenarios, match against stored OTP)
    return NextResponse.json({
      success: true,
      user: rows[0],
    });
  } catch (error) {
    console.error("Error verifying OTP:", error);
    return NextResponse.json({ success: false, error: (error as Error).message });
  }
}