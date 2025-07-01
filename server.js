// server.js

const express = require('express');
const path = require('path');

const app = express();
const PORT = 3000;

// This line is the key. It tells Express to serve all static files 
// (like index.html) from the same directory where server.js is located.
app.use(express.static(__dirname));

app.get('/', (req, res) => {
  // This ensures that visiting http://localhost:3000 serves your index.html
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`✅ Server is running!`);
  console.log(`Navigate to http://localhost:${PORT} in your browser.`);
  console.log(`(Press Ctrl+C to stop the server)`);
});