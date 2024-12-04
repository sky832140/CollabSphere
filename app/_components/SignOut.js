'use client';
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Spinner from "./SpinnerMini";

export default function SignOut() {
  const router = useRouter();

  useEffect(() => {
    // Clear the JWT token from localStorage
    localStorage.removeItem("jwt");
    // Redirect to the login page after logout
    router.push("/account/login");
  }, [router]);

  return <div><Spinner /></div>;
}
