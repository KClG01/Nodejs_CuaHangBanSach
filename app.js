const express = require('express')
var bodyParser = require('body-parser')
const app = express()
const port =3000
app.set("view engine","ejs");
app.set("views","./views");
app.use(express.static('public'))
app.use(bodyParser.urlencoded({ extended: true }))
app.get(['/','/login'],(req,res)=>{
    res.render("layout",data ={content:'login.ejs',tentrang:"Trang đăng nhập"})
})
app.get('/home',(req,res)=>{
    res.render("layout",data={content:'home.ejs',tentrang:"Trang quản trị"})
})
app.get('/account',(req,res)=>{
    res.render("layout",data={content:'account.ejs',tentrang:"Trang tài khoản"})
})
app.get('/categories',(req,res)=>{
    res.render("layout",data={content:'categories.ejs',tentrang:"Trang danh mục"})
})
app.get('/constacts',(req,res)=>{
    res.render("layout",data={content:'constacts.ejs',tentrang:"Trang liên hệ"})
})
app.get('/formadd',(req,res)=>{
    res.render("layout",data={content:'formadd.ejs',tentrang:"Trang tài khoản"})
})
app.get('/categories',(req,res)=>{
    let mysql = require('mysql')
    let con = mysql.createConnection({
        host:"localhost",
        user:"root",
        password:"",
        database:"node_da"
    })
    con.connect(function(err){
        if(err) throw err
        let sql = "select * from categories";
        con.query(sql,function(err,result,fidels){
            if(err) throw err;
            res.render('layout',{content:'categories.ejs',data:{fidels:JSON.parse(JSON.stringify(fidels)),lst:JSON.parse(JSON.stringify(result))}})
        })
    })
})
app.get('/posts',(req,res)=>{
    let mysql = require('mysql')
    let con = mysql.createConnection({
        host:"localhost",
        user:"root",
        password:"",
        database:"node_da"
    })
    con.connect(function(err){
        if(err) throw err
        let sql = "select * from posts";
        con.query(sql,function(err,result,fidels){
            if(err) throw err;
            res.render('layout',{content:'posts.ejs',data:{fidels:JSON.parse(JSON.stringify(fidels)),lst:JSON.parse(JSON.stringify(result))}})
        })
    })
})

app.post('/login',(req,res)=>{
    let mysql = require('mysql')
    let con = mysql.createConnection({
        host:"localhost",
        user:"root",
        password:"",
        database:"node_da"
    })
    con.connect(function(err) {
        if (err) throw err;
        let sql = "SELECT username, password FROM users WHERE username = ?";
        con.query(sql, req.body.username, function(err, result) {
            if (result.length > 0 && result[0].username === req.body.username && result[0].password === req.body.password) {
                console.log("Kiểm tra thành công");
                res.redirect("/home")
            }else{
                return  res.render("layout",data ={content:'login.ejs',tentrang:"Trang đăng nhập"});
            }
        });
    });
})

app.listen(port, (req,res) => console.log(`Example app listening on port ${port}!`))