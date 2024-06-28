const mongoose=require('mongoose')
const cities=require('./cities.js')
const data=require('./seedHelper.js')

const Campground=require('../models/campgrounds.js')

mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp')
.then(() => {
    console.log('connection succesful to the database')
})
.catch((err) => {
    console.log('Error',err)
})

const sample=(array) => {
    return array[Math.floor(Math.random() * array.length)]
}

const seedDb=async ()=> {
    await Campground.deleteMany({})
    for(let i=0;i<50;i++){
        let random1000=Math.floor(Math.random() * 1000)
        const camp=new Campground({
            location : `${cities[random1000].city} , ${cities[random1000].state}`,
            title : `${sample(data.descriptors)} ${sample(data.places)} `
        })
        await camp.save()
    }
}
seedDb().then(() => {
    mongoose.connection.close()
})