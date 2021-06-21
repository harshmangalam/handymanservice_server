const {Schema,model} = require("mongoose")


const chatSchema = new Schema({
    sender:{
        type:Schema.Types.ObjectId,
        ref:"User"
    },
    receiver:{
        type:Schema.Types.ObjectId,
        ref:"User"
    },
    body:{
        type:String,
        
    },

},{timestamps:true})


module.exports = model("Chat",chatSchema)
