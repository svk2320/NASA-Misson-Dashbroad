const http = require('http');
const { default: mongoose } = require('mongoose');
const mongodb = require('mongoose');
const app = require('./app');

const { loadPlanetData } = require('./models/planets.model');

const PORT = process.env.PORT || 8000;

const PASSWORD = '4TQPT2abkgxOLvzE';

const MONGO_URL = `mongodb+srv://nasa-appi:${PASSWORD}@nasa.u9gpflr.mongodb.net/nasa?retryWrites=true&w=majority`;

const server = http.createServer(app);

mongoose.connection.once('open', () => {
    console.log('MongoDB connection ready..!');
});

mongoose.connection.on('error', (err) => {
    console.log(err);
});

mongoose.set("strictQuery", false);

async function startServer() {
    await mongodb.connect(MONGO_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
    await loadPlanetData();

    server.listen(PORT, () => {
        console.log(`Server is listening on ${PORT}`);
    });
};

startServer();