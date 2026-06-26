const fs = require('fs');
const content = fs.readFileSync('app/champion/[id]/ChampionDetailClient.jsx', 'utf8');
const lines = content.split('\n');
lines.forEach((line, index) => {
  if (line.includes('resolvedBuild')) {
    console.log(`Line ${index + 1}: ${line.trim()}`);
  }
});
