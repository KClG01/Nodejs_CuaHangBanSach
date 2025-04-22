const express = require('express')
var bodyParser = require('body-parser')
const app = express()
const port =3000
app.set("view engine","ejs");
app.set("views","./views");
app.use(express.static('public'))
app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.static('newsfeed'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.get(['/','/home'],function(req,res){
  res.sendFile(__dirname+"/newsfeed/"+"index.html");
})
var se
app.get('/login',(req,res)=>{
    res.render("layout",data ={content:'login.ejs',tentrang:"Trang đăng nhập"})
})
app.get('/manager',(req,res)=>{
    res.render("layout",data={content:'home.ejs',tentrang:"Trang quản trị"})
})
app.get('/account',(req,res)=>{
    res.render("layout",data={content:'account.ejs',tentrang:"Trang tài khoản"})
})
app.get('/constacts',(req,res)=>{
    res.render("layout",data={content:'constacts.ejs',tentrang:"Trang liên hệ"})
})
app.get('/form_add_post',(req,res)=>{
    res.render("layout",data={content:'form_add_post.ejs',tentrang:"Trang thêm thông tin"})
})

app.get('/categories', (req, res) => {
    let mysql = require('mysql');
    let con = mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "",
        database: "node_da"
    });
        var sql = "SELECT * FROM categories";
        con.query(sql, function(err, result,fidels) {
            if (err) throw err;
            res.render('layout',{tentrang:"Trang Danh Mục",content:'categories.ejs',data:{fidels:JSON.parse(JSON.stringify(fidels)),lst:JSON.parse(JSON.stringify(result))}})
   });
});

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
                res.render('layout',{tentrang:"Trang tin tức",content:'posts.ejs',data:{fidels:JSON.parse(JSON.stringify(fidels)),lst:JSON.parse(JSON.stringify(result))}})
            })
        })
})
app.get('/posts/del/:id',(req,res)=>{
    let mysql = require('mysql')
    let con = mysql.createConnection({
        host:"localhost",
        user:"root",
        password:"",
        database:"node_da"
    });
    const id = parseInt(req.params.id);
        let sql = "Delete From posts where id = ?";
        con.query(sql, id, function(err, result) {
            if(err) throw err;
            console.log("1 Remove");
            res.redirect("/posts")
        });
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
                res.redirect("/manager")
            }else{
                return  res.render("layout",data ={content:'login.ejs',tentrang:"Trang đăng nhập"});
            }
        });
    });
})
app.post('/pages/contact.html', (req, res) => {
    let mysql = require('mysql');
    let con = mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "",
        database: "node_da"
    });
        let sql = "INSERT INTO contacts (name, email, message) VALUES (?, ?, ?)";
        con.query(sql, [req.body.name, req.body.email, req.body.message], function(err, result) {
            if (err) throw err;
            console.log("1 record inserted!");
            res.sendFile(__dirname+"/newsfeed/pages/"+"contact.html");
        });
});
app.post('/categories',(req,res)=>{
    let mysql = require('mysql')
    let con = mysql.createConnection({
        host:"localhost",
        user:"root",
        password:"",
        database:"node_da"
    })
    con.connect(function(err) {
        if (err) throw err;
        let sql = "Insert into categories(name) values (?)";
        con.query(sql, req.body.name_categories, function(err, result) {
            if(err) throw err;
            console.log("1 recond inserted!");
            res.redirect("/categories")
        });
    });
})
app.post('/form_add_post',(req,res)=>{
    let mysql = require('mysql')
    let con = mysql.createConnection({
        host:"localhost",
        user:"root",
        password:"",
        database:"node_da"
    })
    console.log(req.body)
    con.connect(function(err) {
        if (err) throw err;
        let sql = "Insert into posts(id,title,content,category_id) values (?,?,?,?)";
        con.query(sql, [req.body.ma,req.body.tieude,req.body.content,req.body.category], function(err, result) {
            if(err) throw err;
            console.log("1 recond inserted!");
            res.redirect("/posts")
        });
    });
})
app.get('/posts/edit/:id',(req,res)=>{
    let mysql = require('mysql')
    let con = mysql.createConnection({
        host:"localhost",
        user:"root",
        password:"",
        database:"node_da"
    });
    const id = parseInt(req.params.id);
    con.connect(function(err){
        if(err) throw err
        let sql = "select id,title,content,category_id from posts where id = ?";
        con.query(sql,id,function(err,result){
            if(err) throw err;
            res.render('layout',{tentrang:"trang edit tin tức",content:'form_edit_post.ejs',data:{lst:JSON.parse(JSON.stringify(result))}})
        })
    })
})
app.post('/posts/edit/:id',(req,res)=>{
    let mysql = require('mysql')
    let con = mysql.createConnection({
        host:"localhost",
        user:"root",
        password:"",
        database:"node_da"
    });
    const id = parseInt(req.params.id);
    con.connect(function(err){
        if(err) throw err
        let sql = "update posts set title = ?, content = ?, category_id = ? where id = ?";
        con.query(sql,[req.body.tieude,req.body.content,req.body.category,req.body.ma],function(err,result){
            if(err) throw err;
            console.log("1 recond update!");
            res.redirect("/posts")
        });
    })
})
app.get('/categories/del/:id',(req,res)=>{
    let mysql = require('mysql')
    let con = mysql.createConnection({
        host:"localhost",
        user:"root",
        password:"",
        database:"node_da"
    });
    const id = parseInt(req.params.id);
    con.connect(function(err){
        if(err) throw err
        let sql = "update posts set category_id = null where category_id = ?";
        con.query(sql,id,function(err,result){
            if(err) throw err;
            console.log("1 recond update!");
        });
    })
        sql = "Delete From categories where id = ?";
        con.query(sql, id, function(err, result) {
            if(err) throw err;
            console.log("1 Remove");
            res.redirect("/categories")
        });
})
app.get('/categories/edit/:id',(req,res)=>{
    let mysql = require('mysql')
    let con = mysql.createConnection({
        host:"localhost",
        user:"root",
        password:"",
        database:"node_da"
    });
    const id = parseInt(req.params.id);
    con.connect(function(err){
        if(err) throw err
        let sql = "select id,name from categories where id = ?";
        con.query(sql,id,function(err,result){
            if(err) throw err;
            res.render('layout',{tentrang:"trang edit danh muc",content:'form_edit_categories.ejs',data:{lst:JSON.parse(JSON.stringify(result))}})
        })
    })
})
app.post('/categories/edit/:id',(req,res)=>{
    let mysql = require('mysql')
    let con = mysql.createConnection({
        host:"localhost",
        user:"root",
        password:"",
        database:"node_da"
    });
    const id = parseInt(req.params.id);
    con.connect(function(err){
        if(err) throw err
        let sql = "update categories set name = ? where id = ?";
        con.query(sql,[req.body.tieude,id],function(err,result){
            if(err) throw err;
            console.log("1 recond update!");
            res.redirect("/categories")
        });
    })
})
app.listen(port, (req,res) => console.log(`Example app listening on port ${port}!`))