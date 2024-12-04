"use client";
import { useAuth } from "@/app/_lib/useAuth";

export default function Layout({ children }) {
  const loggedIn = useAuth(); 

  return (
    <div>
      <header>
        <h1 className="text-3xl font-bold  text-accent-500 mb-6">
          {loggedIn ? <div>
            <h1>Welcome Back!</h1>
            <h1 className="text-center text-white">Account Details</h1>
          </div> : "Please Log In"}
        </h1>
      </header>
      <main>{children}</main>
    </div>
  );
}
