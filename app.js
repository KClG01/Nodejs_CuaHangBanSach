const express = require('express')
var bodyParser = require('body-parser')
const app = express()
const port =3000
app.set("view engine","ejs");
app.set("views","./views");
app.use(express.static('public'))
app.use(bodyParser.urlencoded({ extended: true }));
const mysql = require('mysql2/promise');

const db = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'nodejs_newfeeds'
});

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
        res.render("layout", {
            content: 'newsfeed',
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

        if (postResult.length === 0) {
            return res.status(404).send('Bài viết không tồn tại');
        }

        const post = postResult[0];

        // Lấy các bài viết liên quan (cùng danh mục, ngoại trừ bài viết hiện tại)
        const [relatedPosts] = await db.query(`
            SELECT id, title, image_url
            FROM posts
            WHERE category_id = ?
              AND id != ?
            LIMIT 5
        `, [post.category_id, postId]);

        // Render giao diện
        res.render("layout", {
            content: 'isPost',
            tentrang: post.title,
            post: post,
            relatedPosts: relatedPosts // Truyền danh sách bài viết liên quan
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Server đã bị sập');
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
        database:"nodejs_newfeeds"
    })
    con.connect(function(err){
        if(err) throw err
        let sql = "select * from categories";
        con.query(sql,function(err,result,fidels){
            if(err) throw err;
            res.render('layout',{content:'categories.ejs',data:{fidels:JSON.parse(JSON.stringify(fidels)),lst:JSON.parse(JSON.stringify(result))}})
            con.end();
        })
    })
})
app.get('/posts',(req,res)=>{
    let mysql = require('mysql')
    let con = mysql.createConnection({
        host:"localhost",
        user:"root",
        password:"",
        database:"nodejs_newfeeds"
    })
    con.connect(function(err){
        if(err) throw err
        let sql = "select * from posts";
        con.query(sql,function(err,result,fidels){
            if(err) throw err;
            res.render('layout',{content:'posts.ejs',data:{fidels:JSON.parse(JSON.stringify(fidels)),lst:JSON.parse(JSON.stringify(result))}})
            con.end();
        })
    })
})

app.post('/login',(req,res)=>{
    let mysql = require('mysql')
    let con = mysql.createConnection({
        host:"localhost",
        user:"root",
        password:"",
        database:"nodejs_newfeeds"
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

app.listen(port, (req,res) => console.log(`Example app listening on port ${port}!`))