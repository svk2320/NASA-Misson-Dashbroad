const axios = require('axios');

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

const SPACEX_API_URL = 'https://api.spacexdata.com/v5/launches/query';

async function populateLaunches() {
    console.log('Downloading launch data...')

    const response = await axios.post(SPACEX_API_URL, {
        query: {},
        options: {
            pagination: false,
            populate: [
                {
                    path: 'rocket',
                    select: {
                        name: 1
                    }
                },
                {
                    path: 'payloads',
                    select: {
                        customers: 1
                    }
                }
            ]
        }
    });

    if (response.status !=200) {
        console.log('Problem downloading launch data');
        throw new Error('Launch data download failed');
    };

    const launchDocs = response.data.docs;

    for (const launchDoc of launchDocs) {
        const payloads = launchDoc['payloads']
        const customers = payloads.flatMap((payload) => {
            return payload['customers'];
        });

        const launch = {
            flightNumber: launchDoc['flight_number'],
            mission: launchDoc['name'],
            rocket: launchDoc['rocket']['name'],
            launchDate: launchDoc['date_local'],
            upcoming: launchDoc['upcoming'],
            success: launchDoc['success'],
            customers
        };

        // console.log(`${launch.flightNumber} ${launch.mission}`);

        await saveLaunch(launch);
    }
};

async function loadLaunchData() {
    const firstLaunch = await findLaunch({
        flightNumber: 1,
        rocket: 'Falcon 1',
        mission: 'FalsonSat'
    });

    if (firstLaunch) {
        console.log('Launch data already loaded...');
    } else {
        await populateLaunches();
    }
};


async function findLaunch(filter) {
    return await launchesDB.findOne(filter);
};

async function existsLauchWithId(launchId) {
    return await findLaunch({
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

async function getAllLaunches(skip, limit) {
    // return Array.from(launches.values());
    return await launchesDB
        .find({}, {'_id': 0,'__v': 0})
        .skip(skip)
        .limit(limit);
};

async function saveLaunch(launch) {
    await launchesDB.findOneAndUpdate({
        flightNumber: launch.flightNumber,
    }, launch, {
        upsert: true
    });
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
    const planet =  await planets.findOne({
        kepler_name: launch.target
    });
    if (!planet) {
        throw new Error('No matching planet was found');
    }

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
    loadLaunchData,
    existsLauchWithId,
    getAllLaunches,
    scheduleNewLaunch,
    abortLaunchById,
};