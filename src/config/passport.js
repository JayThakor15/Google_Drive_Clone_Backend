import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import supabase from '../db/index.js';
import jwt from 'jsonwebtoken';

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: '/auth/google/callback'
}, async (accessToken, refreshToken, profile, done) => {
  // Find or create user in Supabase
  const email = profile.emails[0].value;
  let { data: user } = await supabase
    .from('users')
    .select('*')
    .eq('email', email)
    .single();

  if (!user) {
    const { data } = await supabase
      .from('users')
      .insert([{ email, password: '' }])
      .select();
    user = data[0];
  }

  // Attach JWT to user object
  user.token = jwt.sign({ id: user.id, email }, process.env.JWT_SECRET, { expiresIn: '1h' });
  done(null, user);
}));

export default passport;