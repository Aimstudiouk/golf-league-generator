import { useState } from 'react';

function App() {
  const [players, setPlayers] = useState("");
  const [pairs, setPairs] = useState([]);

  const handleGenerate = async () => {
    const names = players.split("\n").map(p => p.trim()).filter(Boolean);
    const res = await fetch("http://localhost:3001/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ players: names })
    });
    const data = await res.json();
    setPairs(data.pairs || []);
  };

  return (
    <div style={{ padding: "2rem", fontFamily: "sans-serif" }}>
      <h1>Golf League Generator</h1>
      <textarea
        rows="10"
        cols="30"
        placeholder="Enter one player per line"
        value={players}
        onChange={(e) => setPlayers(e.target.value)}
      />
      <br />
      <button onClick={handleGenerate}>Generate Pairs</button>
      <div style={{ marginTop: "1rem" }}>
        {pairs.map((pair, i) => (
          <div key={i}>
            Pair {i + 1}: {pair.join(" + ")}
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
