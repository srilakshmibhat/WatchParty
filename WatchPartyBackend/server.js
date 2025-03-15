// server.js
const express = require('express');
const http = require('http'); // Import http module
const WebSocket = require('ws');
const db = require('./db'); // Your SQLite database connection
const app = express();
const port = 5000;

app.use(express.json());

// Create an HTTP server from your Express app
const server = http.createServer(app);

// Create a WebSocket server using the HTTP server
const wss = new WebSocket.Server({ server });

// Store connected clients with party codes
const partyClients = {};

wss.on('connection', (ws) => {
  let partyCode; // Store the party code for this client

  ws.on('message', (message) => {
    try {
      const data = JSON.parse(message);

      if (data.type === 'create') {

        partyCode = data.partyCode;
        db.run('INSERT INTO parties (code) VALUES (?)', [partyCode], (err) => {
          if (err) {
            ws.send(JSON.stringify({ type: 'error', message: 'Failed to create party' }));
            ws.close();
            return;
          }
        }
        );
        console.log(`User created party: ${partyCode}`);
        ws.send(JSON.stringify({ type: 'created', partyCode: partyCode }));
      }
      else if (data.type === 'join') {
        partyCode = data.partyCode;

        // Check if the party code exists in the database
        db.get('SELECT code FROM parties WHERE code = ?', [partyCode], (err, row) => {
          if (err || !row) {
            ws.send(JSON.stringify({ type: 'error', message: 'Invalid party code' }));
            ws.close();
            return;
          }

          if (!partyClients[partyCode]) {
            partyClients[partyCode] = [];
          }
          partyClients[partyCode].push(ws);

          console.log(`User joined party: ${partyCode}`);
          ws.send(JSON.stringify({ type: 'joined', partyCode: partyCode }));
        });
      } else if (data.type === 'sync') {
        if (partyCode && partyClients[partyCode]) {
          partyClients[partyCode].forEach((client) => {
            if (client !== ws && client.readyState === WebSocket.OPEN) {
              client.send(JSON.stringify(data)); // Broadcast sync data
            }
          });
        }
      }

    } catch (error) {
      console.error('Error processing message:', error);
      ws.send(JSON.stringify({ type: 'error', message: 'Invalid message format' }));
    }
  });

  ws.on('close', () => {
    if (partyCode && partyClients[partyCode]) {
      partyClients[partyCode] = partyClients[partyCode].filter((client) => client !== ws);
      if (partyClients[partyCode].length === 0) {
        delete partyClients[partyCode];
      }
      console.log(`User left party: ${partyCode}`);
    }
  });
});

// Start the HTTP server (which also starts the WebSocket server)
server.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

// Express Routes (createParty, etc.) remain the same