const request = require('supertest')
const app = require('../src/app')
const User = require('../src/models/user')
const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')

const user1Id = new mongoose.Types.ObjectId()

const user1 =  {
    _id: user1Id,
    name: process.env.USER_NAME,
    email: process.env.USER_EMAIL,
    age: 99,
    password: 'This is expected to be a very strong password containing letters, $Ymbols && 7u3b45',
    tokens: [{
        token: jwt.sign({_id: user1Id}, process.env.JWT_SECRET)
    }]
}

beforeEach(async () => {
    await User.deleteMany()
    await new User(user1).save()
})

test('Should signup a new user', async () => {
    await request(app).post('/users').send({
        name: 'John',
        email: 'john@doe.com',
        age: 0,
        password: 'the password.'
    }).expect(201)
})

test('Should login existing user', async () => {
    const response = await request(app).post('/users/login').send({
        email: user1.email,
        password: user1.password
    }).expect(200)

    const user = await User.findById(response.body.user._id)
    expect(response.body.authToken).toBe(user.tokens[1].token)
})

test('Should not login0', async () => {
    await request(app).post('/users/login').send({
        email: 'test@email.com',
        password: 'test-password'
    }).expect(400)
})

test('Should get user profile', async () => {
    await request(app).get('/users/me')
        .set('Authorization', `Bearer ${user1.tokens[0].token}`)
        .send()
        .expect(200)
})

test('Should not get profile for unauthenticated user', async () => {
    await request(app).get('/users/me')
        .send().expect(400)
})

test('Should delete account of authenticated user', async() => {
    await request(app).delete('/users/me')
        .set('Authorization', `Bearer ${user1.tokens[0].token}`)
        .send()
        .expect(200)

    const user = await User.findById(user1._id)
    expect(user).toBeNull()
})

test('Should not delete account of non authenticated user', async () => {
    await request(app).delete('/users/me')
        .send()
        .expect(400)
})