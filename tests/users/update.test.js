const request = require('supertest')
const users = require('../../lib/users')
const config = require('../../lib/config')

const URL = config.URL

require('dotenv').config()

describe('Given a request to update users using PUT', () => {
    const updatedUserData = {
        name: 'Updated Name',
        gender: 'female',
        email: `updated.email.${Date.now()}@test.com`,
        status: 'inactive'
      }

    it('should update an existing user with valid data and return a 200 status code',  async ()=> {
        // Given
        const user = await users.createRandomUser()
        // When
        const response = await request(URL)
            .put(`/users/${user.id}`)
            .set('Authorization', `Bearer ${process.env.ACCESS_CODE}`)
            .set('Content-Type', 'application/json')
            .send(updatedUserData)
        // Then
        expect(response.status).toEqual(200)
        expect(response.body).toMatchObject(updatedUserData)
    })

    // BUG - when updating a resource without valid authentication system should return 401 but instead it returns 404 (user not found)
    it.skip('should return a 401 status code if access token is missing or invalid',  async ()=> {
        // Given
        const user = await users.createRandomUser()
        // When
        const response = await request(URL)
            .put(`/users/${user.id}`)
            .set('Content-Type', 'application/json')
            .send(updatedUserData)
        // Then
        expect(response.status).toEqual(401)
        expect(response.body.message).toEqual('Authentication failed')

        // When
        const response2 = await request(URL)
            .put(`/users/${user.id}`)
            .set('Authorization', `Bearer dummy`)
            .set('Content-Type', 'application/json')
            .send(updatedUserData)
        // Then
        expect(response2.status).toEqual(401)
        expect(response.body.message).toEqual('Authentication failed')
    })

    it('should return a 404 status code if the user ID does not exist',  async ()=> {
        const response = await request(URL)
            .put(`/users/123123`)
            .set('Authorization', `Bearer ${process.env.ACCESS_CODE}`)
            .set('Content-Type', 'application/json')
            .send(updatedUserData)

        expect(response.status).toEqual(404)
        expect(response.body.message).toBe('Resource not found')
    })
    // BUG - when trying to update partialy a resource using PUT requests the system should return a error. PUT request are used to modify the entire resource
    it.skip('should return a 400 status code if request data is invalid',  async ()=> {
        // Given
        const user = await users.createRandomUser()
        // When
        const response = await request(URL)
            .put(`/users/${user.id}`)
            .set('Authorization', `Bearer ${process.env.ACCESS_CODE}`)
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
            .send("string")
        // Then
        expect(response.status).toEqual(400)
        expect(response.body.message).toEqual('Error occurred while parsing request parameters')

        // When
        const response2 = await request(URL)
            .put(`/users/${user.id}`)
            .set('Authorization', `Bearer ${process.env.ACCESS_CODE}`)
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
            .send({})
        // Then
        expect(response2.status).toEqual(400)
        expect(response.body.message).toEqual('Error occurred while parsing request parameters')
        
        // When
        const response3 = await request(URL)
            .put(`/users/${user.id}`)
            .set('Authorization', `Bearer ${process.env.ACCESS_CODE}`)
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
            .send({"name": "Just one field updated"})
        // Then
        expect(response3.status).toEqual(400)
        expect(response.body.message).toEqual('Error occurred while parsing request parameters')
    })
})

describe('Given a request to update users using PATCH', () => {
    it('should update partially an existing user with valid data and return a 200 status code',  async ()=> {
        // Given
        const userData = {
            name: `Joe Doe`,
            gender: 'male',
            email: `joe.doe.${Date.now()}@test.com`,
            status: 'active'
          }
        const user = await users.createUser(userData)
        // When
        const response = await request(URL)
            .put(`/users/${user.id}`)
            .set('Authorization', `Bearer ${process.env.ACCESS_CODE}`)
            .set('Content-Type', 'application/json')
            .send({"status":"inactive"})
        // Then
        expect(response.status).toEqual(200)
        expect(response.body.name).toEqual(user.name)
        expect(response.body.gender).toEqual(user.gender)
        expect(response.body.email).toEqual(user.email)
        expect(response.body.status).toEqual("inactive")
    })

    it('should return a 404 status code if the user ID does not exist',  async ()=> {
        // When
        const response = await request(URL)
            .put(`/users/123123`)
            .set('Authorization', `Bearer ${process.env.ACCESS_CODE}`)
            .set('Content-Type', 'application/json')
            .send({"name":"404"})
        // Then
        expect(response.status).toEqual(404)
        expect(response.body.message).toBe('Resource not found')
    })
})