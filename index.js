import express from 'express';
import authRoutes from './src/routes/authRoutes.js';
import fileRoutes from './src/routes/fileRoutes.js';
import passport from './src/config/passport.js';

const app = express();
app.use(express.json());
app.use(passport.initialize());

app.use('/', authRoutes);
app.use('/files', fileRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;