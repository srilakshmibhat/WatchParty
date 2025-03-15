const WebSocket = require("ws");

function setupWebSocket() {
  const wss = new WebSocket.Server({ port: 5001 });
  const parties = {}; // Store active parties

  wss.on("connection", (ws) => {
    console.log("🔗 User connected");

    ws.on("message", (message) => {
      try {
        const data = JSON.parse(message);
        
        if (data.type === "join") {
          const { partyCode } = data;
          if (!parties[partyCode]) {
            parties[partyCode] = new Set();
          }
          parties[partyCode].add(ws);
          console.log(`👥 User joined party ${partyCode}`);
        }

        if (data.type === "sync") {
          const { partyCode, time } = data;
          if (parties[partyCode]) {
            parties[partyCode].forEach((client) => {
              if (client !== ws && client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify({ type: "sync", time }));
              }
            });
          }
        }
      } catch (error) {
        console.error("Invalid message received:", error);
      }
    });

    ws.on("close", () => {
      console.log("❌ User disconnected");
      // Remove user from all parties
      Object.keys(parties).forEach((partyCode) => {
        parties[partyCode].delete(ws);
        if (parties[partyCode].size === 0) {
          delete parties[partyCode];
        }
      });
    });
  });

  console.log("✅ WebSocket server running...");
}

module.exports = { setupWebSocket };
