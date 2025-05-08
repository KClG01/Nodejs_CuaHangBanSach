// Phần setup module
const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2/promise');
const multer = require('multer');
const path = require('path');
const cors = require('cors');
const fs = require('fs');
const fsPromises = require('fs').promises;
const app = express();
const port = 3000;
app.set("view engine", "ejs");
app.set("views", "./views");
app.use(express.static('public'));
app.use('/newsfeed', express.static('newsfeed'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = 'public/images';
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});
const upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Chỉ chấp nhận file hình ảnh!'), false);
        }
    }
});
const db = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'da_nodejs_newsfeed'
});
// Phần xử lý routes
app.get('/', async (req, res) => {
    try {
        const [categories] = await db.query(`
            SELECT c.id AS category_id, c.name AS category_name, 
                   p.id AS post_id, p.title, p.content, p.image_url, p.created_at
            FROM categories c
            LEFT JOIN posts p ON c.id = p.category_id
            ORDER BY c.id, p.created_at DESC
        `);
        const groupedCategories = categories.reduce((acc, item) => {
            const { category_id, category_name, post_id, title, content, image_url, created_at } = item;
            if (!acc[category_id]) {
                acc[category_id] = { name: category_name, posts: [] };
            }
            if (post_id) {
                acc[category_id].posts.push({ id: post_id, title, content, image_url, created_at });
            }
            return acc;
        }, {});
        const [latestNews] = await db.query(`
            SELECT id, title, image_url
            FROM posts
            ORDER BY created_at DESC
            LIMIT 5
        `);
        const [popularPosts] = await db.query(`
            SELECT id, title, image_url
            FROM posts
            ORDER BY views DESC
            LIMIT 5
        `);
        const [website_info] = await db.query(`
            SELECT id, address, email, facebook, youtube, copyright
            FROM website_info
            ORDER BY id DESC
            LIMIT 1
        `);
        res.render("users_layout", data = {
            content: 'newsfeed.ejs',
            tentrang: "Newsfeed | Trang chủ",
            latestNews,
            popularPosts,
            categories: Object.values(groupedCategories),
            websiteInfo: website_info[0]
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Server đã bị sập');
    }
});
app.post('/post/:id/increment-views', async (req, res) => {
    try {
        const postId = req.params.id;
        await db.query("UPDATE posts SET views = views + 1 WHERE id = ?", [postId]);
        console.log(`Post ${postId} tăng views`);
        res.sendStatus(200);
    } catch (error) {
        console.error(error);
        res.status(500).send('Server đã bị sập');
    }
});
app.get('/post/:id', async (req, res) => {
    try {
        const postId = req.params.id;
        const [postResult] = await db.query(`
            SELECT p.id, p.title, p.content, p.image_url, p.created_at,p.Author, c.name AS category_name, c.id AS category_id
            FROM posts p
            JOIN categories c ON p.category_id = c.id
            WHERE p.id = ?
        `, [postId]);

        if (postResult.length == 0) {
            return res.status(404).send('Bài viết không tồn tại');
        }

        const post = postResult[0];
        const [relatedPosts] = await db.query(`
            SELECT id, title, image_url
            FROM posts
            WHERE category_id = ?
              AND id != ?
            LIMIT 5
        `, [post.category_id, postId]);
        const [latestNews] = await db.query(`
            SELECT id, title, image_url
            FROM posts
            ORDER BY created_at DESC
            LIMIT 5
        `);
        const [popularPosts] = await db.query(`
            SELECT id, title, image_url
            FROM posts
            ORDER BY views DESC
            LIMIT 5
        `);
        const [website_info] = await db.query(`
            SELECT id, address, email, facebook, youtube, copyright
            FROM website_info
            ORDER BY id DESC
            LIMIT 1
        `);
        const [comments] = await db.query(`
            SELECT id, email,content, created_at
            FROM comments
            WHERE post_id = ?
            ORDER BY created_at DESC
            LiMIT 5
        `, [postId]);
        console.log(comments)
        res.render("isPost", {
            tentrang: post.title,
            post: post,
            relatedPosts: relatedPosts,
            websiteInfo: website_info[0],
            latestNews: latestNews,
            popularPosts: popularPosts,
            commetsPosts: comments
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Server đã bị sập');
    }
});
app.get('/contact/show/:id',(req,res)=>{ 
    let mysql = require('mysql')
    let con = mysql.createConnection({
        host:"localhost",
        user:"root",
        password:"",
        database:"da_nodejs_newsfeed"  
    });
    const id = parseInt(req.params.id);
    con.connect(function(err){
        if(err) throw err
        let sql = "select * from contacts where id = ?";
        con.query(sql,id,function(err,result){
            if(err) throw err;
            res.render('layout',{tentrang:"trang hiện thị nội dung liên hệ",content:'show_contact.ejs',data:{lst:JSON.parse(JSON.stringify(result))}})
        })
    })
})
app.post('/post/:id', (req, res) => {
    let mysql = require('mysql');
    let con = mysql.createConnection({
        host: "localhost",
        user:"root",
        password:"",
        database:"da_nodejs_newsfeed"
    });
    const id = parseInt(req.params.id);
    console.log(req.body)
    con.connect(function (err) {
        if (err) throw err;
        let sql = "Insert into comments(email,content,post_id) values (?,?,?)";
        con.query(sql, [req.body.comment_Email, req.body.comment_Content, id], function (err, result) {
            if (err) throw err;
            console.log("1 record !");
            res.redirect("/post/"+id);
        });
    });
});
app.get('/contact/editstatus/:id',(req,res)=>{
    let mysql = require('mysql')
    let con = mysql.createConnection({
        host:"localhost",
        user:"root",
        password:"",
        database:"da_nodejs_newsfeed"  
    });
    const id = parseInt(req.params.id);
    con.connect(function(err){
        if(err) throw err
        let sql = "update contacts set status = 1 where id = ?";
        con.query(sql,id,function(err,result){
            if(err) throw err;
            console.log("1 recond update!");
            res.redirect("/contacts");
        })
    })
})
app.get('/404', async (req, res) => {
    try {
        const [postResult] = await db.query(`
            SELECT id, title, content, image_url, created_at
            FROM posts
            WHERE status = 1
            ORDER BY created_at DESC
            LIMIT 1
        `);
        const [latestNews] = await db.query(`
            SELECT id, title, image_url
            FROM posts
            WHERE status = 1
            ORDER BY created_at DESC
            LIMIT 5
        `);
        const [popularPosts] = await db.query(`
            SELECT id, title, image_url
            FROM posts
            WHERE status = 1
            ORDER BY views DESC
            LIMIT 5
        `);
        const [website_info] = await db.query(`
            SELECT id, address, email, facebook, youtube, copyright
            FROM website_info
            ORDER BY id DESC
            LIMIT 1
        `);   
        res.render('users_layout', {
            content: '404.ejs',
            tentrang: 'Newsfeed | NotFound',
            post: postResult[0],
            latestNews : latestNews,
            popularPosts : popularPosts,
            websiteInfo: website_info[0]
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Server đã bị sập');
    }
});
app.get('/login', (req, res) => {res.render("layout", { content: 'login.ejs', tentrang: "Trang đăng nhập" });
});
app.get('/manager', (req, res) => {res.render("layout", { content: 'manager.ejs', tentrang: "Trang quản trị" });
});
app.get('/form_add_post', (req, res) => {res.render("layout", { content: 'form_add_post.ejs', tentrang: "Trang thêm thông tin bài viết" });
});
app.get('/form_add_account', (req, res) => {res.render("layout", { content: 'form_add_account.ejs', tentrang: "Trang thêm thông tin tài khoản" });
});
app.get('/newletter', async (req, res) => {
    try {
        const [newletter] = await db.query('SELECT * FROM subscribers ORDER BY created_at DESC');
        res.render('layout', {
            content: 'newletter',
            tentrang: 'Quản lý new letter',
            data: { lst: newletter }
        });
    } catch (error) {
        console.error('Lỗi khi render trang /newletter:', error.message, error.stack);
        res.status(500).send('Lỗi server');
    }
});
app.get('/account', async (req, res) => {
    try {
        const [result] = await db.query("SELECT * FROM users");
        res.render('layout', {
            content: 'account.ejs',
            tentrang: "Quản Lý Tài khoản",
            data: { lst: result }
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Server đã bị sập');
    }
});
app.post('/form_add_account', async (req, res) => {
    try {
        await db.query("INSERT INTO users(username, email, password) VALUES (?, ?, ?)", 
            [req.body.username, req.body.email, req.body.password]);
        res.redirect("/account");
    } catch (error) {
        console.error(error);
        res.status(500).send('Server đã bị sập');
    }
});
app.get('/account/edit/:id', async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const [result] = await db.query("SELECT username, email, password FROM users WHERE id = ?", [id]);
        res.render('layout', {
            tentrang: "Cập nhật tài khoản",
            content: 'form_edit_account.ejs',
            data: { lst: result }
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Server đã bị sập');
    }
});
app.post('/account/edit/:id', async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        await db.query("UPDATE users SET username = ?, email = ?, password = ? WHERE id = ?", 
            [req.body.username, req.body.email, req.body.password, id]);
        res.redirect("/account");
    } catch (error) {
        console.error(error);
        res.status(500).send('Server đã bị sập');
    }
});
app.get('/account/del/:id', async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        await db.query("DELETE FROM users WHERE id = ?", [id]);
        res.redirect("/account");
    } catch (error) {
        console.error(error);
        res.status(500).send('Server đã bị sập');
    }
});
app.get('/categories', async (req, res) => {
    try {
        const [categories] = await db.query('SELECT id, name, created_at FROM categories ORDER BY created_at DESC');
        res.render('layout', {
            content: 'categories.ejs',
            tentrang: 'Quản lý danh mục',
            data: { lst: categories }
        });
    } catch (error) {
        console.error('Lỗi khi render trang /categories:', error.message, error.stack);
        res.status(500).send('Lỗi server');
    }
});
app.get('/posts', async (req, res) => {
    try {
        return res.render('layout', { content: 'posts.ejs', tentrang: 'Quản Lý Bài Viết' });
    } catch (error) {
        console.error('Lỗi khi render trang /posts:', error.message, error.stack);
        res.status(500).send('Lỗi server');
    }
});
app.get('/pendingposts', async (req, res) => {
    try {
        const [posts] = await db.query(`
            SELECT 
                p.id, 
                p.title, 
                COALESCE(p.author, 'Không rõ') AS author,
                p.created_at, 
                p.image_url,     
                c.name AS category_name,
                p.status
            FROM posts p
            LEFT JOIN categories c ON p.category_id = c.id
            WHERE p.status = 0
        `);
        res.render('layout', {
            content: 'pendingpost.ejs',
            tentrang: 'Trang ẩn bài viết',
            data: { lst: posts }
        });
    } catch (error) {
        console.error('Lỗi khi render trang /pendingposts:', error.message, error.stack);
        res.status(500).send('Lỗi server');
    }
});
app.get('/api/categories', async (req, res) => {
    try {
        const [categories] = await db.query('SELECT id, name FROM categories');
        res.setHeader('Content-Type', 'application/json; charset=utf-8');
        return res.json({ data: categories });
    } catch (error) {
        console.error('Lỗi khi lấy danh sách thể loại:', error.message, error.stack);
        res.status(500).json({ error: 'Lỗi cơ sở dữ liệu', details: error.message });
    }
});
app.get('/api/posts', async (req, res) => {
    try {
        const [posts] = await db.query(`
            SELECT 
                p.id, 
                p.title, 
                c.name AS category_name,
                p.content,
                COALESCE(p.author, 'Không rõ') AS author,
                p.created_at, 
                p.image_url,      
                p.status
            FROM posts p
            LEFT JOIN categories c ON p.category_id = c.id
            WHERE p.status = 1
        `);
        return res.json({ data: posts });
    } catch (error) {
        console.error('Lỗi khi lấy dữ liệu /api/posts:', error.message, error.stack);
        res.status(500).json({ error: 'Lỗi cơ sở dữ liệu', details: error.message });
    }
});
app.get('/api/pendingposts', async (req, res) => {
    try {
        const [posts] = await db.query(`
            SELECT 
                p.id, 
                p.title, 
                COALESCE(p.author, 'Không rõ') AS author,
                p.created_at, 
                p.image_url,     
                c.name AS category_name,
                p.status
            FROM posts p
            LEFT JOIN categories c ON p.category_id = c.id
            WHERE p.status = 0
        `);
        return res.json({ data: posts });
    } catch (error) {
        console.error('Lỗi khi lấy danh sách bài chờ duyệt:', error.message, error.stack);
        res.status(500).json({ error: 'Lỗi cơ sở dữ liệu', details: error.message });
    }
});
app.put('/api/pendingposts/:id/approve', async (req, res) => {
    try {
        const postId = req.params.id;
        const [result] = await db.query(`
            UPDATE posts 
            SET status = 1
            WHERE id = ? AND status = 0
        `, [postId]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Bài viết không tồn tại hoặc đã được duyệt' });
        }
        res.json({ message: 'Duyệt bài viết thành công' });
    } catch (error) {
        console.error('Lỗi khi duyệt bài viết:', error.message, error.stack);
        res.status(500).json({ error: 'Lỗi cơ sở dữ liệu', details: error.message });
    }
});
app.delete('/api/pendingposts/:id', async (req, res) => {
    try {
        const postId = req.params.id;
        const [result] = await db.query('DELETE FROM posts WHERE id = ?', [postId]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Bài viết không tồn tại' });
        }
        res.json({ message: 'Xóa bài viết thành công' });
    } catch (error) {
        console.error('Lỗi khi xóa bài viết:', error.message, error.stack);
        res.status(500).json({ error: 'Lỗi cơ sở dữ liệu', details: error.message });
    }
});
app.delete('/api/posts/:id', async (req, res) => {
    try {
        const postId = parseInt(req.params.id, 10);
        if (isNaN(postId)) {
            return res.status(400).json({ error: 'ID bài viết không hợp lệ' });
        }
        const [posts] = await db.query('SELECT image_url FROM posts WHERE id = ?', [postId]);
        if (posts.length === 0) {
            return res.status(404).json({ error: 'Bài viết không tồn tại' });
        }
        const [result] = await db.query('DELETE FROM posts WHERE id = ?', [postId]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Bài viết không tồn tại' });
        }
        const imageUrl = posts[0].image_url;
        if (imageUrl) {
            const imagePath = path.join(__dirname, 'public', imageUrl);
            try {
                await fs.access(imagePath);

                await fs.unlink(imagePath);
                console.log(`Deleted image file: ${imagePath}`);
            } catch (fileError) {
                if (fileError.code !== 'ENOENT') {
                    console.error('Lỗi khi xóa file ảnh:', fileError.message);
                }
            }
        }
        res.json({ message: 'Xóa bài viết thành công' });
    } catch (error) {
        console.error('Lỗi khi xóa bài viết:', {
            message: error.message,
            stack: error.stack,
            code: error.code
        });
        res.status(500).json({ error: 'Lỗi cơ sở dữ liệu', details: error.message });
    }
});
app.post('/api/posts', upload.single('image'), async (req, res) => {
    try {
        const { title, category_id, author, content } = req.body;
        const image_url = req.file ? `/images/${req.file.filename}` : null;
        if (!title || !content || !category_id) {
            return res.status(400).json({ error: 'Tiêu đề, nội dung và thể loại là bắt buộc' });
        }
        const validCategoryId = parseInt(category_id);
        if (isNaN(validCategoryId)) {
            return res.status(400).json({ error: 'Thể loại không hợp lệ' });
        }
        const [categoryExists] = await db.query('SELECT id FROM categories WHERE id = ?', [validCategoryId]);
        if (categoryExists.length === 0) {
            return res.status(400).json({ error: 'Thể loại không tồn tại' });
        }
        const [result] = await db.query(`
            INSERT INTO posts (title, content, author, category_id, image_url, status)
            VALUES (?, ?, ?, ?, ?, 1)
        `, [title, content, author || null, validCategoryId, image_url]);
        if (result.affectedRows === 0) {
            return res.status(500).json({ error: 'Không thể thêm bài viết' });
        }
        res.json({ message: 'Thêm bài viết thành công', postId: result.insertId });
    } catch (error) {
        console.error('Lỗi khi thêm bài viết:', error.message, error.stack);
        if (error.code === 'ER_NO_SUCH_TABLE' || error.code === 'ER_BAD_FIELD_ERROR') {
            res.status(500).json({ error: 'Lỗi cấu trúc cơ sở dữ liệu', details: 'Kiểm tra bảng posts' });
        } else if (error.code === 'ER_NO_REFERENCED_ROW_2') {
            res.status(400).json({ error: 'Thể loại không tồn tại', details: error.message });
        } else {
            res.status(500).json({ error: 'Lỗi cơ sở dữ liệu', details: error.message });
        }
    }
});
app.put('/api/posts/:id', upload.single('image'), async (req, res) => {
    try {
        const postId = req.params.id;
        const { title, category_id, content, author, status, current_image } = req.body;
        const image_url = req.file ? `/images/${req.file.filename}` : current_image || null;
        if (!title || !content || !category_id) {
            return res.status(400).json({ error: 'Tiêu đề, nội dung và thể loại là bắt buộc' });
        }
        const validCategoryId = parseInt(category_id);
        const validStatus = parseInt(status);
        if (isNaN(validCategoryId)) {
            return res.status(400).json({ error: 'Thể loại không hợp lệ' });
        }
        if (isNaN(validStatus) || (validStatus !== 0 && validStatus !== 1)) {
            return res.status(400).json({ error: 'Trạng thái không hợp lệ' });
        }
        const [categoryExists] = await db.query('SELECT id FROM categories WHERE id = ?', [validCategoryId]);
        if (categoryExists.length === 0) {
            return res.status(400).json({ error: 'Thể loại không tồn tại' });
        }
        const [existingPost] = await db.query('SELECT image_url FROM posts WHERE id = ?', [postId]);
        if (existingPost.length === 0) {
            return res.status(404).json({ error: 'Bài viết không tồn tại' });
        }
        if (req.file && existingPost[0].image_url) {
            const oldImagePath = path.join(__dirname, 'public', existingPost[0].image_url);
            if (fs.existsSync(oldImagePath)) {
                fs.unlinkSync(oldImagePath);
            }
        }
        const [result] = await db.query(
            `UPDATE posts 
             SET title = ?, category_id = ?, author = ?, content = ?, image_url = ?, status = ?
             WHERE id = ?`,
            [title, validCategoryId, author || null, content, image_url, validStatus, parseInt(postId)]
        );
        if (result.affectedRows === 0) {
            return res.status(500).json({ error: 'Không thể cập nhật bài viết' });
        }
        res.json({ message: 'Cập nhật bài viết thành công' });
    } catch (error) {
        console.error('Lỗi khi cập nhật bài viết:', {
            message: error.message,
            stack: error.stack,
            code: error.code
        });
        if (error.code === 'ER_NO_SUCH_TABLE' || error.code === 'ER_BAD_FIELD_ERROR') {
            res.status(500).json({ error: 'Lỗi cấu trúc cơ sở dữ liệu', details: 'Kiểm tra bảng posts' });
        } else if (error.code === 'ER_NO_REFERENCED_ROW_2') {
            res.status(400).json({ error: 'Thể loại không tồn tại', details: error.message });
        } else {
            res.status(500).json({ error: 'Lỗi cơ sở dữ liệu', details: error.message });
        }
    }
});
app.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const [users] = await db.query('SELECT username, password FROM users WHERE username = ?', [username]);
        if (users.length > 0 && users[0].username === username && users[0].password === password) {
            console.log('Đăng nhập thành công');
            res.redirect('/manager');
        } else {
            res.render('layout', {
                content: 'login.ejs',
                tentrang: 'Trang đăng nhập',
                error: 'Tên người dùng hoặc mật khẩu không đúng'
            });
        }
    } catch (error) {
        console.error('Lỗi khi đăng nhập:', error.message, error.stack);
        res.status(500).send('Lỗi server');
    }
});
app.get('/categories/edit/:id', async (req, res) => {
    try {
        const categoryId = parseInt(req.params.id, 10);
        if (isNaN(categoryId)) {
            return res.status(400).render('layout', {
                content: 'categories.ejs',
                tentrang: 'Quản lý danh mục',
                data: { lst: await db.query('SELECT id, name, created_at FROM categories ORDER BY created_at DESC')[0] },
                error: 'ID danh mục không hợp lệ'
            });
        }
        const [category] = await db.query('SELECT id, name FROM categories WHERE id = ?', [categoryId]);
        if (category.length === 0) {
            return res.status(404).render('layout', {
                content: 'categories.ejs',
                tentrang: 'Quản lý danh mục',
                data: { lst: await db.query('SELECT id, name, created_at FROM categories ORDER BY created_at DESC')[0] },
                error: 'Danh mục không tồn tại'
            });
        }
        res.render('layout', {
            content: 'categories.ejs',
            tentrang: 'Chỉnh sửa danh mục',
            data: { lst: await db.query('SELECT id, name, created_at FROM categories ORDER BY created_at DESC')[0] },
            category: category[0] // Truyền danh mục để điền vào modal (nếu cần)
        });
    } catch (error) {
        console.error('Lỗi khi render trang chỉnh sửa danh mục:', error.message, error.stack);
        res.status(500).render('layout', {
            content: 'categories.ejs',
            tentrang: 'Quản lý danh mục',
            data: { lst: await db.query('SELECT id, name, created_at FROM categories ORDER BY created_at DESC')[0] },
            error: 'Lỗi cơ sở dữ liệu'
        });
    }
});
app.post('/categories/edit/:id', async (req, res) => {
    try {
        const categoryId = parseInt(req.params.id, 10);
        const { name_categories } = req.body;
        if (isNaN(categoryId)) {
            return res.status(400).json({ error: 'ID danh mục không hợp lệ' });
        }
        if (!name_categories) {
            return res.status(400).json({ error: 'Tên danh mục là bắt buộc' });
        }
        const [result] = await db.query('UPDATE categories SET name = ? WHERE id = ?', [name_categories, categoryId]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Danh mục không tồn tại' });
        }
        res.json({ message: 'Cập nhật danh mục thành công' });
    } catch (error) {
        console.error('Lỗi khi cập nhật danh mục:', error.message, error.stack);
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({ error: 'Tên danh mục đã tồn tại' });
        }
        res.status(500).json({ error: 'Lỗi cơ sở dữ liệu', details: error.message });
    }
});
app.delete('/categories/:id', async (req, res) => {
    try {
        const categoryId = parseInt(req.params.id, 10);
        if (isNaN(categoryId)) {
            return res.status(400).json({ error: 'ID danh mục không hợp lệ' });
        }
        const [posts] = await db.query('SELECT id FROM posts WHERE category_id = ?', [categoryId]);
        if (posts.length > 0) {
            return res.status(400).json({ error: 'Không thể xóa danh mục vì còn bài viết liên quan' });
        }
        const [result] = await db.query('DELETE FROM categories WHERE id = ?', [categoryId]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Danh mục không tồn tại' });
        }
        res.json({ message: 'Xóa danh mục thành công' });
    } catch (error) {
        console.error('Lỗi khi xóa danh mục:', error.message, error.stack);
        res.status(500).json({ error: 'Lỗi cơ sở dữ liệu', details: error.message });
    }
});
app.post('/categories', async (req, res) => {
    try {
        const { name_categories } = req.body;
        if (!name_categories) {
            return res.status(400).json({ error: 'Tên danh mục là bắt buộc' });
        }
        const [result] = await db.query('INSERT INTO categories (name) VALUES (?)', [name_categories]);

        if (result.affectedRows === 0) {
            return res.status(500).json({ error: 'Không thể thêm danh mục' });
        }
        res.json({ message: 'Thêm danh mục thành công' });
    } catch (error) {
        console.error('Lỗi khi thêm danh mục:', error.message, error.stack);
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({ error: 'Tên danh mục đã tồn tại' });
        }
        res.status(500).json({ error: 'Lỗi cơ sở dữ liệu', details: error.message });
    }
});
app.get('/contact', async (req, res) => {
    try {
        const [postResult] = await db.query(`
            SELECT id, title, content, image_url, created_at
            FROM posts
            ORDER BY created_at DESC
            LIMIT 1
        `);
        const [latestNews] = await db.query(`
            SELECT id, title, image_url
            FROM posts
            ORDER BY created_at DESC
            LIMIT 5
        `);
        const [popularPosts] = await db.query(`
            SELECT id, title, image_url
            FROM posts
            ORDER BY id DESC
            LIMIT 5
        `);
        res.render('users_layout', {
            content: 'contact.ejs',
            tentrang: 'Newsfeed | Liên hệ',
            post: postResult[0],
            latestNews,
            popularPosts
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Server đã bị sập');
    }
});
app.get('/contacts', async (req, res) => {
    try {
        const [result] = await db.query("SELECT * FROM contacts");
        res.render('layout', data = {
            tentrang: "Quản lý liên hệ",
            content: 'contacts.ejs',
            data: { lst: result }
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Server đã bị sập');
    }
});
app.post('/contact', async (req, res) => {
    try {
        await db.query("INSERT INTO contacts(name, email, message) VALUES (?, ?, ?)", 
            [req.body.name, req.body.email, req.body.message]);
        res.redirect("/contact");
    } catch (error) {
        console.error(error);
        res.status(500).send('Server đã bị sập');
    }
});
app.post('/subscribe', async (req, res) => {
    const { email } = req.body;
    if (!email || !email.includes('@')) {
        return res.status(400).send('Email không hợp lệ');
    }
    try {
        await db.query(`
            INSERT INTO subscribers (email) VALUES (?);
        `, [email]);

        res.redirect('/');
    } catch (error) {
        console.error(error);
        res.status(500).send('Đã có lỗi xảy ra khi đăng ký');
    }
});
app.locals.formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('vi-VN', options);
};
app.get('/search', async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = 4;
        const offset = (page - 1) * limit;
        const category = req.query.category || '';
        const keyword = req.query.keyword || '';
        let query = `
            SELECT p.*, c.name as category_name 
            FROM posts p 
            JOIN categories c ON p.category_id = c.id 
            WHERE 1=1 AND p.status = 1
        `;
        let countQuery = `
            SELECT COUNT(*) as total 
            FROM posts p 
            JOIN categories c ON p.category_id = c.id 
            WHERE 1=1 AND p.status = 1
        `;
        const params = [];
        if (category) {
            query += ' AND p.category_id = ?';
            countQuery += ' AND p.category_id = ?';
            params.push(category);
        }
        if (keyword) {
            query += ' AND (p.title LIKE ? OR p.content LIKE ?)';
            countQuery += ' AND (p.title LIKE ? OR p.content LIKE ?)';
            params.push(`%${keyword}%`, `%${keyword}%`);
        }
        query += ' ORDER BY p.created_at DESC LIMIT ? OFFSET ?';
        params.push(limit, offset);
        const [posts] = await db.query(query, params);
        const [countResult] = await db.query(countQuery, params.slice(0, params.length - 2));
        const [categories] = await db.query('SELECT * FROM categories');
        const [latestNews] = await db.query(`
            SELECT id, title, image_url
            FROM posts
            ORDER BY created_at DESC
            LIMIT 5
        `);
        const [popularPosts] = await db.query(`
            SELECT id, title, image_url
            FROM posts
            ORDER BY views DESC
            LIMIT 5
        `);
        const [websiteInfo] = await db.query(`
            SELECT id, address, email, facebook, youtube, copyright
            FROM website_info
            ORDER BY id DESC
            LIMIT 1
        `);
        const totalPosts = countResult[0].total;
        const totalPages = Math.ceil(totalPosts / limit);
        res.render('users_layout', {
            content: 'search.ejs',
            tentrang: "Newsfeed | Tìm kiếm",
            posts,
            categories,
            latestNews,
            popularPosts,
            websiteInfo: websiteInfo[0],
            currentPage: page,
            totalPages,
            currentCategory: category,
            totalPosts,
            category,
            keyword
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Server đã bị sập');
    }
});
app.post('/login', async (req, res) => {
    try {
        const [result] = await db.query("SELECT username, password FROM users WHERE username = ?", [req.body.username]);
        if (result.length > 0 && result[0].username === req.body.username && result[0].password === req.body.password) {
            res.redirect("/manager");
        } else {
            res.render("layout", { content: 'login.ejs', tentrang: "Trang đăng nhập" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Server downloaded');
    }
});
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});