// Express app configuration
import express from 'express';
import cors from 'cors';

import authRoutes from './routes/auth.routes';
import emergencyRoutes from './routes/emergency.routes';
import userRoutes from './routes/user.routes';
import profileRoutes from './routes/profile.routes';
import alertsRoutes from './routes/alerts.routes';
import adminRoutes from './routes/admin.routes';
import feedbackRoutes from './routes/feedback.routes';

import { errorMiddleware } from './middlewares/error.middleware';
import { apiRateLimiter } from './middlewares/rateLimit.middleware';

const app = express();

// Enable CORS for all routes
app.set('trust proxy', 1);
app.use(
  cors({
    origin: '*', // Allow all origins (restrict in production)
    credentials: false,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  }),
);

// Parse JSON body
app.use(express.json());

// Apply global rate limiting
app.use(apiRateLimiter);

// Request logger
app.use((req, _res, next) => {
  //("INCOMING:", req.method, req.url);
  next();
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/emergency', emergencyRoutes);
app.use('/api/alerts', alertsRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/feedback', feedbackRoutes);

// Health check
app.get('/api/health', (_req, res) => {
  res.json({ status: 'OK' });
});

// Error handler (must be last)
app.use(errorMiddleware);

export default app;
