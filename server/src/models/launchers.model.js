const launches = new Map();

let lastestFlighNumber = 100;

const launch = {
    flightNumber: 100,
    
    mission: 'kepler Exploration X',
    rocket: 'Explorer IS1',
    launchDate: new Date('December 27, 2024'),
    destination: 'Kepler-442 b',

    customer: ['NASA', 'SpaceX'],
    upcoming: true,
    success: true
};

launches.set(launch.flightNumber, launch);

function getAllLaunches() {
    return Array.from(launches.values());
}

function addNewLauch(launch) {
    lastestFlighNumber++;
    launches.set(
        lastestFlighNumber, 
        Object.assign(launch, {
            success: true,
            upcoming: true,
            customer: ['NASA', 'SpaceX'],
            flightNumber: lastestFlighNumber
    })
)};

module.exports = {
    launches,
    getAllLaunches,
    addNewLauch
};