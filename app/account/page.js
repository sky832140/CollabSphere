"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Spinner from "../_components/SpinnerMini";

export default function AccountPage() {
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Check if JWT exists in localStorage
    const jwt = localStorage.getItem("jwt");

    if (jwt) {
      setAuthenticated(true);
    } else {
      router.push("/account/login"); // Redirect to login if not authenticated
    }

    setLoading(false);
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("jwt"); // Remove JWT
    setAuthenticated(false); // Update state
    router.push("/account/login"); // Redirect to login page
  };

  if (loading) {
    return (
      <div>
        <Spinner />
      </div>
    );
  }

  return (
    <div className="p-6 min-h-screen ">
      {authenticated ? (
        <div className=" p-4 rounded shadow-md">
          <h2 className="text-2xl font-semibold mb-2">PROJECT LEAD</h2>
          <p>
            <strong>Name:</strong>Subhash Yadav
          </p>
          <p>
            <strong>Email:</strong> subhash@gmail.com
          </p>
          <p>
            <strong>Contact:</strong> +91 834 567 890
          </p>
          <button
            onClick={handleLogout}
            className="bg-accent-500 text-white font-bold px-4 py-2 rounded hover:bg-red-600 mb-4 mt-9"
          >
            Logout
          </button>
        </div>
      ) : (
        <p>
          {" "}
          <Spinner />
        </p>
      )}
    </div>
  );
}
