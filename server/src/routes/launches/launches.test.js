const request = require('supertest');
const app = require('../../app');
const { mongoConnect, mongoDisconnect } = require('../../services/mongo');

describe('launches API', () => {
    // Connecting mongo to start the test
    beforeAll( async () => {
        await mongoConnect();
    });

    // Disconnecting mongoDB to exit the test
    afterAll( async () => {
        await mongoDisconnect();
    });

    describe('Test GET /launches', () => {
        test('It should reponde with 200 success', async () => {
            await request(app)
            .get('/launches')
            .expect('Content-Type', /json/)
            .expect(200);
        });
    });
    
    describe('Test POST /launch', () => {
        const completeLaunchData = {
                mission: 'ISRO to Mars',
                rocket: 'ISRRO 178',
                target: 'Kepler-62 f',
                launchDate: 'May 03, 2030'
        };
    
        const launchDataWithoutDate = {
            mission: 'ISRO to Mars',
            rocket: 'ISRRO 178',
            target: 'Kepler-62 f'
        }
    
        const launchDateWithInvalidDate = {
            mission: 'ISRO to Mars',
            rocket: 'ISRRO 178',
            target: 'Kepler-62 f',
            launchDate: 'InvalidDate'
        };
    
        test('It should respond with 201 created', async () => {
            const response = await request(app)
                .post('/launches')
                .send(completeLaunchData)
                .expect('Content-Type', /json/)
                .expect(201);
    
            const requestDate = new Date(completeLaunchData.launchDate).valueOf();
            const responseDate = new Date(response.body.launchDate).valueOf();
            expect(responseDate).toBe(requestDate);
    
            expect(response.body).toMatchObject(launchDataWithoutDate);
        });
    
        test('It should catch missing required properties', async () => {
            const response = await request(app)
                .post('/launches')
                .send(launchDataWithoutDate)
                .expect('Content-Type', /json/)
                .expect(400);
    
            expect(response.body).toStrictEqual({
                error: 'Missing required launch property',
            });
        });
        test('It should catch invaild dates', async () => {
            const response = await request(app)
                .post('/launches')
                .send(launchDateWithInvalidDate)
                .expect('Content-Type', /json/)
                .expect(400);
    
            expect(response.body).toStrictEqual({
                error: 'Invalid launch date',
            });
        });
    });
})