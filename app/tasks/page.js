
"use client";

import { useEffect, useState } from "react";
import { supabase } from "../_lib/supabase";
import Spinner from "../_components/SpinnerMini";

export default function Page() {
  const [tasks, setTasks] = useState([]);
  const [teams, setTeams] = useState([]);
  const [members, setMembers] = useState([]);
  const [teamMembers, setTeamMembers] = useState([]); // Members of the selected team
  const [loading, setLoading] = useState(true);
  const [newTaskName, setNewTaskName] = useState("");
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [selectedMember, setSelectedMember] = useState(null);

  // Fetch tasks, teams, and members
  const fetchData = async () => {
    try {
      const [tasksRes, teamsRes, membersRes] = await Promise.all([
        supabase.from("tasks").select("*"),
        supabase.from("teams").select("*"),
        supabase.from("members").select("*"),
      ]);

      if (tasksRes.error) throw tasksRes.error;
      if (teamsRes.error) throw teamsRes.error;
      if (membersRes.error) throw membersRes.error;

      setTasks(tasksRes.data || []);
      setTeams(teamsRes.data || []);
      setMembers(membersRes.data || []);
    } catch (error) {
      console.error("Error fetching data:", error.message);
    } finally {
      setLoading(false);
    }
  };

  // Fetch data on page load
  useEffect(() => {
    fetchData();
  }, []);

  // Filter members when a team is selected
  useEffect(() => {
    if (selectedTeam) {
      const filteredMembers = members.filter(
        (member) => member.team_id === selectedTeam
      );
      setTeamMembers(filteredMembers);
    } else {
      setTeamMembers([]);
    }
    setSelectedMember(null); // Reset member selection
  }, [selectedTeam, members]);

  // Add a new task
  const addTask = async () => {
    if (!newTaskName.trim()) return alert("Task name cannot be empty!");
    if (!selectedTeam) return alert("Please select a team!");
    if (!selectedMember) return alert("Please select a member!");

    try {
      const { data, error } = await supabase
        .from("tasks")
        .insert([
          {
            name: newTaskName,
            status: "Pending",
            team_id: selectedTeam,
            assigned_to: selectedMember,
          },
        ])
        .select();

      if (error) throw error;

      setTasks((prevTasks) => [...prevTasks, ...data]);
      setNewTaskName(""); 
      setSelectedTeam(null); 
      setSelectedMember(null);
    } catch (error) {
      console.error("Error adding task:", error.message);
    }
  };

  
  const deleteTask = async (id) => {
    try {
      const { error } = await supabase.from("tasks").delete().eq("id", id);
      if (error) throw error;

      setTasks((prevTasks) => prevTasks.filter((task) => task.id !== id));
    } catch (error) {
      console.error("Error deleting task:", error.message);
    }
  };

 
  const toggleTaskStatus = async (id, currentStatus) => {
    const newStatus = currentStatus === "Pending" ? "Completed" : "Pending";

    try {
      const { error } = await supabase
        .from("tasks")
        .update({ status: newStatus })
        .eq("id", id);

      if (error) throw error;

      fetchData(); 
    } catch (error) {
      console.error("Error toggling task status:", error.message);
    }
  };

  if (loading) {
    return (
      <div>
        <Spinner />
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Task Management</h1>

      
      <div className="mb-4 flex flex-col gap-2">
        <input
          type="text"
          value={newTaskName}
          onChange={(e) => setNewTaskName(e.target.value)}
          placeholder="Enter Task Name"
          className="text-primary-500 p-2 text-lg font-bold w-full rounded-full border focus:outline-none focus:border-transparent "
        />
        <select
          value={selectedTeam || ""}
          onChange={(e) => setSelectedTeam(Number(e.target.value))}
          className="text-primary-500 p-2 text-lg font-bold rounded-full border focus:outline-none focus:border-transparent "
        >
          <option value="">Select Team</option>
          {teams.map((team) => (
            <option key={team.id} value={team.id}>
              {team.name}
            </option>
          ))}
        </select>
        <select
          value={selectedMember || ""}
          onChange={(e) => setSelectedMember(Number(e.target.value))}
          className="text-primary-500 p-2 text-lg font-bold rounded-full border focus:outline-none focus:border-transparent "
        >
          <option value="">Select Member</option>
          {teamMembers.map((member) => (
            <option key={member.id} value={member.id}>
              {member.name}
            </option>
          ))}
        </select>
        <button
          onClick={addTask}
          className="bg-accent-500 text-white text-lg font-bold px-4 py-2  hover:bg-green-500 rounded-full"
        >
          Add Task
        </button>
      </div>

      
      {tasks.length === 0 ? (
        <p>No tasks available.</p>
      ) : (
        <table className="min-w-full border border-gray-300 bg-primary-950">
          <thead>
            <tr>
              <th className="px-4 py-2 border">Task Name</th>
              <th className="px-4 py-2 border">Status</th>
              <th className="px-4 py-2 border">Team</th>
              <th className="px-4 py-2 border">Assigned To</th>
              <th className="px-4 py-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((task) => (
              <tr key={task.id}>
                <td className="px-4 py-2 border">{task.name}</td>
                <td className="px-4 py-2 border">{task.status}</td>
                <td className="px-4 py-2 border">
                  {teams.find((team) => team.id === task.team_id)?.name || "N/A"}
                </td>
                <td className="px-4 py-2 border">
                  {members.find((member) => member.id === task.assigned_to)?.name || "N/A"}
                </td>
                <td className="px-4 py-2 border space-x-2 text-center">
                  <button
                    onClick={() => toggleTaskStatus(task.id, task.status)}
                    className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
                  >
                    Toggle Status
                  </button>
                  <button
                    onClick={() => deleteTask(task.id)}
                    className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
