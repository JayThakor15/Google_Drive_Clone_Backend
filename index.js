import express from 'express';
import authRoutes from './src/routes/authRoutes.js';
import passport from './src/config/passport.js';

const app = express();
app.use(express.json());
app.use(passport.initialize());

app.use('/', authRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;