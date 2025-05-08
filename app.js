const express = require('express');
var bodyParser = require('body-parser');
const app = express();
const port = 3000;
const cors = require('cors');
app.set('view engine', 'ejs');
app.set('views', './views');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
const mysql = require('mysql2/promise');
const multer = require('multer');
const path = require('path');
const fs = require('fs'); // Import fs đầy đủ cho các hàm đồng bộ
const fsPromises = require('fs').promises; // Import fs.promises cho các hàm bất đồng bộ

const db = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'da_nodejs_newfeeds',
});

app.use(cors());
app.use('/newsfeed', express.static('newsfeed'));
app.use(express.static('public'));

app.get('/login', (req, res) => {
    res.render('layout', { content: 'login.ejs', tentrang: 'Trang đăng nhập' });
});
app.get('/categories', async (req, res) => {
    try {
        const [categories] = await db.query('SELECT id, name, created_at FROM categories ORDER BY created_at DESC');
        res.render('layout', {
            content: 'categories.ejs',
            tentrang: 'Quản lý danh mục',
            data: { lst: categories } // Pass categories data to the template
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
            data: { lst: posts } // Pass posts data to the template
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
                await fs.access(imagePath); // Kiểm tra file tồn tại

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

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = 'public/images';
        if (!fs.existsSync(uploadDir)) { // Sử dụng fs.existsSync
            fs.mkdirSync(uploadDir, { recursive: true }); // Sử dụng fs.mkdirSync
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
            VALUES (?, ?, ?, ?, ?, 0)
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

        // Kiểm tra xem danh mục có bài viết liên quan không
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
app.listen(port, () => console.log(`Example app listening on port ${port}!`));