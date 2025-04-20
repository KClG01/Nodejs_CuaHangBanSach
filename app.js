const express = require('express')
const app = express()
const port =3000
app.set("view engine","ejs");
app.set("views","./views");
app.use(express.static('public'))
app.get(['/','/login'],(req,res)=>{
    res.render("layout",data ={content:'login.ejs',tentrang:"login"})
})
app.get('/home',(req,res)=>{
    res.render("layout",data={content:'home.ejs',tentrang:"Trang quản trị"})
})
app.get('/account',(req,res)=>{
    res.render("layout",data={content:'account.ejs',tentrang:"Trang tài khoản"})
})

app.listen(port, (req,res) => console.log(`Example app listening on port ${port}!`))