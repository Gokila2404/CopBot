const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors()); // Allow frontend requests

const PORT = process.env.PORT || 5000;

// Connect to local MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ Connected to MongoDB!'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

// Test route
app.get('/', (req, res) => {
  res.send('Server is running!');
});

// ChatGPT endpoint
app.post('/api/chat', async (req, res) => {
  const { message } = req.body;

  // For now, just echo the message
  // Later you can integrate OpenAI API here
  res.json({ reply: `You said: ${message}` });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
