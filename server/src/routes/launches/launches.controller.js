const { getAllLaunches, addNewLauch, scheduleNewLaunch, launches, existsLauchWithId, abortLaunchById } = require('../../models/launches.model');
const { getPagination } = require('../../services/query');

async function httpGetAllLaunches(req, res) {
    let { skip, limit } = getPagination(req.query);
    let launches = await getAllLaunches(skip, limit);
    return res.status(200).json(launches);
}

async function httpAddNewLauch(req, res) {
    const launch = req.body;

    if (!launch.mission || !launch.rocket || !launch.launchDate || !launch.target) {
        return res.status(400).json({
            error: 'Missing required launch property'
        });
    }

    launch.launchDate = new Date(launch.launchDate);
    if (isNaN(launch.launchDate)) {  
        return res.status(400).json({
            error: 'Invalid launch date',
        });
    }

    await scheduleNewLaunch(launch);
    return res.status(201).json(launch);
}

async function httpAbortLauch(req, res) {
    const launchId = Number(req.params.id);

    const existsLaunch = await existsLauchWithId(launchId);
    if (!existsLaunch){
        return res.status(404).json({
            error: 'Lauch not found',
        })
    }

    const aborted = await abortLaunchById(launchId);
    if(!aborted) {
        return res.status(400).json({
            error: 'Launch not aborted'
        });
    }

    return res.status(200).json({
        ok: true
    });
};

module.exports = {
    httpGetAllLaunches,
    httpAddNewLauch,
    httpAbortLauch
};