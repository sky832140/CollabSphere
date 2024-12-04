

import { useState } from "react";
import { supabase } from "@/app/_lib/supabase";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/_lib/useAuth"; 

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();
  

  const loggedIn = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
    } else {
     
      localStorage.setItem("jwt", data?.session?.access_token);
      
      router.push("/account");  
    }
  };

  const handleLogout = () => {
    
    localStorage.removeItem("jwt");
    router.push("/account/login");  
  };

  return (
    <div>
      {!loggedIn ? (
        <div className="flex flex-col gap-10 mt-10 items-center">
          <form onSubmit={handleLogin} className="flex flex-col gap-5 items-center">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              className="text-center text-lg rounded-full p-2 font-bold  w-full text-primary-500 border focus:outline-none focus:border-transparent"
            />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="text-center text-lg rounded-full p-2 font-bold  w-full text-primary-500 border focus:outline-none focus:border-transparent"
            />
            {error && <p>{error}</p>}
            <button
              type="submit"
              className="bg-accent-600 p-2 w-32 text-lg font-semibold hover:bg-accent-600 transition-all rounded-full"
            >
              Login
            </button>
          </form>
        </div>
      ) : (
        <div>
          <h2>Welcome, you logged in!</h2>
          <button onClick={handleLogout}>Logout</button>
        </div>
      )}
    </div>
  );
}
