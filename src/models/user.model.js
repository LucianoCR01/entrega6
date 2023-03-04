const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2")

const userCollection = "productos"

const useSchema = mongoose.Schema({
    title: {type: String, required:true, max:100},
    descripction: {type: String, required:true, max:100},
    price: {type: Number, required:true},
    thumbnail: {type: String, required:true, max:100},
    code: {type: Number, required:true},
    stock: {type: Number, required:true}
})
useSchema.plugin(mongoosePaginate)
const userModel = mongoose.model(userCollection, useSchema)

module.exports =  userModel;