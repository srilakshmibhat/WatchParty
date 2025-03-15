const socket = new WebSocket("ws://localhost:5000"); // Adjust URL when deployed

socket.onopen = () => {
  console.log("✅ Connected to WebSocket server");
};

// Handle incoming messages
socket.onmessage = (event: MessageEvent) => {
  const data = JSON.parse(event.data);

  if (data.type === "joined") {
    console.log(`🎉 Successfully joined party: ${data.partyCode}`);
    chrome.runtime.sendMessage({ action: "openTab", url: `http://localhost:5173/${data.partyCode}` });
  } else if (data.type === "sync") {
    console.log("🔄 Sync data received:", data);
  } else if (data.type === "error") {
    console.error("❌ Error:", data.message);
  }
};

// Handle connection errors
socket.onerror = (error) => {
  console.error("WebSocket error:", error);
};

// Handle connection close
socket.onclose = () => {
  console.log("⚠️ Disconnected from WebSocket server");
};

// Function to join a party
export const joinParty = (partyCode: string): void => {
  if (socket.readyState === WebSocket.OPEN) {
    socket.send(JSON.stringify({ type: "join", partyCode }));
  } else {
    console.error("WebSocket is not open.");
  }
};

export const createParty = (partyCode: string): void => {
  if (socket.readyState === WebSocket.OPEN) {
    socket.send(JSON.stringify({ type: "create", partyCode }));
  } else {
    console.error("WebSocket is not open.");
  }
};

// Function to sync data to other users
export const syncData = (syncPayload: object): void => {
  if (socket.readyState === WebSocket.OPEN) {
    socket.send(JSON.stringify({ type: "sync", ...syncPayload }));
  } else {
    console.error("WebSocket is not open.");
  }
};
