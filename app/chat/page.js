

"use client";

import { useEffect, useState } from "react";
import { supabase } from "../_lib/supabase";
import Spinner from "../_components/SpinnerMini";

export default function ChatPage() {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [teams, setTeams] = useState([]);
  const [members, setMembers] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState("");
  const [selectedTeamMember, setSelectedTeamMember] = useState("");
  const [projectLeadId, setProjectLeadId] = useState(1); // Set the project lead's ID

  // Fetch teams and members when the component mounts
  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: teamsData, error: teamsError } = await supabase
          .from("teams")
          .select("*");
        if (teamsError) throw teamsError;
        setTeams(teamsData);

        const { data: membersData, error: membersError } = await supabase
          .from("members")
          .select("*");
        if (membersError) throw membersError;
        setMembers(membersData);

        const { data: messagesData, error: messagesError } = await supabase
          .from("messages")
          .select("*")
          .order("created_at", { ascending: true });
        if (messagesError) throw messagesError;
        setMessages(messagesData);
      } catch (error) {
        console.error("Error fetching data:", error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Send a new message
  const sendMessage = async () => {
    if (!newMessage.trim()) return alert("Message cannot be empty!");
    if (!selectedTeam || !selectedTeamMember) return alert("Please select a team and member!");

    try {
      const { error } = await supabase.from("messages").insert([
        {
          content: newMessage,
          project_lead_id: projectLeadId, // ID of the project lead
          team_member_id: selectedTeamMember, // ID of the selected team member
          message_type: "text", // For now, assuming it's a text message
          created_at: new Date(),
        },
      ]);
      if (error) throw error;

      setNewMessage(""); // Clear input after sending
    } catch (error) {
      console.error("Error sending message:", error.message);
    }
  };

  if (loading) {
    return <div><Spinner /></div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Team Chat</h1>

      {/* Select Team */}
      <div className="mb-4">
        {/* <label className="block text-sm">Select Team</label> */}
        <select
          value={selectedTeam}
          onChange={(e) => setSelectedTeam(e.target.value)}
          className="text-primary-500 p-2 rounded-full border focus:outline-none focus:border-transparent "
        >
          <option value="">Select a Team</option>
          {teams.map((team) => (
            <option key={team.id} value={team.id}>
              {team.name}
            </option>
          ))}
        </select>
      </div>

      {/* Select Team Member */}
      <div className="mb-4">
        {/* <label className="block text-sm">Select Team Member</label> */}
        <select
          value={selectedTeamMember}
          onChange={(e) => setSelectedTeamMember(e.target.value)}
          className="text-primary-500 p-2 rounded-full border focus:outline-none focus:border-transparent "
        >
          <option value="">Select a Member</option>
          {members
            .filter((member) => member.team_id === parseInt(selectedTeam)) // Filter members by selected team
            .map((member) => (
              <option key={member.id} value={member.id}>
                {member.name}
              </option>
            ))}
        </select>
      </div>

      {/* Messages List */}
      <div className="space-y-4">
        {messages
          .filter(
            (message) =>
              message.team_member_id === parseInt(selectedTeamMember) &&
              message.project_lead_id === projectLeadId
          )
          .map((message) => (
            <div key={message.id} className="border-b py-2">
              <p>{message.content}</p>
              <small className="text-gray-500">{message.created_at}</small>
            </div>
          ))}
      </div>

      {/* Message Input */}
      <div className="mt-4 flex gap-2">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
          className="text-primary-950 p-2 flex-1 rounded-full border focus:outline-none focus:border-transparent"
        />
        <button
          onClick={sendMessage}
          className="bg-accent-500 text-white px-4 py-2  hover:bg-blue-600 rounded-full"
        >
          Send
        </button>
      </div>
    </div>
  );
}
