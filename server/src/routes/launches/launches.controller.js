const { getAllLaunches, addNewLauch, scheduleNewLaunch, launches, existsLauchWithId, abortLaunchById } = require('../../models/launches.model');

async function httpGetAllLaunches(req, res) {
    return await res.status(200).json(getAllLaunches());
}

async function httpAddNewLauch(req, res) {
    const launch = req.body;

    if (!launch.mission || !launch.rocket || !launch.launchDate || !launch.target) {
        res.status(400).json({
            error: 'Missing required launch property'
        });
    }

    launch.launchDate = new Date(launch.launchDate);
    if (isNaN(launch.launchDate)) {
        return res.status(400).json({
            error: 'Invalid launch data',
        });
    }

    await scheduleNewLaunch(launch);
    console.log(launch);
    return res.status(201).json(launch);
}

function httpAbortLauch(req, res) {
    const launchId = Number(req.params.id);

    if (!existsLauchWithId(launchId)){
        return res.status(404).json({
            error: 'Lauch not found',
        })
    }

    const aborted = abortLaunchById(launchId);
    return res.status(200).json(aborted);
};

module.exports = {
    httpGetAllLaunches,
    httpAddNewLauch,
    httpAbortLauch
};