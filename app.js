if(process.env.NODE_ENV != 'production') {
    require('dotenv').config()
}

const express = require('express')
const bodyParser = require('body-parser')
const request = require('request')
const https = require('https')
const bcrypt = require('bcrypt') // hashing password
const passport = require('passport')
const initializePassport = require('./passport-config')
const flash = require('express-flash')
const session = require('express-session')

initializePassport(
    passport,
    email => users.find(user => user.email === email),
    id => users.find(user => user.id === id)
    )

const users = []

const app = express()
// static folder
app.use(express.static(__dirname+'/public'))
app.use(flash())
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,// we wont resave the session variable if nothing is change
    saveInitialized: false
}))
app.use(passport.initialize())
app.use(passport.session())

// mengambil data dari inputan user
app.use(bodyParser.urlencoded({extended:true}))

app.get('/register', function(req,res){
    res.render(__dirname+'/register.ejs')
})
app.get('/', function(req,res){
    res.render(__dirname+'/home.ejs')
})



app.get('/login', function(req,res){
    res.render(__dirname+'/login.ejs')
})

//login
app.post('/login', passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true
}))

// register
app.post('/register' ,async function (req,res){
    const email = req.body.email
    const password = req.body.password
    const confirmPassword = req.body.confirmPassword

    try{
        const hashedPassword = await bcrypt.hash(password,10)
        users.push({
            id: Date.now().toString(),
            email: email,
            password: hashedPassword
        })
        res.redirect('/login')
        console.log(users);

    } catch(e)
    {
        res.redirect('/register')
    }
})

app.listen(3000, function(){
    console.log('Server berjalan di port 3000')
})
