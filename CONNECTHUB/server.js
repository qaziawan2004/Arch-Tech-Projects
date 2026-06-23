import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// Load environment variables
dotenv.config();

const app = express();

// ===== USE ENVIRONMENT VARIABLES =====
const MONGODB_URI = process.env.MONGODB_URI;
const JWT_SECRET = process.env.JWT_SECRET;
const PORT = process.env.PORT || 5000;

// Debug: Check if .env loaded
console.log('🔍 Environment check:');
console.log('MONGODB_URI:', MONGODB_URI ? '✅ Set' : '❌ Not set');
console.log('PORT:', PORT || '❌ Not set');
console.log('JWT_SECRET:', JWT_SECRET ? '✅ Set' : '❌ Not set');

// ===== Middleware =====
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());

// ===== DATABASE CONNECTION =====
console.log('🔄 Attempting to connect to MongoDB...');

if (!MONGODB_URI) {
  console.error('❌ ERROR: MONGODB_URI is not defined in .env file!');
  process.exit(1);
}

mongoose.connect(MONGODB_URI)
.then(() => {
  console.log('✅ MongoDB connected successfully');
})
.catch(err => {
  console.error('❌ MongoDB connection error:', err.message);
});

mongoose.connection.on('error', (err) => {
  console.log('❌ Mongoose connection error:', err.message);
});

// ===== USER MODEL (NO pre('save') HOOK) =====
const UserSchema = new mongoose.Schema({
  name: { type: String, required: [true, 'Name is required'] },
  email: { type: String, required: [true, 'Email is required'], unique: true },
  password: { type: String, required: [true, 'Password is required'], select: false },
  profilePicture: { type: String, default: '' },
  bio: { type: String, default: '' },
  friends: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  friendRequests: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  isPrivate: { type: Boolean, default: false },
}, { timestamps: true });

// ===== STATIC METHOD: Hash password =====
UserSchema.statics.hashPassword = async function(password) {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
};

// ===== INSTANCE METHOD: Compare password =====
UserSchema.methods.comparePasswordAsync = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model('User', UserSchema);

// ===== JWT HELPERS =====
const generateToken = (id) => {
  return jwt.sign({ id }, JWT_SECRET, { expiresIn: '7d' });
};

// ===== AUTH ROUTES =====

// Register - Hash password manually
app.post('/api/auth/register', async (req, res) => {
  try {
    console.log('📝 Registration request received:', req.body.email);
    
    const { name, email, password } = req.body;
    
    // Validate input
    if (!name || !email || !password) {
      return res.status(400).json({ 
        success: false, 
        message: 'Please provide name, email and password' 
      });
    }

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ 
        success: false, 
        message: 'Email already exists' 
      });
    }

    // Hash the password manually
    const hashedPassword = await User.hashPassword(password);
    
    // Create user with hashed password
    const user = new User({ 
      name, 
      email, 
      password: hashedPassword 
    });
    
    await user.save();
    console.log('✅ User created:', user._id);
    
    const token = generateToken(user._id);
    
    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          profilePicture: user.profilePicture,
          bio: user.bio
        }
      }
    });
  } catch (error) {
    console.error('❌ Registration error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error', 
      error: error.message 
    });
  }
});

// Login
app.post('/api/auth/login', async (req, res) => {
  try {
    console.log('📝 Login request received for:', req.body.email);
    
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ 
        success: false, 
        message: 'Please provide email and password' 
      });
    }
    
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      console.log('❌ User not found:', email);
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid credentials' 
      });
    }

    const isMatch = await user.comparePasswordAsync(password);
    console.log('🔍 Password match:', isMatch);
    
    if (!isMatch) {
      console.log('❌ Password mismatch for:', email);
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid credentials' 
      });
    }

    const token = generateToken(user._id);
    console.log('✅ Login successful for:', email);
    
    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          profilePicture: user.profilePicture,
          bio: user.bio
        }
      }
    });
  } catch (error) {
    console.error('❌ Login error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error', 
      error: error.message 
    });
  }
});

// Get current user
app.get('/api/auth/me', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ success: false, message: 'No token provided' });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.id);
    
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.status(200).json({
      success: true,
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        profilePicture: user.profilePicture,
        bio: user.bio,
        friends: user.friends,
        friendRequests: user.friendRequests
      }
    });
  } catch (error) {
    console.error('❌ Auth error:', error);
    res.status(401).json({ success: false, message: 'Invalid token' });
  }
});

// ===== DEBUG: Check users =====
app.get('/api/debug/users', async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json({
      success: true,
      count: users.length,
      users: users
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'Server is running' });
});

// ===== START SERVER =====
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});