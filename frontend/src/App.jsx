import { useState } from 'react';

function App() {
  const [leagueName, setLeagueName] = useState("Frank Palmer Winter League");
  const [week, setWeek] = useState("");
  const [players, setPlayers] = useState("");
  const [pairs, setPairs] = useState([]);
  const [error, setError] = useState("");

  const handleGenerate = async () => {
    const names = players.split("\n").map(p => p.trim()).filter(Boolean);
    if (!week || !leagueName || names.length < 2) {
      setError("Please enter league name, week, and at least two players.");
      return;
    }
    setError("");

    const res = await fetch("http://localhost:3001/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ leagueName, week, players: names })
    });

    const data = await res.json();
    setPairs(data.pairs || []);
  };

  const handleDownloadCSV = () => {
    if (!pairs.length) return;

    let csvContent = "Pair Number,Player 1,Player 2,Player 3 (if any)\n";
    pairs.forEach((pair, i) => {
      csvContent += [i + 1, pair[0], pair[1], pair[2] || ""].join(",") + "\n";
    });

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const cleanLeague = leagueName.replace(/\s+/g, "_");
    const cleanWeek = week.replace(/\s+/g, "_");
    link.setAttribute("href", URL.createObjectURL(blob));
    link.setAttribute("download", `${cleanLeague}_${cleanWeek}.csv`);
    link.click();
  };

  return (
    <div style={{ padding: "2rem", fontFamily: "sans-serif" }}>
      <h1>Golf League Generator</h1>

      <label>League Name:</label><br />
      <input
        type="text"
        value={leagueName}
        onChange={(e) => setLeagueName(e.target.value)}
        style={{ width: "300px", marginBottom: "1rem" }}
      /><br />

      <label>Week:</label><br />
      <input
        type="text"
        placeholder="e.g. Week 1 or 2025-08-08"
        value={week}
        onChange={(e) => setWeek(e.target.value)}
        style={{ width: "300px", marginBottom: "1rem" }}
      /><br />

      <label>Players (one per line):</label><br />
      <textarea
        rows="10"
        cols="30"
        placeholder="Enter one player per line"
        value={players}
        onChange={(e) => setPlayers(e.target.value)}
        style={{ marginBottom: "1rem" }}
      />
      <br />

      <button onClick={handleGenerate}>Generate Pairs</button>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {pairs.length > 0 && (
        <>
          <div style={{ marginTop: "1rem" }}>
            {pairs.map((pair, i) => (
              <div key={i}>
                Pair {i + 1}: {pair.join(" + ")}
              </div>
            ))}
          </div>
          <button style={{ marginTop: "1rem" }} onClick={handleDownloadCSV}>
            Download CSV
          </button>
        </>
      )}
    </div>
  );
}

export default App;
