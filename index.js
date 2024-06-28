const express=require('express')
const mongoose=require('mongoose')
const methodOverride=require('method-override')
const path=require('path')
const Campground=require('./models/campgrounds.js')

const app =express()

mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp')
.then(() => console.log('database connected'))
.catch((err) => console.log('Error in databse connection!!!',err))

app.set('views engine','ejs')
app.set('views',path.join(__dirname,'views'))

// express middleware to get information from req.body
app.use(express.urlencoded({extended : true}))
app.use(methodOverride('_method'))      //express middleware to for methodOverride


app.get('/',(req,res) => {
    // res.send('Hello from YelpCamp')
    res.render('home.ejs')
})

app.get('/campgrounds',async (req,res) => {
    const campgrounds=await Campground.find({})
    res.render('campgrounds/index.ejs',{campgrounds})
})

app.post('/campgrounds',async(req,res) => {
   const campground=new Campground(req.body.campground)
    await campground.save()
    res.redirect(`/campgrounds/${campground._id}`)
    // new Campground()
})

app.get('/campgrounds/new',(req,res) => {
    res.render('campgrounds/new.ejs')
})

app.get('/campgrounds/:id',async(req,res) => {
    let {id}=req.params
    let campground=await Campground.findById(id)
    res.render('campgrounds/show.ejs',{campground})
})

app.get('/campgrounds/:id/edit',async(req,res) => {
    let {id}=req.params
    let campground = await Campground.findById(id);
    res.render('campgrounds/edit.ejs',{campground})
})

app.patch('/campgrounds/:id',async(req,res) => {
    let {id}=req.params
    let campground=req.body.campground
    let newCampground=await Campground.findByIdAndUpdate(id,campground,{runValidators : true,new : true})
    console.log(newCampground)
    res.redirect(`/campgrounds/${newCampground._id}`)
})

let port=3000
app.listen(port,()=> {
    console.log(`listening on port ${port}`)
})