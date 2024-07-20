const express = require('express');
const axios = require('axios');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

// Example endpoint for generating outfit recommendations
app.post('/recommend-outfit', async (req, res) => {
    const { userPreferences, wardrobeItems } = req.body;

    try {
        const response = await axios.post('https://api.gemini.com/v1/generate-outfit', {
            preferences: userPreferences,
            wardrobe: wardrobeItems
        });

        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: 'Error generating outfit recommendations' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

// Serve static files from the 'public' directory
app.use(express.static('public'));
