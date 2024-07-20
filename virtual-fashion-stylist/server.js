const express = require('express');
const axios = require('axios');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

// Connect to MongoDB using the connection string from the environment variables
mongoose.connect(process.env.MONGODB_URI);

const UserSchema = new mongoose.Schema({
    username: String,
    preferences: Object,
    wardrobe: Array,
});

const User = mongoose.model('User', UserSchema);

// Example endpoint for generating outfit recommendations
app.post('/recommend-outfit', async (req, res) => {
    const { userId } = req.body;

    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        const response = await axios.post(process.env.GEMINI_API_URL, {
            preferences: user.preferences,
            wardrobe: user.wardrobe
        });

        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: 'Error generating outfit recommendations' });
    }
});

// Serve static files from the 'public' directory
app.use(express.static('public'));

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
