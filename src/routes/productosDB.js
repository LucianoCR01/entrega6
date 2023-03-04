const { Router} = require("express");
const userModel = require ("../models/user.model");
const userRouterDB = Router()



userRouterDB.get("/", async (req,res)=>{
    let limit = req.query.limit || 10
    let page = req.query.page || 1
    let query = req.query.query 
    let sort = req.query.sort

    
    let result;
    try{
        result = await userModel.paginate({},{page,limit})
    }   catch (error){
        console.log(error)
    }
    res.json(result)
    
    
})


module.exports = userRouterDB