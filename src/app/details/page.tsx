"use client";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

type User = {
  name: string;
  aadhaar: string;
  voter_id: string;
  phone_number: string;
  age: number;
  gender: string;
  address: string;
};

const fetchUserDetails = async (aadhaar: string, voterId: string): Promise<User | null> => {
  try {
    const response = await fetch("/api/get-user", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ aadhaar, voterId }),
    });

    const result = await response.json();
    if (!result.success) throw new Error(result.error);

    return result.user;
  } catch (error) {
    console.error("Error fetching user details:", error);
    return null;
  }
};

export default function UserDetails() {
  const searchParams = useSearchParams();
  const aadhaar = searchParams.get("aadhaar") || "";
  const voterId = searchParams.get("voter_id") || "";
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    if (aadhaar && voterId) {
      fetchUserDetails(aadhaar, voterId).then(setUser);
    }
  }, [aadhaar, voterId]);

  if (!user) return <p>Loading user details...</p>;

  return (
    <div className="p-8 bg-white rounded-2xl shadow-xl max-w-xl mx-auto mt-10">
      <h1 className="text-3xl font-bold mb-8 text-center text-blue-600">User Details</h1>
      <p><strong>Name:</strong> {user.name}</p>
      <p><strong>Aadhaar:</strong> {user.aadhaar}</p>
      <p><strong>Voter ID:</strong> {user.voter_id}</p>
      <p><strong>Phone Number:</strong> {user.phone_number}</p>
      <p><strong>Age:</strong> {user.age}</p>
      <p><strong>Gender:</strong> {user.gender}</p>
      <p><strong>Address:</strong> {user.address}</p>
    </div>
  );
}
