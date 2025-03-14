import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";
import twilio from "twilio";

const accountSid = process.env.TWILIO_ACCOUNT_SID!;
const authToken = process.env.TWILIO_AUTH_TOKEN!;
const twilioPhone = process.env.TWILIO_PHONE_NUMBER!;

const client = twilio(accountSid, authToken);

// Generate a 6-digit OTP
const generateOtp = (): string => Math.floor(100000 + Math.random() * 900000).toString();

// Store OTP in the MySQL database
const storeOtp = async (mobile: string, otp: string) => {
  try {
    await pool.query(
      "INSERT INTO otp_records (mobile, otp) VALUES (?, ?)",
      [mobile, otp]
    );
    console.log("OTP stored successfully in MySQL.");
  } catch (error) {
    console.error("Error storing OTP:", error);
    throw new Error("Database error while storing OTP.");
  }
};

export async function POST(req: NextRequest) {
  try {
    const { mobile } = await req.json();
    if (!mobile) throw new Error("Mobile number is required.");

    const otp = generateOtp();

    // Store OTP in MySQL
    await storeOtp(mobile, otp);

    // Send OTP via Twilio
    await client.messages.create({
      body: `Your OTP is: ${otp}`,
      from: twilioPhone,
      to: `+91${mobile}`,
    });

    return NextResponse.json({ success: true, message: "OTP sent and stored." });
  } catch (error) {
    console.error("Error in OTP process:", error);
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 });
  }
}
