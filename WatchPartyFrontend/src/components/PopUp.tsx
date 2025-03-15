import { useState } from "react";
import { joinParty, createParty } from "./WebSocketClient";
declare const chrome: any;

const PopUp = () => {
  const [partyCode, setPartyCode] = useState("");
  const [inputCode, setInputCode] = useState("");
  // Function to generate a random party code
  const createPartyUI = async () => {
    const newCode = Math.random().toString(36).substr(2, 6).toUpperCase();
    console.log("Creating party with code:", newCode);
    setPartyCode(newCode);
    createParty(newCode);
    joinParty(newCode);
  };

  // Function to join an existing party
  const joinPartyUI = () => {
    joinParty(inputCode);
  };

  return (
    <div className="p-4 w-64 bg-gray-900 text-white rounded-lg shadow-lg flex flex-col items-center">
      <h2 className="text-lg font-semibold mb-4">Watch Party</h2>
      {partyCode ? (
        <div className="text-center">
          <p className="mb-2">Your Party Code:</p>
          <p className="text-xl font-bold bg-gray-700 p-2 rounded">{partyCode}</p>
        </div>
      ) : (
        <button
          onClick= {createPartyUI}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Create Party
        </button>
      )}
      <div className="mt-4 flex flex-col items-center w-full">
        <input
          type="text"
          placeholder="Enter Party Code"
          value={inputCode}
          onChange={(e) => setInputCode(e.target.value)}
          className="p-2 rounded bg-gray-800 text-white w-full text-center"
        />
        <button
          onClick={joinPartyUI}
          className="mt-2 bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
        >
          Join Party
        </button>
      </div>
    </div>
  );
};

export default PopUp;
