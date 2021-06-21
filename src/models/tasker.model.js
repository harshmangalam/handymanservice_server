const {model,Schema} = require("mongoose")


const taskerSchema = new Schema({
    user:{
        type:Schema.Types.ObjectId,
        ref:"User"
    },
    
})

module.exports = model("Tasker",taskerSchema)