import express from 'express';
import cors from 'cors';
import Database from 'better-sqlite3';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

const allowedOrigins = ['https://expense-tracker-ruddy-psi.vercel.app'];

app.use(cors({
  origin: function(origin, callback) {
    // allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true,
}));

app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Initialize SQLite database
const db = new Database('expense_tracker.db');

// Create tables
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    profile_picture TEXT,
    theme TEXT DEFAULT 'light',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS categories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    name TEXT NOT NULL,
    type TEXT CHECK(type IN ('income', 'expense')) NOT NULL,
    icon TEXT DEFAULT 'DollarSign',
    color TEXT DEFAULT '#3B82F6',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS transactions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    amount REAL NOT NULL,
    category_id INTEGER NOT NULL,
    note TEXT,
    type TEXT CHECK(type IN ('income', 'expense')) NOT NULL,
    tags TEXT,
    date DATE NOT NULL,
    receipt_url TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS budgets (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    category_id INTEGER NOT NULL,
    amount REAL NOT NULL,
    month TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE
  );
`);

// Insert default categories if they don't exist
const defaultCategories = [
  { name: 'Salary', type: 'income', icon: 'DollarSign', color: '#10B981' },
  { name: 'Freelance', type: 'income', icon: 'Briefcase', color: '#3B82F6' },
  { name: 'Investment', type: 'income', icon: 'TrendingUp', color: '#8B5CF6' },
  { name: 'Food & Dining', type: 'expense', icon: 'Coffee', color: '#F97316' },
  { name: 'Rent & Utilities', type: 'expense', icon: 'Home', color: '#EF4444' },
  { name: 'Transportation', type: 'expense', icon: 'Car', color: '#06B6D4' },
  { name: 'Shopping', type: 'expense', icon: 'ShoppingBag', color: '#EC4899' },
  { name: 'Entertainment', type: 'expense', icon: 'Film', color: '#84CC16' },
  { name: 'Healthcare', type: 'expense', icon: 'Heart', color: '#F59E0B' },
  { name: 'Travel', type: 'expense', icon: 'Plane', color: '#6366F1' },
];

const existingCategories = db.prepare('SELECT COUNT(*) as count FROM categories WHERE user_id IS NULL').get();
if (existingCategories.count === 0) {
  const insertCategory = db.prepare('INSERT INTO categories (user_id, name, type, icon, color) VALUES (?, ?, ?, ?, ?)');
  defaultCategories.forEach(cat => {
    insertCategory.run(null, cat.name, cat.type, cat.icon, cat.color);
  });
}

// Multer configuration for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  }
});

// Auth middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid token' });
    }
    req.user = user;
    next();
  });
};

// Auth Routes
app.post('/api/auth/signup', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // Check if user exists
    const existingUser = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const result = db.prepare('INSERT INTO users (name, email, password) VALUES (?, ?, ?)').run(name, email, hashedPassword);
    
    const user = db.prepare('SELECT id, name, email, theme, created_at FROM users WHERE id = ?').get(result.lastInsertRowid);
    
    // Generate token
    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' });

    res.status(201).json({ user, token });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/api/auth/signin', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Find user
    const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
    if (!user) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    // Check password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    // Generate token
    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' });

    // Return user without password
    const { password: _, ...userWithoutPassword } = user;
    res.json({ user: userWithoutPassword, token });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.get('/api/auth/me', authenticateToken, (req, res) => {
  try {
    const user = db.prepare('SELECT id, name, email, profile_picture, theme, created_at FROM users WHERE id = ?').get(req.user.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json({ user });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// User Routes
app.put('/api/users/profile', authenticateToken, (req, res) => {
  try {
    const { name, email, theme } = req.body;
    
    db.prepare('UPDATE users SET name = ?, email = ?, theme = ? WHERE id = ?').run(name, email, theme, req.user.userId);
    
    const user = db.prepare('SELECT id, name, email, profile_picture, theme, created_at FROM users WHERE id = ?').get(req.user.userId);
    res.json({ user });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Categories Routes
app.get('/api/categories', authenticateToken, (req, res) => {
  try {
    const categories = db.prepare('SELECT * FROM categories WHERE user_id IS NULL OR user_id = ? ORDER BY name').all(req.user.userId);
    res.json({ categories });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/api/categories', authenticateToken, (req, res) => {
  try {
    const { name, type, icon, color } = req.body;
    
    const result = db.prepare('INSERT INTO categories (user_id, name, type, icon, color) VALUES (?, ?, ?, ?, ?)').run(req.user.userId, name, type, icon, color);
    
    const category = db.prepare('SELECT * FROM categories WHERE id = ?').get(result.lastInsertRowid);
    res.status(201).json({ category });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Transactions Routes
app.get('/api/transactions', authenticateToken, (req, res) => {
  try {
    const transactions = db.prepare(`
      SELECT t.*, c.name as category_name, c.color as category_color, c.icon as category_icon, c.type as category_type
      FROM transactions t
      LEFT JOIN categories c ON t.category_id = c.id
      WHERE t.user_id = ?
      ORDER BY t.date DESC, t.created_at DESC
    `).all(req.user.userId);
    
    res.json({ transactions });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/api/transactions', authenticateToken, upload.single('receipt'), (req, res) => {
  try {
    const { amount, category_id, note, type, tags, date } = req.body;
    const receipt_url = req.file ? `/uploads/${req.file.filename}` : null;
    
    const result = db.prepare('INSERT INTO transactions (user_id, amount, category_id, note, type, tags, date, receipt_url) VALUES (?, ?, ?, ?, ?, ?, ?, ?)').run(
      req.user.userId, 
      parseFloat(amount), 
      parseInt(category_id), 
      note, 
      type, 
      tags, 
      date, 
      receipt_url
    );
    
    const transaction = db.prepare(`
      SELECT t.*, c.name as category_name, c.color as category_color, c.icon as category_icon, c.type as category_type
      FROM transactions t
      LEFT JOIN categories c ON t.category_id = c.id
      WHERE t.id = ?
    `).get(result.lastInsertRowid);
    
    res.status(201).json({ transaction });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.put('/api/transactions/:id', authenticateToken, (req, res) => {
  try {
    const { amount, category_id, note, type, tags, date } = req.body;
    
    db.prepare('UPDATE transactions SET amount = ?, category_id = ?, note = ?, type = ?, tags = ?, date = ? WHERE id = ? AND user_id = ?').run(
      parseFloat(amount), 
      parseInt(category_id), 
      note, 
      type, 
      tags, 
      date, 
      req.params.id, 
      req.user.userId
    );
    
    const transaction = db.prepare(`
      SELECT t.*, c.name as category_name, c.color as category_color, c.icon as category_icon, c.type as category_type
      FROM transactions t
      LEFT JOIN categories c ON t.category_id = c.id
      WHERE t.id = ? AND t.user_id = ?
    `).get(req.params.id, req.user.userId);
    
    res.json({ transaction });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.delete('/api/transactions/:id', authenticateToken, (req, res) => {
  try {
    const result = db.prepare('DELETE FROM transactions WHERE id = ? AND user_id = ?').run(req.params.id, req.user.userId);
    
    if (result.changes === 0) {
      return res.status(404).json({ error: 'Transaction not found' });
    }
    
    res.json({ message: 'Transaction deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Budgets Routes
app.get('/api/budgets', authenticateToken, (req, res) => {
  try {
    const budgets = db.prepare(`
      SELECT b.*, c.name as category_name, c.color as category_color, c.icon as category_icon
      FROM budgets b
      LEFT JOIN categories c ON b.category_id = c.id
      WHERE b.user_id = ?
      ORDER BY b.month DESC
    `).all(req.user.userId);
    
    res.json({ budgets });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/api/budgets', authenticateToken, (req, res) => {
  try {
    const { category_id, amount, month } = req.body;
    
    const result = db.prepare('INSERT INTO budgets (user_id, category_id, amount, month) VALUES (?, ?, ?, ?)').run(
      req.user.userId, 
      parseInt(category_id), 
      parseFloat(amount), 
      month
    );
    
    const budget = db.prepare(`
      SELECT b.*, c.name as category_name, c.color as category_color, c.icon as category_icon
      FROM budgets b
      LEFT JOIN categories c ON b.category_id = c.id
      WHERE b.id = ?
    `).get(result.lastInsertRowid);
    
    res.status(201).json({ budget });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.put('/api/budgets/:id', authenticateToken, (req, res) => {
  try {
    const { category_id, amount, month } = req.body;
    
    db.prepare('UPDATE budgets SET category_id = ?, amount = ?, month = ? WHERE id = ? AND user_id = ?').run(
      parseInt(category_id), 
      parseFloat(amount), 
      month, 
      req.params.id, 
      req.user.userId
    );
    
    const budget = db.prepare(`
      SELECT b.*, c.name as category_name, c.color as category_color, c.icon as category_icon
      FROM budgets b
      LEFT JOIN categories c ON b.category_id = c.id
      WHERE b.id = ? AND b.user_id = ?
    `).get(req.params.id, req.user.userId);
    
    res.json({ budget });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.delete('/api/budgets/:id', authenticateToken, (req, res) => {
  try {
    const result = db.prepare('DELETE FROM budgets WHERE id = ? AND user_id = ?').run(req.params.id, req.user.userId);
    
    if (result.changes === 0) {
      return res.status(404).json({ error: 'Budget not found' });
    }
    
    res.json({ message: 'Budget deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Stats Routes
app.get('/api/stats', authenticateToken, (req, res) => {
  try {
    const currentMonth = new Date().toISOString().slice(0, 7); // YYYY-MM format
    
    // Current month stats
    const currentMonthStats = db.prepare(`
      SELECT 
        SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END) as total_income,
        SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END) as total_expenses
      FROM transactions 
      WHERE user_id = ? AND date LIKE ?
    `).get(req.user.userId, `${currentMonth}%`);
    
    // Previous month stats for comparison
    const prevMonth = new Date();
    prevMonth.setMonth(prevMonth.getMonth() - 1);
    const prevMonthStr = prevMonth.toISOString().slice(0, 7);
    
    const prevMonthStats = db.prepare(`
      SELECT 
        SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END) as total_income,
        SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END) as total_expenses
      FROM transactions 
      WHERE user_id = ? AND date LIKE ?
    `).get(req.user.userId, `${prevMonthStr}%`);
    
    // Category-wise expenses for current month
    const categoryExpenses = db.prepare(`
      SELECT c.name, c.color, SUM(t.amount) as total
      FROM transactions t
      LEFT JOIN categories c ON t.category_id = c.id
      WHERE t.user_id = ? AND t.type = 'expense' AND t.date LIKE ?
      GROUP BY c.id, c.name, c.color
      ORDER BY total DESC
    `).all(req.user.userId, `${currentMonth}%`);
    
    // Monthly trends (last 6 months)
    const monthlyTrends = [];
    for (let i = 5; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      const monthStr = date.toISOString().slice(0, 7);
      
      const monthStats = db.prepare(`
        SELECT 
          SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END) as income,
          SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END) as expenses
        FROM transactions 
        WHERE user_id = ? AND date LIKE ?
      `).get(req.user.userId, `${monthStr}%`);
      
      monthlyTrends.push({
        month: date.toLocaleDateString('en-US', { month: 'short' }),
        income: monthStats.income || 0,
        expenses: monthStats.expenses || 0
      });
    }
    
    res.json({
      currentMonth: {
        income: currentMonthStats.total_income || 0,
        expenses: currentMonthStats.total_expenses || 0,
        balance: (currentMonthStats.total_income || 0) - (currentMonthStats.total_expenses || 0)
      },
      previousMonth: {
        income: prevMonthStats.total_income || 0,
        expenses: prevMonthStats.total_expenses || 0,
        balance: (prevMonthStats.total_income || 0) - (prevMonthStats.total_expenses || 0)
      },
      categoryExpenses,
      monthlyTrends
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});