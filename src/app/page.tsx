"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

// Function to connect to MySQL and fetch user by Aadhaar and Voter ID
const fetchUserFromDatabase = async (aadhaar: string, voterId: string) => {
  try {
    const response = await fetch("/api/get-user", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ aadhaar, voterId }),
    });

    const result = await response.json();
    if (!result.success) throw new Error(result.error);

    return result.user; // Return user details
  } catch (error) {
    console.error("Error fetching user:", error);
    alert("Failed to fetch user. Try again later.");
    return null;
  }
};

// Function to generate a 6-digit OTP
const generateOtp = (): string => Math.floor(100000 + Math.random() * 900000).toString();

// Function to call the API route to send OTP
const sendOtp = async (mobile: string, otp: string) => {
  try {
    const response = await fetch("/api/send-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ mobile, otp }),
    });

    const result = await response.json();
    if (!result.success) throw new Error(result.error);

    console.log("OTP sent successfully");
  } catch (error) {
    console.error("Error sending OTP:", error);
    alert("Failed to send OTP. Try again later.");
  }
};

export default function Home() {
  const [aadhaar, setAadhaar] = useState<string>("");
  const [voterId, setVoterId] = useState<string>("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (aadhaar.length !== 12) {
      alert("Enter a valid 12-digit Aadhaar number");
      return;
    }

    if (voterId.length !== 10) {
      alert("Enter a valid 10-digit Voter ID number");
      return;
    }

    // Fetch user from MySQL database
    const user = await fetchUserFromDatabase(aadhaar, voterId);
    if (!user) {
      alert("User not found with given Aadhaar and Voter ID.");
      return;
    }

    // Generate and send OTP
    const otp = generateOtp();
    await sendOtp(user.phone_number, otp);

    // Navigate with Aadhaar, Voter ID, and OTP
    router.push(`/otp?aadhaar=${aadhaar}&voter_id=${voterId}&otp=${otp}`);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-200 to-blue-500">
      <form
        className="p-8 bg-white rounded-2xl shadow-xl max-w-md w-full"
        onSubmit={handleSubmit}
      >
        <h1 className="text-3xl font-bold mb-8 text-center text-blue-600">
          Secure Voter Verification
        </h1>

        {/* Voter ID Input */}
        <label htmlFor="voter_id" className="block mb-4 text-gray-700 font-medium">
          Enter Your Voter ID Number:
        </label>
        <input
          id="voter_id"
          type="text"
          value={voterId}
          onChange={(e) => setVoterId(e.target.value)}
          maxLength={10}
          placeholder="XXX-XXXXXXX"
          className="p-3 border border-blue-300 rounded-lg w-full focus:outline-none focus:ring-4 focus:ring-blue-400"
          required
        />

        {/* Aadhaar Input */}
        <label htmlFor="aadhaar" className="block mb-4 text-gray-700 font-medium">
          Enter Your Aadhaar Number:
        </label>
        <input
          id="aadhaar"
          type="text"
          value={aadhaar}
          onChange={(e) => setAadhaar(e.target.value)}
          maxLength={12}
          placeholder="XXXX-XXXX-XXXX"
          className="p-3 border border-blue-300 rounded-lg w-full focus:outline-none focus:ring-4 focus:ring-blue-400"
          required
        />

        {/* Submit Button */}
        <button
          type="submit"
          className="mt-6 w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-transform transform hover:scale-105"
        >
          Submit
        </button>

        <p className="mt-6 text-center text-gray-600">
          Ensure your Aadhaar and Voter ID numbers are correct before submitting.
        </p>
      </form>
    </div>
  );
}