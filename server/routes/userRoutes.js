const express = require("express");
const User = require("../models/userModel");
const bcrypt = require("bcrypt")

const router = express.Router();

router.post("/register", async (req, res) => {
    try{
        const userExist = await User.findOne({email:req.body.email})
        if(userExist){
            return res.send({
                success: false,
                message : "User already exist"
            })
        }

        const salt = await bcrypt.genSalt(10)
        const hashed = await bcrypt.hash(req.body.password,salt);
        req.body.password = hashed;
        const newUser = new User(req.body)
        await newUser.save()
        res.json("user created")
    }
    catch(error){
        res.json(error);
    }

});

router.post("/login", async (req, res) => {
    const user = await User.findOne({email:req.body.email})
    if(!user){
        res.ssend({
            success: false,
            message : "User does not exist"
        })
    }
    const validPassword = await bcrypt.compare(req.body.password,user.password)
    if(!validPassword){
        return res.send({
            success : false,
            message :"invalid password"
        })
    }

    res.send({
        sccesss : true,
        message: "User Logged in"
    })
});


module.exports = router;