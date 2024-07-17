const mongoose=require('mongoose')
const reviewSchema=new mongoose.Schema({
    body:String,
    rating : {
        type : Number,
        min : 1,
        max : 5
    }
})
module.exports=mongoose.model('Review',reviewSchema)