const launchesDB = require('./launches.mongo');
const planets = require('./planets.mongo');

const DEFAULT_FLIGHT_NUMBER = 100;

// const launches = new Map();

// let lastestFlighNumber = 100;

const launch = {
    flightNumber: 100,
    
    mission: 'kepler Exploration X',
    rocket: 'Explorer IS1',
    launchDate: new Date('December 27, 2024'),
    target: 'Kepler-442 b',

    customer: ['NASA', 'SpaceX'],
    upcoming: true,
    success: true
};

// launches.set(launch.flightNumber, launch);

async function existsLauchWithId(launchId) {
    return await launchesDB.findOne({
        flightNumber: launchId
    });
};

async function getLastestFlightNumber() {
    try{
        const latestLaunch = await launchesDB
            .findOne()
            .sort('-flightNumber');
    
        if (!latestLaunch) {
            return DEFAULT_FLIGHT_NUMBER;
        };
    
        return latestLaunch.flightNumber;
    } catch (err) {
        console.log('Error');
    }
};

async function getAllLaunches() {
    // return Array.from(launches.values());
    return await launchesDB.find({}, {
        '_id': 0,
        '__v': 0
    });
};

async function saveLaunch(launch) {
    const planet =  await planets.findOne({
        kepler_name: launch.target
    });
    if (!planet) {
        throw new Error('No matching planet was found');
    } else {
        await launchesDB.findOneAndUpdate({
            flightNumber: launch.flightNumber,
        }, launch, {
            upsert: true
        });
    }
};

// function addNewLauch(launch) {
//     lastestFlighNumber++;
//     launches.set(
//         lastestFlighNumber, 
//         Object.assign(launch, {
//             success: true,
//             upcoming: true,
//             customer: ['NASA', 'SpaceX'],
//             flightNumber: lastestFlighNumber
//     })
// )};

async function scheduleNewLaunch(launch) {
    const newFlightNumber = await getLastestFlightNumber() + 1;
    console.log(newFlightNumber);

    const newLaunch = Object.assign(launch, {
        success: true,
        upcoming: true,
        customer: ['NASA', 'SpaceX'],
        flightNumber: newFlightNumber
    });

    await saveLaunch(newLaunch);
};

async function abortLaunchById(launchId){
    // const aborted = launches.get(launchId);
    // aborted.upcoming = false;
    // aborted.success = false;
    // return aborted;

    const aborted = await launchesDB.updateOne({
        flightNumber: launchId
        },{
            upcoming: false,
            success: false
        });

    return aborted.ok === 1 && aborted.nModified === 1;
    }

saveLaunch(launch);

module.exports = {
    getAllLaunches,
    scheduleNewLaunch,
    existsLauchWithId,
    abortLaunchById,
};