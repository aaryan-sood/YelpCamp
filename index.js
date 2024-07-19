const express=require('express')
const mongoose=require('mongoose')
const methodOverride=require('method-override')
const path=require('path')
const ejsMate=require('ejs-mate')
const Campground=require('./models/campgrounds.js')
const catchAsync=require('./utilities/catchAsync.js')
const expressError=require('./utilities/expressErrors.js')
const joi=require('joi')
const {campgroundSchema,reviewSchema}=require('./schemas.js')
const Review=require('./models/reviews.js') 

const app =express()

mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp')
.then(() => console.log('database connected'))
.catch((err) => console.log('Error in databse connection!!!',err))

app.engine('ejs',ejsMate)   // to tell express to use ejs-mate as the engine of the many engines
app.set('views engine','ejs')
app.set('views',path.join(__dirname,'views'))

// express middleware to get information from req.body
app.use(express.urlencoded({extended : true}))
app.use(methodOverride('_method'))      //express middleware to for methodOverride

//custom middleware to validate campgrounds
const validateCampground= (req,res,next) => {
    const {error}=campgroundSchema.validate(req.body)
    if(error){
        let msg=error.details.map(el => el.message).join(',')
        throw new expressError(msg,400)
    }
    else{
        next()
}}
// middleware to validate reviews
const validateReview=(req,res,next) => {
    let {error}=reviewSchema.validate(req.body)
    console.log(reviewSchema.validate(req.body))
    if(error){
        let msg=error.details.map(el => el.message).join(',')
        throw new expressError(msg,400)
    }else{
        next()
    }
}


app.get('/campgrounds', catchAsync(async (req,res) => {
    const campgrounds=await Campground.find({})
    res.render('campgrounds/index.ejs',{campgrounds})
}))

app.post('/campgrounds',validateCampground,catchAsync(async(req,res,next) => {
    // if(req.body.campground === undefined){
    //     throw(new expressError('Invalid campground data',400))
    // }

    
    const campground=new Campground(req.body.campground)
    console.log(req.body.campground)
    await campground.save()
    res.redirect(`/campgrounds/${campground._id}`)
   
    // new Campground()
}))

app.get('/campgrounds/new',(req,res) => {
    res.render('campgrounds/new.ejs')
})

app.get('/campgrounds/:id',catchAsync(async(req,res) => {
    let {id}=req.params
    let campground=await Campground.findById(id).populate('reviews')
    res.render('campgrounds/show.ejs',{campground})
}))

app.get('/campgrounds/:id/edit', catchAsync(async(req,res) => {
    let {id}=req.params
    let campground = await Campground.findById(id);
    res.render('campgrounds/edit.ejs',{campground})
}))

app.patch('/campgrounds/:id',validateCampground,catchAsync(async(req,res) => {
    let {id}=req.params
    let campground=req.body.campground
    let newCampground=await Campground.findByIdAndUpdate(id,campground,{runValidators : true,new : true})
    res.redirect(`/campgrounds/${newCampground._id}`)
}))

app.delete('/campgrounds/:id',catchAsync(async(req,res) => {
    let {id}=req.params
    await Campground.findByIdAndDelete(id)
    res.redirect('/campgrounds')
})) 

app.post('/campgrounds/:id/reviews',validateReview,catchAsync(async (req,res) => {
    let {id}=req.params
    let camp=await Campground.findById(id)
    let review= new Review(req.body.review)
    camp.reviews.push(review)
    await camp.save()
    await review.save()
    res.redirect(`/campgrounds/${camp._id}`)

}))

app.all('*',(req,res,next) => {
    next(new expressError('Page Not Found',404))
})

// error handler
app.use((err,req,res,next) => {
    let {statusCode = 500}=err
    if(!err.message){
        err.message='Oh no, something went wrong'
    }
    res.status(statusCode).render('errors.ejs',{err})
})

let port=3000
app.listen(port,()=> {
    console.log(`listening on port ${port}`)
})