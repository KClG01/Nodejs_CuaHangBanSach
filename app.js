const express = require('express')
const app = express()
const port = 3000
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../db'); // Kết nối CSDL

router.get('/', async (req, res) => {
    const posts = await db.query('SELECT * FROM posts ORDER BY created_at DESC');
    res.render('home', { posts });
});

module.exports = router;

//Hiển thị nội dung bài viết và danh sách bài viết liên quan
router.get('/:id', async (req, res) => {
    const postId = req.params.id;
    const post = await db.query('SELECT * FROM posts WHERE id = ?', [postId]);
    const relatedPosts = await db.query('SELECT * FROM posts WHERE category_id = ? AND id != ? LIMIT 5', [post.category_id, postId]);
    res.render('post', { post, relatedPosts });
});

router.post('/contact', async (req, res) => {
    const { name, email, message } = req.body;
    await db.query('INSERT INTO contacts (name, email, message) VALUES (?, ?, ?)', [name, email, message]);
    res.redirect('/contact-success');
});

//Đăng ký
router.post('/register', async (req, res) => {
    const { username, password, email } = req.body;
    const hashedPassword = bcrypt.hashSync(password, 10);
    await db.query('INSERT INTO users (username, password, email) VALUES (?, ?, ?)', [username, hashedPassword, email]);
    res.redirect('/login');
});

//đăng nhập
router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const user = await db.query('SELECT * FROM users WHERE username = ?', [username]);
    if (user && bcrypt.compareSync(password, user.password)) {
        const token = jwt.sign({ id: user.id, role: user.role }, 'secret_key');
        res.cookie('token', token);
        res.redirect('/admin');
    } else {
        res.status(401).send('Invalid credentials');
    }
});

//Thêm, sửa, xóa, reset mật khẩu.
router.post('/add', async (req, res) => {
    const { username, password, email } = req.body;
    const hashedPassword = bcrypt.hashSync(password, 10);
    await db.query('INSERT INTO users (username, password, email) VALUES (?, ?, ?)', [username, hashedPassword, email]);
    res.redirect('/admin/users');
});

//Thêm, sửa, xóa danh mục.
router.post('/add', async (req, res) => {
    const { name } = req.body;
    await db.query('INSERT INTO categories (name) VALUES (?)', [name]);
    res.redirect('/admin/categories');
});

//Thêm, sửa, xóa bài viết.
router.post('/add', async (req, res) => {
    const { title, content, category_id } = req.body;
    await db.query('INSERT INTO posts (title, content, category_id) VALUES (?, ?, ?)', [title, content, category_id]);
    res.redirect('/admin/posts');
});
app.listen(port, () => console.log(`Example app listening on port ${port}!`))