const express = require('express');
var bodyParser = require('body-parser');
const app = express();
const port = 3000;

app.set("view engine", "ejs");
app.set("views", "./views");
app.use(express.static('public'));
app.use('/newsfeed', express.static('newsfeed'));
app.use(bodyParser.urlencoded({ extended: true }));

const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: path.join(__dirname, 'public/images/'),
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

app.get('/', (req, res) => {
    const mysql = require('mysql');
    const con = mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: '',
        database: 'nodejs_newfeeds'
    });

    con.connect(err => {
        if (err) throw err;

        const sql = `
            SELECT c.id AS category_id, c.name AS category_name, 
                   p.id AS post_id, p.title, p.content, p.image_url, p.created_at
            FROM categories c
            LEFT JOIN posts p ON c.id = p.category_id
            ORDER BY c.id, p.created_at DESC
        `;

        con.query(sql, (err, result) => {
            if (err) throw err;

            const groupedCategories = {};
            const posts = []; // Khởi tạo biến posts

            result.forEach(item => {
                const { category_id, category_name, post_id, title, content, image_url, created_at } = item;
                if (!groupedCategories[category_id]) {
                    groupedCategories[category_id] = {
                        name: category_name,
                        posts: []
                    };
                }
                if (post_id) {
                    const post = {
                        id: post_id,
                        title,
                        content,
                        image_url,
                        created_at
                    };
                    groupedCategories[category_id].posts.push(post);
                    posts.push(post); // Thêm bài viết vào mảng posts
                }
            });

            const latestNewsSql = `
                SELECT id, title, image_url
                FROM posts
                ORDER BY created_at DESC
                LIMIT 5
            `;

            con.query(latestNewsSql, (err, latestNews) => {
                if (err) throw err;

                const popularPostsSql = `
                    SELECT id, title, content, image_url
                    FROM posts
                    ORDER BY id DESC
                    LIMIT 5
                `;

                con.query(popularPostsSql, (err, popularPosts) => {
                    if (err) throw err;

                    res.render('newsfeed', {
                        tentrang: 'Tin tức',
                        latestNews: latestNews,
                        popularPosts: popularPosts,
                        categories: Object.values(groupedCategories),
                        posts: posts // Truyền biến posts vào view
                    });

                    con.end();
                });
            });
        });
    });
});

app.get('/category{/:id}', (req, res) => {
    const categoryId = req.params.id ? parseInt(req.params.id) : null;

    const mysql = require('mysql');
    const con = mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: '',
        database: 'nodejs_newfeeds'
    });

    con.connect(err => {
        if (err) throw err;

        // Truy vấn để lấy bài viết theo category_id nếu có
        let sql = `
            SELECT p.id, p.title, p.content, p.image_url, p.created_at
            FROM posts p
        `;
        const queryParams = [];
        if (categoryId) {
            sql += ` WHERE p.category_id = ?`;
            queryParams.push(categoryId);
        }
        sql += ` ORDER BY p.created_at DESC`;

        con.query(sql, queryParams, (err, posts) => {
            if (err) throw err;

            // Truy vấn danh sách thể loại
            const categoriesSql = "SELECT * FROM categories";
            con.query(categoriesSql, (err, categories) => {
                if (err) throw err;

                // Truy vấn bài viết phổ biến
                const popularPostsSql = `
                    SELECT id, title, image_url
                    FROM posts
                    ORDER BY id DESC
                    LIMIT 5
                `;

                con.query(popularPostsSql, (err, popularPosts) => {
                    if (err) throw err;

                    // Truy vấn tin tức mới
                    const latestNewsSql = `
                        SELECT id, title, image_url
                        FROM posts
                        ORDER BY created_at DESC
                        LIMIT 5
                    `;

                    con.query(latestNewsSql, (err, latestNews) => {
                        if (err) throw err;

                        res.render('newsfeed', {
                            tentrang: categoryId ? 'Bài viết theo thể loại' : 'Tin tức',
                            posts: posts,
                            categories: categories,
                            latestNews: latestNews,
                            popularPosts: popularPosts // Truyền popularPosts vào view
                        });

                        con.end();
                    });
                });
            });
        });
    });
});

app.get('/post/:id', (req, res) => {
    const mysql = require('mysql');
    const con = mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: '',
        database: 'nodejs_newfeeds'
    });

    const postId = req.params.id;

    con.connect(err => {
        if (err) throw err;

        const postSql = `
            SELECT p.id, p.title, p.content, p.image_url, p.created_at, 
                   c.name AS category_name, c.id AS category_id
            FROM posts p
            JOIN categories c ON p.category_id = c.id
            WHERE p.id = ?
        `;

        con.query(postSql, [postId], (err, postResult) => {
            if (err) throw err;

            const post = postResult[0];

            const relatedSql = `
                SELECT id, title, image_url
                FROM posts
                WHERE category_id = ?
                  AND id != ?
                LIMIT 5
            `;

            con.query(relatedSql, [post.category_id, postId], (err, relatedPosts) => {
                if (err) throw err;

                const latestSql = `
                    SELECT id, title, image_url
                    FROM posts
                    ORDER BY created_at DESC
                    LIMIT 5
                `;

                con.query(latestSql, (err, latestNews) => {
                    if (err) throw err;

                    const popularSql = `
                        SELECT id, title, image_url
                        FROM posts
                        ORDER BY id DESC
                        LIMIT 5
                    `;

                    con.query(popularSql, (err, popularPosts) => {
                        if (err) throw err;

                        res.render('isPost', {
                            tentrang: post.title,
                            post: post,
                            relatedPosts: relatedPosts,
                            latestNews: latestNews,
                            popularPosts: popularPosts
                        });

                        con.end();
                    });
                });
            });
        });
    });
});


app.get('/404', (req, res) => {
    const mysql = require('mysql');
    const con = mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: '',
        database: 'nodejs_newfeeds'
    });

    con.connect(err => {
        if (err) throw err;

        const postSql = `
            SELECT id, title, content, image_url, created_at
            FROM posts
            ORDER BY created_at DESC
            LIMIT 1
        `;

        con.query(postSql, (err, postResult) => {
            if (err) throw err;

            const post = postResult[0];

            const latestSql = `
                SELECT id, title, image_url
                FROM posts
                ORDER BY created_at DESC
                LIMIT 5
            `;

            con.query(latestSql, (err, latestNews) => {
                if (err) throw err;

                const popularSql = `
                    SELECT id, title, image_url
                    FROM posts
                    ORDER BY id DESC
                    LIMIT 5
                `;

                con.query(popularSql, (err, popularPosts) => {
                    if (err) throw err;

                    res.status(404).render('404', {
                        post: post,
                        latestNews: latestNews,
                        popularPosts: popularPosts
                    });

                    con.end();
                });
            });
        });
    });
});


app.get('/login',(req,res)=>{
    res.render("layout",data ={content:'login.ejs',tentrang:"Trang đăng nhập"})
})
app.get('/manager',(req,res)=>{
    res.render("layout",data={content:'manager.ejs',tentrang:"Trang quản trị"})
})
app.get('/constacts',(req,res)=>{
    res.render("layout",data={content:'constacts.ejs',tentrang:"Trang liên hệ"})
})
app.get('/form_add_post',(req,res)=>{
    res.render("layout",data={content:'form_add_post.ejs',tentrang:"Trang thêm thông tin bài viết"})
})
app.get('/form_add_account',(req,res)=>{
    res.render("layout",data={content:'form_add_account.ejs',tentrang:"Trang thêm thông tin tài khoản"})
})

app.get('/account', (req, res) => {
    let mysql = require('mysql');
    let con = mysql.createConnection({
        host:"localhost",
        user:"root",
        password:"",
        database:"nodejs_newfeeds"
    })
    con.connect(function(err){
        if(err) throw err
        let sql = "select * from users";
        con.query(sql,function(err,result,fields){
            if(err) throw err;
            res.render('layout',{content:'account.ejs',tentrang: "Quản Lý Tài khoản",data:{fields:JSON.parse(JSON.stringify(fields)),lst:JSON.parse(JSON.stringify(result))}})
            con.end();
        })
    })
})
app.get('/categories', (req, res) => {
    let mysql = require('mysql');
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
            res.render('layout',{content:'categories.ejs',tentrang: "Quản Lý Danh Mục",data:{fidels:JSON.parse(JSON.stringify(fidels)),lst:JSON.parse(JSON.stringify(result))}})
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
            res.render('layout',{content:'posts.ejs',tentrang: "Quản Lý Bài Viết",data:{fidels:JSON.parse(JSON.stringify(fidels)),lst:JSON.parse(JSON.stringify(result))}})
            con.end();
        })
    })
})
app.get('/posts/del/:id',(req,res)=>{
    let mysql = require('mysql')
    let con = mysql.createConnection({
        host:"localhost",
        user:"root",
        password:"",
        database:"nodejs_newfeeds"
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
app.post('/categories',(req,res)=>{
    let mysql = require('mysql')
    let con = mysql.createConnection({
        host:"localhost",
        user:"root",
        password:"",
        database:"nodejs_newfeeds"
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
app.post('/form_add_post', upload.single('image'), (req, res) => {
    console.log(req.file);
    console.log(req.body);

    let mysql = require('mysql');
    let con = mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "",
        database: "nodejs_newfeeds"
    });

    const filePath = req.file ? `/images/${req.file.filename}` : req.body.oldImageUrl;

    con.connect(function (err) {
        if (err) throw err;
        let sql = "INSERT INTO posts(title, content, category_id, image_url) VALUES (?, ?, ?, ?)";
        con.query(sql, [req.body.tieude, req.body.content, req.body.category, filePath], function (err, result) {
            if (err) throw err;
            console.log("1 record inserted!");
            res.redirect("/posts");
        });
    });
});

app.get('/posts/edit/:id',(req,res)=>{
    let mysql = require('mysql')
    let con = mysql.createConnection({
        host:"localhost",
        user:"root",
        password:"",
        database:"nodejs_newfeeds"
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

app.post('/posts/edit/:id', upload.single('image'), (req, res) => {
    console.log(req.body);
    console.log(req.file);

    let mysql = require('mysql');
    let con = mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "",
        database: "nodejs_newfeeds"
    });

    const filePath = req.file ? `/images/${req.file.filename}` : req.body.oldImageUrl;

    con.connect(function (err) {
        if (err) throw err;
        let sql = "UPDATE posts SET title = ?, content = ?, category_id = ?, image_url = ? WHERE id = ?";
        con.query(sql, [req.body.tieude, req.body.content, req.body.category, filePath, req.params.id], function (err, result) {
            if (err) throw err;
            console.log("1 record updated!");
            res.redirect("/posts");
        });
    });
});

app.get('/categories/del/:id',(req,res)=>{
    let mysql = require('mysql')
    let con = mysql.createConnection({
        host:"localhost",
        user:"root",
        password:"",
        database:"nodejs_newfeeds"
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
        database:"nodejs_newfeeds"
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
        database:"nodejs_newfeeds"
    });
    const id = parseInt(req.params.id);
    con.connect(function(err){
        if(err) throw err
        let sql = "update categories set name = ? where id = ?";
        con.query(sql,[req.body.tieude,id],function(err,result){
            if(err) throw err;
            console.log("1 recond update!");
            res.redirect("/categories")
           con.end(); 
        });
    })
})
app.post('/form_add_account',(req,res)=>{
    let mysql = require('mysql')
    let con = mysql.createConnection({
        host:"localhost",
        user:"root",
        password:"",
        database:"nodejs_newfeeds"
    })
    console.log(req.body)
    con.connect(function(err) {
        if (err) throw err;
        let sql = "Insert into users(username,email,password) values (?,?,?)";
        con.query(sql, [req.body.username,req.body.email,req.body.password], function(err, result) {
            if(err) throw err;
            console.log("1 recond inserted!");
            res.redirect("/account")
        });
    });
})

app.get('/account/edit/:id',(req,res)=>{
    let mysql = require('mysql')
    let con = mysql.createConnection({
        host:"localhost",
        user:"root",
        password:"",
        database:"nodejs_newfeeds"
    });
    const id = parseInt(req.params.id);
    con.connect(function(err){
        if(err) throw err
        let sql = "select username, email, password from users where id = ?";
        con.query(sql,id,function(err,result){
            if(err) throw err;
            res.render('layout',{tentrang:"Cập nhật tài khoản",content:'form_edit_account.ejs',data:{lst:JSON.parse(JSON.stringify(result))}})
        })
    })
})
app.post('/account/edit/:id', (req, res) => {
    let mysql = require('mysql');
    let con = mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "",
        database: "nodejs_newfeeds"
    });
    const id = parseInt(req.params.id);
    con.connect(function (err) {
        if (err) throw err;
        let sql = "UPDATE users SET username = ?, email = ?, password = ? WHERE id = ?";
        con.query(sql, [req.body.username, req.body.email, req.body.password, id], function (err, result) {
            if (err) throw err;
            console.log("1 record updated!");
            res.redirect("/account");
        });
    });
});

app.get('/account/del/:id', (req, res) => {
    let mysql = require('mysql');
    let con = mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "",
        database: "nodejs_newfeeds"
    });
    const id = parseInt(req.params.id);
    con.connect(function (err) {
        if (err) throw err;
        let sql = "DELETE FROM users WHERE id = ?";
        con.query(sql, id, function (err, result) {
            if (err) throw err;
            console.log("1 record deleted!");
            res.redirect("/account");
        });
    });
});
    
app.get('/contact', (req, res) => {
    const mysql = require('mysql');
    const con = mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: '',
        database: 'nodejs_newfeeds'
    });

    con.connect(err => {
        if (err) throw err;

        const postSql = `
            SELECT id, title, content, image_url, created_at
            FROM posts
            ORDER BY created_at DESC
            LIMIT 1
        `;

        con.query(postSql, (err, postResult) => {
            if (err) throw err;

            const post = postResult[0];

            const latestSql = `
                SELECT id, title, image_url
                FROM posts
                ORDER BY created_at DESC
                LIMIT 5
            `;

            con.query(latestSql, (err, latestNews) => {
                if (err) throw err;

                const popularSql = `
                    SELECT id, title, image_url
                    FROM posts
                    ORDER BY id DESC
                    LIMIT 5
                `;

                con.query(popularSql, (err, popularPosts) => {
                    if (err) throw err;

                    res.render('contact', {
                        post: post,
                        latestNews: latestNews,
                        popularPosts: popularPosts
                    });
                    con.end();
                });
            });
        });
    });
});


app.get('/contacts',(req,res)=>{
    let mysql = require('mysql')
    let con = mysql.createConnection({
        host:"localhost",
        user:"root",
        password:"",
        database:"nodejs_newfeeds"
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

app.post('/contact', (req, res) => {
    let mysql = require('mysql')
    let con = mysql.createConnection({
        host:"localhost",
        user:"root",
        password:"",
        database:"nodejs_newfeeds"
    })
    console.log(req.body)
    con.connect(function(err) {
        if (err) throw err;
        let sql = "Insert into contacts(name,email,message) values (?,?,?)";
        con.query(sql, [req.body.name,req.body.email,req.body.message], function(err, result) {
            if(err) throw err;
            console.log("1 recond inserted!");
            res.redirect("/contact")
        });
    });
})


app.listen(port, (req,res) => console.log(`Example app listening on port ${port}!`))