const request = require('supertest')
const config = require('../../lib/config')
const users = require('../../lib/users')

const URL = config.URL

require('dotenv').config()

describe('Giving a request to POST /users ', () =>{
    it('should create a new user with valid data and return a 201 status code', async () => {
        // Given
        const userData = {
            name: `Joe Doe`,
            gender: 'male',
            email: `joe.doe.${Date.now()}@test.com`,
            status: 'active'
        }
        // When
        const response = await request(URL)
            .post('/users')
            .set('Authorization', `Bearer ${process.env.ACCESS_CODE}`)
            .set('Content-Type', 'application/json')
            .send(userData)
        const userCreated = await users.getUserById(response.body.id)
        // Then
        expect(response.status).toEqual(201)
        expect(userCreated.status).toBe(200)
        expect(response.body).toHaveProperty('id')
        expect(response.body.name).toEqual(userData.name)
        expect(response.body.gender).toEqual(userData.gender)
        expect(response.body.email).toEqual(userData.email)
        expect(response.body.status).toEqual(userData.status)
        // Tierdown
        await users.deleteUserById(response.body.id)
    })

    it('should return a 422 status code if the user already exists', async () => {
        // Given
        const userData = {
            name: `Joe Doe`,
            gender: 'male',
            email: `joe.doe.${Date.now()}@test.com`,
            status: 'active'
        }
        // When
        const response = await request(URL)
            .post('/users')
            .set('Authorization', `Bearer ${process.env.ACCESS_CODE}`)
            .set('Content-Type', 'application/json')
            .send(userData)
        // Then
        expect(response.status).toEqual(201)
        // When
        const response2 = await request(URL)
            .post('/users')
            .set('Authorization', `Bearer ${process.env.ACCESS_CODE}`)
            .set('Content-Type', 'application/json')
            .send(userData)
        // Then
        expect(response2.status).toEqual(422)
        expect(response2.body[0].field).toBe('email')
        expect(response2.body[0].message).toBe(`has already been taken`)

        // Tierdown
        await users.deleteUserById(response.body.id)

    })

    it('should return a 401 status code if access token is missing', async () => {
        // Given
        const userData = {
            name: `Joe Doe`,
            gender: 'male',
            email: `joe.doe.${Date.now()}@test.com`,
            status: 'active'
        }
        // When
        const response = await request(URL)
            .post('/users')
            .set('Content-Type', 'application/json')
            .send(userData)
        // Then
        expect(response.status).toEqual(401)
        expect(response.body.message).toEqual('Authentication failed')
        // When
        const response2 = await request(URL)
            .post('/users')
            .set('Authorization', `Bearer dummy`)
            .set('Content-Type', 'application/json')
            .send(userData)
        // Then
        expect(response2.status).toEqual(401)
        expect(response.body.message).toEqual('Authentication failed')
    })

    it('should return a 422 status code if request data is invalid', async () => {
        // Given 
        const userData = {
            name: `Joe Doe`,
            gender: 'male',
            status: 'active'
        }
        // When
        const response = await request(URL)
            .post('/users')
            .set('Authorization', `Bearer ${process.env.ACCESS_CODE}`)
            .set('Content-Type', 'application/json')
            .send(userData)
        // Then
        expect(response.status).toEqual(422)
        expect(response.body[0].field).toBe('email')
        expect(response.body[0].message).toBe(`can't be blank`)
    })
})