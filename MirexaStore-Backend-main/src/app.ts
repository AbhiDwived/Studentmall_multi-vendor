import cors, { CorsOptions } from 'cors';
import express, { Application, Request, Response } from 'express';
import passport from 'passport';
import session from 'express-session';
import globalErrorHandler from './app/middlewares/globalErrorhandler';
import notFound from './app/middlewares/notFound';
import router from './app/routes';
import config from './app/config'; // Your sensitive config
import './app/config/passport'; // Google Strategy

const app: Application = express();

// Allowed frontend origins
const allowedOrigins = [
  'https://studentmall-frontend-f5yxoj-95447d-147-93-18-171.traefik.me',
  'https://studentmall-multi-vendor-bnhi7j07i.vercel.app', // Your Vercel deployment
  'http://localhost:3000', // Development frontend
  'http://localhost:3001', // Alternative development port
];

const corsOptions: CorsOptions = {
  origin: (origin, callback) => {
    console.log('CORS Origin:', origin);
    // Temporary: Allow all origins for debugging
    if (config.NODE_ENV === 'production') {
      callback(null, true); // Allow all origins temporarily
    } else {
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) {
        console.log('CORS: Origin allowed');
        callback(null, true);
      } else {
        console.log('CORS: Origin blocked');
        callback(new Error('Not allowed by CORS'));
      }
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions));
app.use(express.json());

// Session configuration
app.use(
  session({
    secret: config.session_secret || 'your-fallback-secret',
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: config.NODE_ENV === 'production', // HTTPS only
      httpOnly: true,
      maxAge: 60 * 60 * 1000, // 1 hour
      sameSite: 'none', // ✅ required for cross-origin cookies
    },
  })
);

// Passport
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use('/api', router);

// Health check
app.get('/', (req: Request, res: Response) => {
  res.send('🚀 Deployment Successful!....');
});

// Error handlers
app.use(globalErrorHandler);
app.use(notFound);

export default app;
