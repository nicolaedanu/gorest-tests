const request = require('supertest')
const users = require('../../lib/users')
const config = require('../../lib/config')

const URL = config.URL

require('dotenv').config()

describe('Given a request to GET /users', () =>{
    it('should return a list of users and a 200 status code if access token is valid', async () => {
        // Given
        const user1 = await users.createRandomUser()
        // When 
        const response = await request(URL)
            .get('/users')
            .set('Authorization', `Bearer ${process.env.ACCESS_CODE}`)
        // Then
        expect(response.status).toEqual(200)
        expect(response.body).toBeInstanceOf(Array)
        expect(response.body.length).toBeGreaterThan(0)

        // Tierdown
        await users.deleteUserById(user1.id)
    })
    
    it('should return users based on query parameters and a 200 status code if access token is missing', async ()=> {
        // Given
        const user1 = await users.createRandomUser()
        const user2 = await users.createRandomUser()
        // When
        const response = await request(URL)
            .get('/users')
            .set('Authorization', `Bearer ${process.env.ACCESS_CODE}`)
            .query({ page: 1, per_page: 2 })
        // Then
        expect(response.status).toEqual(200)
        expect(response.body).toBeInstanceOf(Array)
        expect(response.body.length).toBe(2)

        response.body.forEach(user => {
            expect(user).toHaveProperty('id')
            expect(user).toHaveProperty('name')
            expect(user).toHaveProperty('email')
            expect(user).toHaveProperty('gender')
            expect(user).toHaveProperty('status')
        })

        // Tierdown
        await users.deleteUserById(user1.id)
        await users.deleteUserById(user2.id)
    })
})

describe('Given an invalid access token', ()=> {
    it('should return a 401 status code and an error message', async ()=> {
        // When
        const response = await request(URL)
            .get('/users')
            .set('Authorization', `Bearer dummy`)
        // Then
        expect(response.status).toEqual(401)
        expect(response.body.message).toEqual('Invalid token')
    })
})

describe('Given a request to GET /users/{userId}', () => {
    it('should return user details and a 200 status code if user id is found and token is valid', async () => {
        // Given
        const user = await users.createRandomUser()
        // When
        const response = await request(URL)
            .get(`/users/${user.id}`)
            .set('Authorization', `Bearer ${process.env.ACCESS_CODE}`)
        // Then
        expect(response.status).toEqual(200)
        expect(response.body.name).toEqual(user.name)
        expect(response.body.email).toEqual(user.email)
        expect(response.body.gender).toEqual(user.gender)
        expect(response.body.status).toEqual(user.status)
        
        // Tierdown
        await users.deleteUserById(user.id)
    })

    it('should return status code 404 and an error message if user not found and token is missing', async () => {
        // When
        const response = await request(URL).get('/users/123123')
        // Then
        expect(response.status).toEqual(404)
        expect(response.body.message).toBe('Resource not found')
    })
})