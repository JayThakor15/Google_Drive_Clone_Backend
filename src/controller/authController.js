import supabase from '../db/index.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;

export async function signup(req, res) {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Email and password required' });

  // Check if user already exists
  const { data: existingUser } = await supabase
    .from('users')
    .select('*')
    .eq('email', email)
    .single();

  if (existingUser) {
    return res.status(409).json({ error: 'Email already registered' });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const { data, error } = await supabase
    .from('users')
    .insert([{ email, password: hashedPassword }])
    .select();

  if (error) return res.status(400).json({ error: error.message });

  const token = jwt.sign({ id: data[0].id, email }, JWT_SECRET, { expiresIn: '1h' });
  res.json({ token });
}

export async function login(req, res) {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Email and password required' });

  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('email', email)
    .single();

  if (error || !data) return res.status(400).json({ error: 'Invalid credentials' });

  const valid = await bcrypt.compare(password, data.password);
  if (!valid) return res.status(400).json({ error: 'Invalid credentials' });

  const token = jwt.sign({ id: data.id, email }, JWT_SECRET, { expiresIn: '1h' });
  res.json({ message: 'Logged in successfully', token });
}

// Google OAuth logic placeholder
export function googleAuth(req, res, next) {
  // Handled by passport middleware in routes
  next();
}

export function googleCallback(req, res) {
  // Handled by passport middleware in routes
  res.json({ user: req.user });
}

export function logout(req, res) {
  // For JWT, logout is handled client-side by deleting the token
  res.json({ message: 'Logged out successfully' });
}