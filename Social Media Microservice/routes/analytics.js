import express from "express";
import {getTopUsers}from '../service/MediaService.js';
const router = express.Router();


router.get('/users',async (req,res)=>{
    try{
        let res = await getTopUsers();
        console.log(res);
        res.send("Server is working");
    }
    catch(err){
        res.status(500).json({error: err.message});
    }
})

export default router