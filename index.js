const express = require('express');
const multer = require('multer');
const path = require('path');
const app = express();
const PORT = 3000;

// Set up file upload
const upload = multer({ dest: 'uploads/' });

// Serve the upload interface
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Handle photo upload
app.post('/upload', upload.single('photo'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  // Send the photo to the printer (see next step)
  printPhoto(req.file.path);

  res.json({ message: 'Photo uploaded and sent to printer!' });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
