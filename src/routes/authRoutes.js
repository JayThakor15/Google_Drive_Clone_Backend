import express from 'express';
import { signup, login, googleAuth, googleCallback } from '../controller/authController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';
import passport from '../config/passport.js';

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get('/auth/google/callback',
  passport.authenticate('google', { session: false }),
  (req, res) => {
    res.json({ message: 'Google login successful', token: req.user.token });
  }
);
router.get('/protected', authenticateToken, (req, res) => {
  res.json({ message: 'Protected route', user: req.user });
});
// Logout route (JWT-based logout is handled client-side by deleting the token)
router.post('/logout', (req, res) => {
  // For JWT, just instruct client to delete token
  res.json({ message: 'Logged out successfully' });
});

export default router;