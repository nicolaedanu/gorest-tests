const request = require('supertest')
const users = require('../../lib/users')
const config = require('../../lib/config')

const URL = config.URL

require('dotenv').config()

describe('Giving a request to POST /users ', () =>{
    it('should delete an existing user and return a 204 status code', async ()=> {
        // Given
        const user = await users.createRandomUser()
        const createdUser = await users.getUserById(user.id)
        expect(createdUser.status).toEqual(200)
        // When
        const response = await request(URL)
            .delete(`/users/${user.id}`)
            .set('Authorization', `Bearer ${process.env.ACCESS_CODE}`)
            .set('Content-Type', 'application/json')
        // Then
        expect(response.status).toEqual(204)
        const deleteUser = await users.getUserById(user.id)
        expect(deleteUser.status).toEqual(404)
    })
    // Bad practice - in order to save load on the DB the system should first check if the user has access before making a call to DB
    it.skip('should return a 401 status code if access token is missing or invalid', async ()=> {
        // When
        const response = await request(URL)
            .delete(`/users/1111`)
            .set('Content-Type', 'application/json')
        // Then
        expect(response.status).toEqual(401)
        expect(response.body.message).toEqual('Authentication failed')
    })

    it('should return a 404 status code if the user ID does not exist', async ()=> {
        // When
        const response = await request(URL)
            .delete(`/users/00000`)
            .set('Authorization', `Bearer ${process.env.ACCESS_CODE}`)
            .set('Content-Type', 'application/json')
        // Then
        expect(response.status).toEqual(404)
        expect(response.body.message).toBe('Resource not found')
    })
})