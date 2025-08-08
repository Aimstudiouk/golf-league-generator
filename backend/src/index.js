const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors());
app.use(express.json());

let lastWeekPairs = [];

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function pairExistsInLastWeek(pair) {
  const pairSet = new Set(pair);
  return lastWeekPairs.some(lastPair => {
    return pairSet.size === lastPair.length && lastPair.every(p => pairSet.has(p));
  });
}

function generatePairs(players) {
  let attempts = 0;
  let pairs;

  do {
    const shuffled = shuffle([...players]);
    pairs = [];

    while (shuffled.length >= 2) {
      pairs.push([shuffled.pop(), shuffled.pop()]);
    }

    if (shuffled.length === 1) {
      // Add the last person to the last pair to make a 3-ball
      pairs[pairs.length - 1].push(shuffled.pop());
    }

    attempts++;
    if (attempts > 20) break; // fallback if we can't find a new set
  } while (pairs.some(pair => pairExistsInLastWeek(pair)));

  lastWeekPairs = pairs;
  return pairs;
}

app.post('/generate', (req, res) => {
  const { players } = req.body;
  if (!players || !Array.isArray(players)) {
    return res.status(400).json({ error: 'Players must be an array' });
  }
  const pairs = generatePairs(players);
  res.json({ pairs });
});

app.listen(3001, () => console.log("Backend running on http://localhost:3001"));
