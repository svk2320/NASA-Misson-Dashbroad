const express = require('express');
const cors = require('cors');
const path = require('path');
// const morgan = require('morgan');
const api = require('./routes/api');

const app = express();

app.use(cors({
    origin: 'http://localhost:3000'
}));

// prints out the loggers
app.use(morgan('combined'));

app.use(express.json());

app.use(express.static(path.join(__dirname, '..', 'public')));

app.use('/', api);
app.use('/v2', apiforvs);

app.get('/*', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'index.html'))
})

module.exports = app;