"use client";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

// Function to verify OTP
const verifyOtp = async (aadhaar: string, voterId: string, otp: string) => {
  try {
    const response = await fetch("/api/verify-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ aadhaar, voterId, otp }),
    });

    const result = await response.json();
    if (!result.success) throw new Error(result.error);

    return result.user; // Return verified user
  } catch (error) {
    console.error("Error verifying OTP:", error);
    alert("OTP verification failed. Try again.");
    return null;
  }
};

export default function OtpVerification() {
  const [otpInput, setOtpInput] = useState<string>("");
  const router = useRouter();
  const searchParams = useSearchParams();

  // Get Aadhaar, Voter ID, and OTP from URL
  const aadhaar = searchParams.get("aadhaar") || "";
  const voterId = searchParams.get("voter_id") || "";
  const sentOtp = searchParams.get("otp") || "";

  // Redirect if required data is missing
  useEffect(() => {
    if (!aadhaar || !voterId || !sentOtp) {
      alert("Invalid session. Redirecting to home...");
      router.push("/");
    }
  }, [aadhaar, voterId, sentOtp, router]);

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (otpInput !== sentOtp) {
      alert("Invalid OTP. Please try again.");
      return;
    }

    // Verify OTP and navigate to the user details page
    const user = await verifyOtp(aadhaar, voterId, otpInput);
    if (user) {
      router.push(`/details?aadhaar=${aadhaar}&voter_id=${voterId}`);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-200 to-blue-500">
      <form
        className="p-8 bg-white rounded-2xl shadow-xl max-w-md w-full"
        onSubmit={handleOtpSubmit}
      >
        <h1 className="text-3xl font-bold mb-8 text-center text-blue-600">
          OTP Verification
        </h1>

        <p className="mb-4 text-gray-700 text-center">
          We've sent an OTP to your registered mobile number.
        </p>

        {/* OTP Input */}
        <label htmlFor="otp" className="block mb-4 text-gray-700 font-medium">
          Enter OTP:
        </label>
        <input
          id="otp"
          type="text"
          value={otpInput}
          onChange={(e) => setOtpInput(e.target.value)}
          maxLength={6}
          placeholder="Enter OTP"
          className="p-3 border border-blue-300 rounded-lg w-full focus:outline-none focus:ring-4 focus:ring-blue-400"
          required
        />

        {/* Submit Button */}
        <button
          type="submit"
          className="mt-6 w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-transform transform hover:scale-105"
        >
          Verify OTP
        </button>

        <p className="mt-6 text-center text-gray-600">
          Ensure you entered the correct OTP.
        </p>
      </form>
    </div>
  );
}