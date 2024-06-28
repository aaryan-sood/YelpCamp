const express=require('express')
const mongoose=require('mongoose')
const path=require('path')
const Campground=require('./models/campgrounds.js')

app=express()

mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp')
.then(() => console.log('database connected'))
.catch((err) => console.log('Error in databse connection!!!',err))

app.set('views engine','ejs')
app.set('views',path.join(__dirname,'views'))


app.get('/',(req,res) => {
    // res.send('Hello from YelpCamp')
    res.render('home.ejs')
})

app.get('/makeCampground',async (req,res) => {
    const camp = new Campground({title : 'My Backyard',description : 'Cheap Camping'})
    await camp.save()
    res.send(camp)
})

let port=3000
app.listen(port,()=> {
    console.log(`listening on port ${port}`)
})