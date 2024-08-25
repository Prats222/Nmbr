const express = require('express');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
const app = express();
const port = 3000;

app.use(express.json());

// Simple GET route for testing in the browser
app.get('/', (req, res) => {
    res.send('Hello! Your server is running.');
});

// Endpoint for JSON input data
app.post('/extract-numbers-json', (req, res) => {
    const data = req.body;  // Assuming the data is sent in the request body as JSON

    if (!Array.isArray(data)) {
        return res.status(400).json({ error: 'Invalid input, expected an array of objects.' });
    }

    const numbersArray = data.map(obj => {
        const stringValues = Object.values(obj).join(' ');
        const numbers = stringValues.match(/\d+/g);
        return numbers ? numbers.map(Number) : [];
    });

    res.json({ numbers: numbersArray });
});

// Endpoint for file uploads
app.post('/extract-numbers-file', upload.single('file'), (req, res) => {
    const fileData = req.file;

    if (!fileData) {
        return res.status(400).json({ error: 'File is required.' });
    }

    // Read file content here and parse it as JSON
    const fs = require('fs');
    fs.readFile(fileData.path, 'utf8', (err, content) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to read the uploaded file.' });
        }

        try {
            const data = JSON.parse(content);

            if (!Array.isArray(data)) {
                return res.status(400).json({ error: 'Invalid file content, expected an array of objects.' });
            }

            const numbersArray = data.map(obj => {
                const stringValues = Object.values(obj).join(' ');
                const numbers = stringValues.match(/\d+/g);
                return numbers ? numbers.map(Number) : [];
            });

            res.json({ numbers: numbersArray });
        } catch (e) {
            res.status(400).json({ error: 'Invalid JSON format in file.' });
        }
    });
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
