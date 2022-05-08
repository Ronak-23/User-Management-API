const router = require('express').Router()
const {check, validationResult}= require('express-validator')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const User= require('../models/User')

router.post('/',
[
    check('name', 'Please provide a name').not().isEmpty(),
    check('email', 'Please prode a valid E-mail').isEmail(),
    check('password', 'Please provide atleast 6 character long password').isLength({min: 6}),
    check('gender', 'Please provide a gender').not().isEmpty(),
    check('age', 'Please provide an age').not().isEmpty(),
    check('address', 'Please provide an address').not().isEmpty(),
    check('city', 'Please provide a city').not().isEmpty(),
    check('state', 'Please provide a state').not().isEmpty(),
    check('zip', 'Please provide a zip').not().isEmpty()
],
async (req,res)=>{
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        return res.status(400).json({error : errors.array()})
    }
    
    const {name,email,password,gender,age,address,city,state,zip,image} = req.body
    try {
        let user = await User.findOne({email})
        if(user){
            return res.status(400).json({msg :' user already exists' })
        }
        user = new User({
            name,
            email,
            password,
            gender,
            age,
            address,
            city,
            state,
            zip,
            image
        })
        const salt = await bcrypt.genSalt(10)
        user.password =await bcrypt.hash(password,salt)
        await user.save()
        const payload = {
            user:{
                id:user.id
            }
        }
        jwt.sign(payload, process.env.SECRET,{
            expiresIn:3600
        }, (err,token)=>{
            if(err) throw err
            res.send( {token} )
        })

    } catch (err) {
        console.error(err.message)
        res.status(500).send('Server Error')
    }
})

module.exports = router
