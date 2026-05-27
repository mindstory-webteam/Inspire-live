require('dotenv').config();
const express = require('express');
const cors    = require('cors');
const path    = require('path');
const connectDB      = require('./config/database');
const { errorHandler } = require('./middleware/error');

// ─── Route imports ────────────────────────────────────────────────────────────
const authRoutes                                  = require('./routes/authRoutes');
const { blogRouter, adminRouter }                 = require('./routes/blogRoutes');
const bannerRoutes                                = require('./routes/bannerRoutes');
const { eventRouter, eventAdminRouter }           = require('./routes/eventRoutes');
const { careerRoutes, careerAdminRoutes }         = require('./routes/careerRoutes');
const { contactRoutes, contactAdminRoutes }       = require('./routes/contactRoutes');
const serviceRoutes                               = require('./routes/serviceRoutes');
const { teamRouter, teamAdminRouter }             = require('./routes/teamRoutes');
const { testimonialRoutes, testimonialAdminRoutes } = require('./routes/testimonialRoutes');
const newsletterRoutes                            = require('./routes/newsletterRoutes');
const { resourcepersonAdminRouter, ourresourceRouter } = require('./routes/ourresourcePersonRoutes');
const { contactInfoRoutes, contactInfoAdminRoutes }    = require('./routes/contactinfoRoutes');

// ── NEW ───────────────────────────────────────────────────────────────────────
const { applicationRouter, applicationAdminRouter } = require('./routes/applicationRoutes');

// ─── DB ───────────────────────────────────────────────────────────────────────
connectDB();

const app = express();

// ─── CORS ─────────────────────────────────────────────────────────────────────
const allowedOrigins = [
  'http://187.127.151.100',
  'http://187.127.151.100:3000',
  'http://187.127.151.100:4173',
  'http://localhost:5173',
  'http://localhost:3000',
  'https://inspireeducationservice.com',
  'https://www.inspireeducationservice.com',
  'https://admin.inspireeducationservice.com',
  'http://inspireeducationservice.com',
  'http://www.inspireeducationservice.com',
  'https://join.inspireeducationservice.com',   // application form subdomain
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) callback(null, true);
      else {
        console.log('❌ Blocked by CORS:', origin);
        callback(null, false);
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// ─── Body Parsing ─────────────────────────────────────────────────────────────
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ─── Static Files ─────────────────────────────────────────────────────────────
app.use('/uploads', express.static(path.join(__dirname, '../public/uploads')));

// ─── Root ─────────────────────────────────────────────────────────────────────
app.get('/', (req, res) =>
  res.json({ success: true, message: '🚀 Inspire Live Backend Running' })
);

// ─── API Routes ───────────────────────────────────────────────────────────────
app.use('/api/auth',                      authRoutes);
app.use('/api/blogs',                     blogRouter);
app.use('/api/admin',                     adminRouter);
app.use('/api/banner',                    bannerRoutes);
app.use('/api/events',                    eventRouter);
app.use('/api/admin/events',              eventAdminRouter);
app.use('/api/careers',                   careerRoutes);
app.use('/api/admin/careers',             careerAdminRoutes);
app.use('/api/contact',                   contactRoutes);
app.use('/api/admin/contacts',            contactAdminRoutes);
app.use('/api/services',                  serviceRoutes);
app.use('/api/team',                      teamRouter);
app.use('/api/admin/team',                teamAdminRouter);
app.use('/api/ourresourceperson',         ourresourceRouter);
app.use('/api/admin/ourresourceperson',   resourcepersonAdminRouter);
app.use('/api/testimonials',              testimonialRoutes);
app.use('/api/admin/testimonials',        testimonialAdminRoutes);
app.use('/api',                           newsletterRoutes);
app.use('/api/contact-info',              contactInfoRoutes);
app.use('/api/admin/contact-info',        contactInfoAdminRoutes);

// ── NEW: Application form routes ──────────────────────────────────────────────
app.use('/api/applications',              applicationRouter);       // public submit
app.use('/api/admin/applications',        applicationAdminRouter);  // admin CRUD

// ─── Health ───────────────────────────────────────────────────────────────────
app.get('/api/health', (req, res) =>
  res.json({ success: true, message: 'Inspire API is running 🚀' })
);

// ─── Dev-only admin reset (remove in prod) ────────────────────────────────────
app.get('/api/reset-admin-production', async (req, res) => {
  try {
    const User = require('./models/User');
    await User.deleteOne({ email: 'admin@blog.com' });
    const newAdmin = await User.create({
      name: 'Super Admin', email: 'admin@blog.com',
      password: 'admin123', role: 'admin', isActive: true,
    });
    res.json({ success: true, message: 'Admin reset!', passwordIsHashed: newAdmin.password.startsWith('$2') });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// ─── 404 ──────────────────────────────────────────────────────────────────────
app.use((req, res) =>
  res.status(404).json({ success: false, message: `Route ${req.originalUrl} not found` })
);

// ─── Error Handler ────────────────────────────────────────────────────────────
app.use(errorHandler);

// ─── Start ────────────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📋 Health: http://localhost:${PORT}/api/health`);
  console.log(`🌐 CORS origins:`, allowedOrigins);
});