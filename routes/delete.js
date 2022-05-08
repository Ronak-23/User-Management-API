const router = require('express').Router()
const {check, validationResult}= require('express-validator')
const auth = require('../middleware/auth')

const User= require('../models/User')


router.delete('/',auth, async (req,res)=>{
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        return res.status(400).json({error : errors.array()})
    }
    try {
        User.findByIdAndDelete(req.user.id,
        (err,user)=>{
            if(err) {
                throw err
            }
            res.send( {user} )
        }
        )


    } catch (err) {
        console.error(err.message)
        res.status(500).send('Server Error')
    }
})

module.exports = router
