const express = require('express')
const router = new express.Router()
const auth = require('../middleware/auth')
const User = require('../models/user')
const multer = require('multer')
const sharp = require('sharp')

// user profile
router.get('/users/me', auth, async (req, res) => {
    res.send(req.user)
})

// not expected to be functional/public
router.get('/users/:id', auth, async (req, res) => {
    try {
        const user = await User.findById(req.params.id)
        if(!user) {
            return res.status(404).send({})
        }
        res.status(200).send(user)
    }catch (error) {
        res.status(500).send({'error': error})
    }
})

// sign up
router.post('/users', async (req, res) => {
    const user = new User(req.body)

    try {
        await user.save()
        const token = await user.generateAuthToken()
        res.status(201).send({user, token})
    }catch (error) {
        res.status(500).send({ 'error' : error })
    }
})

// login
router.post('/users/login', async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password)
        const authToken = await user.generateAuthToken()
        return res.status(200).send({ user, authToken })
    }catch (error) {
        res.status(400).send({message: error.message})
    }
})

router.post('/users/logout', auth, async(req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter(item => {
            return item.token !== req.token
        })
        req.user.save()
    }catch (error) {
        res.status(500).send(error)
    }
})

router.post('/users/logoutAll', auth, async (req, res) => {
    try {
        req.user.tokens = [];
        await req.user.save();
        res.send()
    }catch(error) {
        res.status(500).send(error)
    }
})

// upload function
const upload = multer({
    // dest: 'avatar',
    limits: {
        fileSize: 1000000 // in bytes 1mb
    },
    // file: file param contains every information about the file being uploaded.
    fileFilter(req, file, callback) {
        if(!file.originalname.match(/\.(jpg|jpeg|png)$/)) { // file must be a word document.
            return callback(new Error("Please upload an image file."))
        }

        callback(undefined, true) // - for successful filter operation
    }
})

// upload function used as a middleware
// method single(...)exists in multer and in responsible for uploading
// file to destination point.
router.post('/users/me/avatar', auth, upload.single('file'), async (req, res) => {
    // req.user.avatar = req.file.buffer // get file from multer
    req.user.avatar = await sharp(req.file.buffer).resize({width: 250, height: 250}).png().toBuffer()
    await req.user.save()
    res.send()
}, (error, req, res, next) => {
    res.status(400).send({error: error.message})
})

router.patch('/users/me', auth, async (req, res) => {
    let requestFields = Object.keys(req.body)
    let updatableFields = ['name', 'email', 'password', 'age']
    let isUpdateAllowed = requestFields.every(field =>  updatableFields.includes(field))

    if(!isUpdateAllowed){
        return res.status(400).send({message: 'Invalid updates!'})
    }

    try{
        requestFields.forEach(field => req.user[field] = req.body[field])
        await req.user.save()

        res.send(req.user)
    }catch(error) {
        res.status(500).send({'error': error})
    }
})

router.delete('/users/me', auth, async (req, res) => {
    try {
        await req.user.remove()
        res.status(200).send(req.user)
    }catch (error) {
        res.status(500).send({error: error})
    }
})

router.delete('/users/me/avatar', auth, async (req, res) => {
    req.user.avatar = undefined
    req.user.save();
    res.send()
})

module.exports = router