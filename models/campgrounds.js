const mongoose=require('mongoose');


const Schema=mongoose.Schema

const CampgoundSchema=new Schema({
    title : String,
    image : String,
    price : Number,
    description : String,
    location : String,
    reviews : [
        {
            type : mongoose.Schema.Types.ObjectId,
            ref : 'Review'
        }
    ]
})

module.exports= mongoose.model('Campground',CampgoundSchema)