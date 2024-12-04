"use client";

import { useEffect, useState, useRef } from "react";

export default function CallPage() {
  const [isInCall, setIsInCall] = useState(false);
  const [callInitiated, setCallInitiated] = useState(false);
  const [incomingCall, setIncomingCall] = useState(false);
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);

  // WebRTC setup variables
  const peerConnectionRef = useRef(null);
  const localStreamRef = useRef(null);
  const remoteStreamRef = useRef(null);

  // Setup Media Stream for local video and audio
  const getLocalStream = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      localVideoRef.current.srcObject = stream;
      localStreamRef.current = stream;
    } catch (error) {
      console.error("Error accessing media devices:", error.message);
    }
  };

  // Initialize WebRTC connection
  const setupPeerConnection = () => {
    peerConnectionRef.current = new RTCPeerConnection();

    // Send local stream to the remote peer
    localStreamRef.current.getTracks().forEach((track) => {
      peerConnectionRef.current.addTrack(track, localStreamRef.current);
    });

    // On receiving remote stream, set it to the video element
    peerConnectionRef.current.ontrack = (event) => {
      remoteStreamRef.current = event.streams[0];
      remoteVideoRef.current.srcObject = remoteStreamRef.current;
    };

    // Handle ICE candidate events
    peerConnectionRef.current.onicecandidate = (event) => {
      if (event.candidate) {
        // Send ICE candidate to the remote peer (via signaling server)
        console.log("Sending ICE candidate: ", event.candidate);
      }
    };
  };

  // Start the call (offer)
  const startCall = async () => {
    setCallInitiated(true);
    await getLocalStream();
    setupPeerConnection();

    // Create an offer and send it to the remote peer
    const offer = await peerConnectionRef.current.createOffer();
    await peerConnectionRef.current.setLocalDescription(offer);

    // In a real app, you would send the offer to the signaling server here (e.g., using Supabase)
    console.log("Offer created: ", offer);
  };

  // Answer an incoming call (answer)
  const answerCall = async () => {
    await getLocalStream();
    setupPeerConnection();

    // Set the remote description (the offer from the calling peer)
    await peerConnectionRef.current.setRemoteDescription(incomingCall.offer);

    // Create an answer and send it back to the caller
    const answer = await peerConnectionRef.current.createAnswer();
    await peerConnectionRef.current.setLocalDescription(answer);

    // In a real app, you would send the answer back to the signaling server
    console.log("Answer created: ", answer);
    setIsInCall(true);
    setIncomingCall(false);
  };

  // End the call
  const endCall = () => {
    peerConnectionRef.current.close();
    localStreamRef.current.getTracks().forEach(track => track.stop());
    setIsInCall(false);
    setCallInitiated(false);
  };

  // Simulate incoming call for demo (REMOVE THIS PART IN PRODUCTION)
  const simulateIncomingCall = () => {
    setIncomingCall(true);
    console.log("Incoming call...");
  };

  // Remove automatic call after 5 seconds (for demo purposes)
  useEffect(() => {
    // This part was simulating an incoming call after 5 seconds, 
    // and should be removed or handled by a real call notification system.
    // Commenting out this line to prevent auto calls.
    // setTimeout(() => {
    //   simulateIncomingCall();
    // }, 5000);
  }, []);

  return (
    <div className="p-6 ">
      <h1 className="text-2xl font-bold mb-4">Video Call</h1>

      {/* Local Video */}
      <div className="mb-4">
        <h3>Your Video</h3>
        <video ref={localVideoRef} autoPlay muted className="border  w-68" />
      </div>

      {/* Remote Video */}
      {isInCall && (
        <div className="mb-4">
          <h3>Remote Video</h3>
          <video ref={remoteVideoRef} autoPlay className="border w-full p-4" />
        </div>
      )}

      {/* Call Controls */}
      <div>
        {!callInitiated && !isInCall && (
          <button
            onClick={startCall}
            className="bg-accent-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            Start Call
          </button>
        )}

        {incomingCall && !isInCall && (
          <div>
            <p>Incoming call...</p>
            <button
              onClick={answerCall}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Answer Call
            </button>
            <button
              onClick={endCall}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 ml-2"
            >
              Reject Call
            </button>
          </div>
        )}

        {(isInCall || callInitiated) && (
          <button
            onClick={endCall}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            End Call
          </button>
        )}
      </div>
    </div>
  );
}
