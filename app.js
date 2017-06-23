'use strict';

require('dotenv').config();
const PORT = process.env.PORT || 80;

const express = require('express');
const app = express();
const path = require('path');

app.use(express.static(path.resolve(__dirname, 'build/static/')));

app.get('/', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'build/index.html'));
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
})

module.exports = app;