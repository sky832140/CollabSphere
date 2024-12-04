import { supabase } from "./supabase"; // Import your Supabase client

export const fetchData = async () => {
  try {
    // Fetch tasks data with related member and team information
    const { data: tasks, error: tasksError } = await supabase
      .from("tasks")
      .select("id, name, status, team_id, assigned_to, members(name, email), teams(name, description)");

    if (tasksError) throw tasksError;

    // Fetch members data with related team information
    const { data: members, error: membersError } = await supabase
      .from("members")
      .select("id, name, email, role, team_id, teams(name, description)");

    if (membersError) throw membersError;

    // Fetch teams data with leader information
    const { data: teams, error: teamsError } = await supabase
      .from("teams")
      .select("id, name, description, leader_id, members(name, email)");

    if (teamsError) throw teamsError;


    return { tasks, members, teams };
  } catch (error) {
    console.error("Error fetching data:", error);
    return { tasks: [], members: [], teams: [] }; // Return empty arrays on failure
  }
};
