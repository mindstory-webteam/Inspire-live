// ════════════════════════════════════════════════════════════════════
// COMPLETE server.js — your existing code + events routes added
// Changes from your original are marked with ← ADD THIS
// ════════════════════════════════════════════════════════════════════

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/database');
const { errorHandler } = require('./middleware/error');
const authRoutes = require('./routes/authRoutes');
const { blogRouter, adminRouter } = require('./routes/blogRoutes');
const bannerRoutes = require('./routes/bannerRoutes');
const { eventRouter, eventAdminRouter } = require('./routes/eventRoutes'); // ← ADD THIS

// Connect to MongoDB
connectDB();

const app = express();

// ─── CORS Configuration ──────────────────────────────────────────────────────
const allowedOrigins = [
  'https://inspire-live.vercel.app',
  'https://inspire-live-225z.vercel.app',
  'http://localhost:5173',
  'http://localhost:3000',
].filter(Boolean);

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.log('❌ Blocked by CORS:', origin);
        callback(null, false);
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// ─── Body Parsing Middleware (MUST be before routes) ─────────────────────────
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ─── Static Files ─────────────────────────────────────────────────────────────
app.use('/uploads', express.static(path.join(__dirname, '../public/uploads')));

// ─── Root Route ───────────────────────────────────────────────────────────────
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: '🚀 Inspire Live Backend Running',
  });
});

// ─── API Routes ───────────────────────────────────────────────────────────────
app.use('/api/auth', authRoutes);
app.use('/api/blogs', blogRouter);
app.use('/api/admin', adminRouter);
app.use('/api/banner', bannerRoutes);
app.use('/api/events', eventRouter);             // ← ADD THIS  (public)
app.use('/api/admin/events', eventAdminRouter);  // ← ADD THIS  (admin, protected)

// ─── Health Check ─────────────────────────────────────────────────────────────
app.get('/api/health', (req, res) =>
  res.json({ success: true, message: 'Blog API is running 🚀' })
);

/*
⚠️ DANGER: Remove this route after first admin setup in production
*/
app.get('/api/reset-admin-production', async (req, res) => {
  try {
    const User = require('./models/User');

    const deleted = await User.deleteOne({ email: 'admin@blog.com' });

    const newAdmin = await User.create({
      name: 'Super Admin',
      email: 'admin@blog.com',
      password: 'admin123',
      role: 'admin',
      isActive: true,
    });

    const isHashed = newAdmin.password.startsWith('$2');

    res.json({
      success: true,
      message: 'Production admin reset!',
      passwordIsHashed: isHashed,
      deletedCount: deleted.deletedCount,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// ─── 404 Handler ──────────────────────────────────────────────────────────────
app.use((req, res) =>
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
  })
);

// ─── Global Error Handler (MUST be last) ──────────────────────────────────────
app.use(errorHandler);

// ─── Start Server ──────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📋 Health check: http://localhost:${PORT}/api/health`);
  console.log(`🌐 Allowed CORS origins:`, allowedOrigins);
});