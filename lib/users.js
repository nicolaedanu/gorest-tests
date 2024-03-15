const request = require('supertest')
const config = require('./config')
const URL = config.URL
require('dotenv').config()

const createUser = async (userData) => {
    try {
        const response = await request(URL)
            .post('/users')
            .set('Authorization', `Bearer ${process.env.ACCESS_CODE}`)
            .set('Content-Type', 'application/json')
            .send(userData)
        return response.body   
    } catch (error) {
        throw new Error(`Failed to create user: ${error}`)
    }
}

const createRandomUser = async () => {
    const userData = {
        name: `Joe Doe`,
        gender: 'male',
        email: `joe.doe.${Date.now()}@test.com`,
        status: 'active'
      }
    return createUser(userData)
}

const getUserById = async (userId) => {
    try {
        const response =  await request(URL)
            .get(`/users/${userId}`)
            .set('Authorization', `Bearer ${process.env.ACCESS_CODE}`)
            return response
    } catch (error) {
        throw new Error(`Failed to retrieve user by id: ${error}`)
    }
    
}
const deleteUserById = async (userId) => {
    try {
        const response = await request(URL)
            .delete(`/users/${userId}`)
            .set('Authorization', `Bearer ${process.env.ACCESS_CODE}`)
        return response
    } catch (error) {
        throw new Error(`Failed to delete user: ${error}`)
    }
}
module.exports = { createUser, createRandomUser, getUserById, deleteUserById }