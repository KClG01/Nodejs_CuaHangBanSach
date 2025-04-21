const express = require('express')
var bodyParser = require('body-parser')
const app = express()
const port =3000
app.set("view engine","ejs");
app.set("views","./views");
app.use(express.static('public'))
<<<<<<< HEAD




const db = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'nodejs_newfeeds'
});

app.get('/', async (req, res) => {
    try {
        // Lấy danh sách danh mục và bài viết
        const [categories] = await db.query(`
            SELECT c.id AS category_id, c.name AS category_name, 
                   p.id AS post_id, p.title, p.content, p.created_at
            FROM categories c
            LEFT JOIN posts p ON c.id = p.category_id
            ORDER BY c.id, p.created_at DESC
        `);

        // Nhóm bài viết theo danh mục
        const groupedCategories = categories.reduce((acc, item) => {
            const { category_id, category_name, post_id, title, content, created_at } = item;
            if (!acc[category_id]) {
                acc[category_id] = { name: category_name, posts: [] };
            }
            if (post_id) { // Chỉ thêm bài viết nếu có ID
                acc[category_id].posts.push({ id: post_id, title, content, created_at });
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
        console.log(postId);
        const [post] = await db.query(`
            SELECT p.id, p.title, p.content, p.created_at, c.name AS category_name
            FROM posts p
            JOIN categories c ON p.category_id = c.id
            WHERE p.id = ?
        `, [postId]);

        if (post.length == 0) {
            return res.status(404).send('Bài viết không tồn tại');
        }

        res.render("layout", {
            content: 'posts',
            tentrang: post[0].title,
            post: post[0]
        });
    } catch (error) {
        console.error(error);
        res.status(404).send('Server đã bị sập');
    }
});

app.get('/login',(req,res)=>{
    res.render("layout",data ={content:'login.ejs',tentrang:"login"})
=======
app.use(bodyParser.urlencoded({ extended: true }))
app.get(['/','/login'],(req,res)=>{
    res.render("layout",data ={content:'login.ejs',tentrang:"Trang đăng nhập"})
>>>>>>> 68aa3f22e0628c7e01912b8d81ac0b9363645058
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