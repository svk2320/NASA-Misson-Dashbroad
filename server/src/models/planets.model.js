const { parse } = require('csv-parse');
const fs = require('fs');
const path = require('path');
const planets = require('./planets.mongo');

// const habitablePlanets = [];

async function getAllPlanets() {
    // return habitablePlanets;
    return await planets.find({}, {
        '__v': 0,
        '_id': 0
    });
};

async function savePlanet(planet) {
    try {
        await planets.updateOne({ 
            kepler_name: planet.kepler_name
        }, {
            kepler_name: planet.kepler_name
        }, {
            upsert: true
        }); 
    } catch (err) {
        console.log(`Could not save planet ${err}`)
    }
};

function isHabitPlanet(planet) {
    return planet['koi_disposition'] === 'CONFIRMED' && planet['koi_insol'] > 0.36 && planet['koi_insol'] < 1.11 && planet['koi_prad'] < 1.6;
}

function loadPlanetData() {
    return new Promise((resolve, reject) => {
        fs.createReadStream(path.join(__dirname, '..', '..', 'data', 'kepler_data.csv'))
            .pipe(parse({
                comment: '#',
                columns: true
            }))
            .on('data', async (data) => {
                if (isHabitPlanet(data)) {
                    // habitablePlanets.push(data);
                    // TODO: Replace below create with insert + update = upsert
                    savePlanet(data);
                }
            })
            .on('error', (err) => {
                console.log(err);
                reject(err);
            })
            .on('end', async () => {
                // console.log(habitablePlanets.map((planet) => {
                //     return planet['kepler_name']
                // }));
                const countPlanetsFound = (await getAllPlanets()).length;
                console.log(`\n${countPlanetsFound} habitable planets found!\n`);
                resolve();
            });
    })
};


module.exports = {
    loadPlanetData,
    getAllPlanets,
};