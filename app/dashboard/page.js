"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../_lib/supabase"; // Adjust the import based on your project structure
import Spinner from "../_components/SpinnerMini";

export default function Page() {
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [members, setMembers] = useState([]);
  const [teams, setTeams] = useState([]);
  const router = useRouter();

  useEffect(() => {
    // Check for JWT token in localStorage
    const jwt = localStorage.getItem("jwt");

    if (!jwt) {
      router.push("/account/login"); // Redirect to login if no token found
    } else {
      setAuthenticated(true);
    }

    setLoading(false);
  }, [router]);

  const fetchData = async () => {
    try {
      // Fetch tasks
      const { data: tasksData, error: tasksError } = await supabase
        .from("tasks")
        .select("*");

      if (tasksError) throw tasksError;
      setTasks(tasksData);

      // Fetch members
      const { data: membersData, error: membersError } = await supabase
        .from("members")
        .select("*");

      if (membersError) throw membersError;
      setMembers(membersData);

      // Fetch teams
      const { data: teamsData, error: teamsError } = await supabase
        .from("teams")
        .select("*");

      if (teamsError) throw teamsError;
      setTeams(teamsData);
    } catch (error) {
      console.error("Error fetching data:", error.message);
    }
  };

  // Fetch data after authentication or task change
  useEffect(() => {
    if (authenticated) {
      fetchData(); // Fetch data after authentication or when tasks change
    }
  }, [authenticated, tasks]);

  if (loading) {
    return <div><Spinner /></div>;
  }

  if (!authenticated) {
    return <div>Redirecting...</div>;
  }

  return (
    <div className="min-h-screen flex">
      {/* Sidebar Navigation */}
      <nav className="w-1/4 bg-primary-950 text-white p-4 space-y-4">
        <a
          href="/tasks"
          className="block px-4 py-2 hover:text-accent-400 transition-colors text-3xl"
        >
          Tasks
        </a>
        <a
          href="/chat"
          className="block px-4 py-2 hover:text-accent-400 transition-colors text-3xl"
        >
          Chat
        </a>
        <a
          href="/call"
          className="block px-4 py-2 hover:text-accent-400 transition-colors text-3xl"
        >
          Call
        </a>
      </nav>

      {/* Main Content */}
      <div className="flex-1 bg-primary-950 p-6">
        <h1 className="text-white text-3xl mb-6 ">Welcome to your Dashboard</h1>

        <div className="mb-6">
          <h2 className="text-xl text-accent-400">Tasks</h2>
          <ul className="text-white">
            {tasks.length === 0 ? (
              <p>No tasks found</p>
            ) : (
              tasks.map((task) => (
                <li key={task.id} className="mb-2">
                  {task.name} - {task.status}
                </li>
              ))
            )}
          </ul>
        </div>

        <div className="mb-6">
          <h2 className="text-xl text-accent-400">Members</h2>
          <ul className="text-white">
            {members.length === 0 ? (
              <p>No members found</p>
            ) : (
              members.map((member) => (
                <li key={member.id} className="mb-2">
                  {member.name} - {member.role}
                </li>
              ))
            )}
          </ul>
        </div>

        <div className="mb-6">
          <h2 className="text-xl text-accent-400">Teams</h2>
          <ul className="text-white">
            {teams.length === 0 ? (
              <p>No teams found</p>
            ) : (
              teams.map((team) => (
                <li key={team.id} className="mb-2">
                  {team.name} - {team.description}
                </li>
              ))
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}
