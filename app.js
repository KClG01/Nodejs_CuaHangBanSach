const express = require('express')
var bodyParser = require('body-parser')
const app = express()
const port =3000
const multer = require('multer');
const path = require('path');

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

app.use(bodyParser.urlencoded({ extended: true }));
const mysql = require('mysql2/promise');

const db = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'node_da'
});
const storage = multer.diskStorage({
    destination: 'public/images/', // Đường dẫn lưu tệp
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // Đổi tên file cho duy nhất
    }
});
const upload = multer({ storage });
app.use('/newsfeed', express.static('newsfeed'));
app.use(express.static('public'));

app.get('/', async (req, res) => {
    try {
        // Lấy danh sách danh mục và bài viết
        const [categories] = await db.query(`
            SELECT c.id AS category_id, c.name AS category_name, 
                   p.id AS post_id, p.title, p.content, p.image_url, p.created_at
            FROM categories c
            LEFT JOIN posts p ON c.id = p.category_id
            ORDER BY c.id, p.created_at DESC
        `);

        // Nhóm bài viết theo danh mục
        const groupedCategories = categories.reduce((acc, item) => {
            const { category_id, category_name, post_id, title, content, image_url, created_at } = item;
            if (!acc[category_id]) {
                acc[category_id] = { name: category_name, posts: [] };
            }
            if (post_id) { // Chỉ thêm bài viết nếu có ID
                acc[category_id].posts.push({ id: post_id, title, content, image_url, created_at });
            }
            return acc;
        }, {});

        // Render giao diện và truyền dữ liệu
        res.render("newsfeed", {
            tentrang: "Tin tức",
            categories: Object.values(groupedCategories)
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Server đã bị sập');
    }
});
app.get('/post/:id', async (req, res) => {
    try {
        const postId = req.params.id;

        // Lấy bài viết hiện tại
        const [postResult] = await db.query(`
            SELECT p.id, p.title, p.content, p.image_url, p.created_at, c.name AS category_name, c.id AS category_id
            FROM posts p
            JOIN categories c ON p.category_id = c.id
            WHERE p.id = ?
        `, [postId]);

        if (postResult.length == 0) {
            return res.status(404).send('Bài viết không tồn tại');
        }

        const post = postResult[0];

        // Lấy các bài viết liên quan
        const [relatedPosts] = await db.query(`
            SELECT id, title, image_url
            FROM posts
            WHERE category_id = ?
              AND id != ?
            LIMIT 5
        `, [post.category_id, postId]);

        // Lấy danh sách các bài viết mới nhất
        const [latestNews] = await db.query(`
            SELECT id, title, image_url
            FROM posts
            ORDER BY created_at DESC
            LIMIT 5
        `);

        // Lấy danh sách các bài viết phổ biến
        const [popularPosts] = await db.query(`
            SELECT id, title, image_url
            FROM posts
            ORDER BY id DESC
            LIMIT 5
        `);

        // Render giao diện
        res.render("isPost", {
            tentrang: post.title,
            post: post,
            relatedPosts: relatedPosts,
            latestNews: latestNews, // Truyền biến latestNews vào file isPost.ejs
            popularPosts: popularPosts // Truyền biến popularPosts vào file isPost.ejs
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Server đã bị sập');
    }
});
app.get('/404', async (req, res) => {
    try {
        // Lấy một bài viết cụ thể (ví dụ: bài viết đầu tiên trong cơ sở dữ liệu)
        const [postResult] = await db.query(`
            SELECT id, title, content, image_url, created_at
            FROM posts
            ORDER BY created_at DESC
            LIMIT 1
        `);

        if (postResult.length == 0) {
            return res.status(404).send('Không có bài viết nào để hiển thị.');
        }

        const post = postResult[0]; // Lấy bài viết đầu tiên

        const [latestNews] = await db.query(`
            SELECT id, title, image_url
            FROM posts
            ORDER BY created_at DESC
            LIMIT 5
        `);
        // Lấy danh sách các bài viết phổ biến
        const [popularPosts] = await db.query(`
            SELECT id, title, image_url
            FROM posts
            ORDER BY id DESC
            LIMIT 5
        `);

        // Render giao diện 404
        res.status(404).render('404', {
            post: post, // Truyền bài viết vào file 404.ejs
            latestNews: latestNews, // Truyền biến latestNews vào file 404.ejs
            popularPosts: popularPosts
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});
app.get('/login',(req,res)=>{
    res.render("layout",data ={content:'login.ejs',tentrang:"Trang đăng nhập"})
})
app.get('/manager',(req,res)=>{
    res.render("layout",data={content:'manager.ejs',tentrang:"Trang quản trị"})
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
    console.log("Trang categories")
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
    console.log("Trang posts")
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
app.post('/posts/edit/:id',upload.single('image'),(req,res)=>{
    console.log(req.body)
    console.log(req.file)   
    let mysql = require('mysql')
    let con = mysql.createConnection({
        host:"localhost",
        user:"root",
        password:"",
        database:"node_da"
    });
    const filePath = req.file ? `/images/${req.file.filename}` : req.body.oldImageUrl;
    con.connect(function(err){
        if(err) throw err
        let sql = "update posts set title = ?, content = ?, category_id = ?,image_url=? where id = ?";
        con.query(sql,[req.body.tieude,req.body.content,req.body.category,filePath,req.body.ma],function(err,result){
            if(err) throw err;
            console.log("1 recond update!");
            res.redirect("/posts")
        });
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
app.post('/form_add_post',upload.single('image'),(req,res)=>{
    let mysql = require('mysql')
    let con = mysql.createConnection({
        host:"localhost",
        user:"root",
        password:"",
        database:"node_da"
    })
    console.log(req.body)
    const filePath = req.file ? `/images/${req.file.filename}` : req.body.oldImageUrl;
    con.connect(function(err) {
        if (err) throw err;
        let sql = "Insert into posts(id,title,content,category_id,image_url) values (?,?,?,?,?)";
        con.query(sql, [req.body.ma,req.body.tieude,req.body.content,req.body.category,filePath], function(err, result) {
            if(err) throw err;
            console.log("1 recond inserted!");
            res.redirect("/posts")
        });
    });
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
app.get('/contacts',(req,res)=>{
    console.log("Trang contacts")
    let mysql = require('mysql')
    let con = mysql.createConnection({
        host:"localhost",
        user:"root",
        password:"",
        database:"node_da"
    })
        con.connect(function(err){
            if(err) throw err
            let sql = "select * from contacts";
            con.query(sql,function(err,result,fidels){
                if(err) throw err;
                res.render('layout',{tentrang:"Trang liên hệ",content:'contacts.ejs',data:{fidels:JSON.parse(JSON.stringify(fidels)),lst:JSON.parse(JSON.stringify(result))}})
            })
        })
})
app.listen(port, (req,res) => console.log(`Example app listening on port ${port}!`))