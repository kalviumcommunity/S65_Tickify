const { check , validationResult } = require('express-validator');
const User = require('../models/userModel');
const bcrypt = require('bcrypt');

// Utility function to handle errors
const handleError = (res, error, status = 500) => {
    console.error(error);
    return res.status(status).json({ 
        success: false,
        error: error.message 
    });
};

// Get all users (admin only)
const getUsers = async (req, res) => {
    try {
        const users = await User.find().select('-password -__v');
        return res.status(200).json({ 
            success: true,
            data: users 
        });
    } catch (err) {
        handleError(res, err);
    }
};

// Get accounts for a specific email
const getUserAccounts = async (req, res) => {
    try {
        const { email } = req.query;
        
        if (!email) {
            return res.status(400).json({ 
                success: false,
                error: "Email parameter is required" 
            });
        }

        const accounts = await User.find({ email }).select('-password -__v');
        return res.status(200).json({ 
            success: true,
            data: accounts 
        });
    } catch (err) {
        handleError(res, err);
    }
};

// User Signup
const signup = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ 
            success: false,
            errors: errors.array() 
        });
    }

    try {
        const { email, password } = req.body;
        const normalizedEmail = email.toLowerCase().trim();

        // Check if user exists (simplified check)
        const existingUser = await User.findOne({ email: normalizedEmail });
        if (existingUser) {
            return res.status(400).json({ 
                success: false,
                error: "Email already in use" 
            });
        }

        // Create new user
        const user = new User({
            email: normalizedEmail,
            password
        });

        await user.save();
        
        // Generate token
        const token = user.generateAuthToken();
        
        return res.status(201).json({ 
            success: true,
            message: "User created successfully!",
            token,
            userId: user._id,
            email: user.email
        });

    } catch (err) {
        console.error("Signup error:", err);
        return res.status(500).json({ 
            success: false,
            error: "Server error during registration",
            details: process.env.NODE_ENV === 'development' ? err.message : undefined
        });
    }
};

const createSubAccount = async (req, res) => {
    try {
      const { email, password, accountName } = req.body;
  
      // Validate inputs
      if (!email || !password || !accountName) {
        return res.status(400).json({
          success: false,
          error: "All fields are required"
        });
      }
  
      // Trim and normalize
      const normalizedEmail = email.toLowerCase().trim();
      const normalizedAccountName = accountName.trim();
  
      // Check for existing account (case-insensitive)
      const existingAccount = await User.findOne({
        email: normalizedEmail,
        accountName: { $regex: new RegExp(`^${normalizedAccountName}$`, 'i') }
      });
  
      if (existingAccount) {
        return res.status(409).json({
          success: false,
          error: `Account name "${accountName}" already exists`
        });
      }
  
      // Create and save new account
      const newAccount = new User({
        email: normalizedEmail,
        password,
        accountName: normalizedAccountName,
        parentAccount: req.user._id
      });
  
      await newAccount.save();
  
      // Return success response
      return res.status(201).json({
        success: true,
        message: "Account created successfully",
        data: {
          _id: newAccount._id,
          email: newAccount.email,
          accountName: newAccount.accountName
        }
      });
  
    } catch (error) {
      console.error("Account creation error:", error);
      if (error.code === 11000) { // MongoDB duplicate key error
        return res.status(409).json({
          success: false,
          error: "Account name already exists"
        });
      }
      return res.status(500).json({
        success: false,
        error: "Server error during account creation"
      });
    }
  };

const switchAccount = async (req, res) => {
    try {
        const { email, password, accountName } = req.body;

        // Find the account
        const query = { email };
        if (accountName) {
            query.accountName = accountName;
        } else {
            query.$or = [
                { accountName: { $exists: false } },
                { accountName: null }
            ];
        }

        const account = await User.findOne(query);
        if (!account) {
            return res.status(404).json({
                success: false,
                error: "Account not found"
            });
        }

        // Verify password
        const isMatch = await account.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                error: "Invalid credentials"
            });
        }

        // Generate new token
        const token = account.generateAuthToken();

        // Return account data without sensitive info
        const accountData = account.toObject();
        delete accountData.password;
        delete accountData.__v;

        return res.status(200).json({
            success: true,
            message: "Account switched successfully",
            token,
            data: accountData
        });

    } catch (error) {
        console.error("Account switching error:", error);
        return res.status(500).json({
            success: false,
            error: "Server error during account switch",
            details: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

const deleteAccount = async (req, res) => {
    try {
        const { accountId } = req.params;
        const { email } = req.user; // From auth middleware

        // Verify the account belongs to the user
        const account = await User.findOne({
            _id: accountId,
            email
        });

        if (!account) {
            return res.status(404).json({
                success: false,
                error: "Account not found or not authorized"
            });
        }

        // Prevent deleting the main account
        if (!account.accountName) {
            return res.status(400).json({
                success: false,
                error: "Cannot delete main account"
            });
        }

        await User.deleteOne({ _id: accountId });

        return res.status(200).json({
            success: true,
            message: "Account deleted successfully"
        });

    } catch (error) {
        console.error("Account deletion error:", error);
        return res.status(500).json({
            success: false,
            error: "Server error during account deletion"
        });
    }
};

const updateAccount = async (req, res) => {
    try {
        const { accountId } = req.params;
        const { email } = req.user;
        const updates = req.body;

        // Remove restricted fields
        delete updates.email;
        delete updates._id;

        // Verify the account belongs to the user
        const account = await User.findOne({
            _id: accountId,
            email
        });

        if (!account) {
            return res.status(404).json({
                success: false,
                error: "Account not found or not authorized"
            });
        }

        // Handle password updates
        if (updates.password) {
            const salt = await bcrypt.genSalt(10);
            updates.password = await bcrypt.hash(updates.password, salt);
        }

        // Update account
        const updatedAccount = await User.findByIdAndUpdate(
            accountId,
            updates,
            { new: true, runValidators: true }
        ).select('-password -__v');

        return res.status(200).json({
            success: true,
            message: "Account updated successfully",
            data: updatedAccount
        });

    } catch (error) {
        console.error("Account update error:", error);
        
        if (error.name === 'ValidationError') {
            return res.status(400).json({
                success: false,
                error: "Validation failed",
                details: error.errors
            });
        }

        return res.status(500).json({
            success: false,
            error: "Server error during account update"
        });
    }
};

// User Login
const signin = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ 
            success: false,
            errors: errors.array() 
        });
    }

    try {
        const { email, password } = req.body;
        const normalizedEmail = email.toLowerCase().trim();

        // Find user (including sub-accounts)
        const user = await User.findOne({ email: normalizedEmail });
        if (!user) {
            return res.status(401).json({ 
                success: false,
                error: "Invalid credentials" 
            });
        }

        // Compare password
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ 
                success: false,
                error: "Invalid credentials" 
            });
        }
        
        // Generate token
        const token = user.generateAuthToken();
        
        return res.status(200).json({ 
            success: true,
            message: "Login successful",
            token,
            userId: user._id,
            email: user.email,
            accountName: user.accountName || null
        });

    } catch (err) {
        console.error("Signin error:", err);
        return res.status(500).json({ 
            success: false,
            error: "Server error during login",
            details: process.env.NODE_ENV === 'development' ? err.message : undefined
        });
    }
};


// Add this new endpoint to check for existing accounts
const checkAccountExists = async (req, res) => {
    try {
      const { email, accountName } = req.body;
      
      // Check if account already exists (case insensitive)
      const existingAccount = await User.findOne({
        email,
        accountName: { $regex: new RegExp(`^${accountName}$`, 'i') }
      });
  
      if (existingAccount) {
        return res.status(409).json({
          success: false,
          error: "Account with this name already exists"
        });
      }
  
      return res.status(200).json({
        success: true,
        message: "Account name is available"
      });
  
    } catch (error) {
      console.error("Account check error:", error);
      return res.status(500).json({
        success: false,
        error: "Server error during account check"
      });
    }
  };

// Password verification
const verifyPassword = async (req, res) => {
    try {
        const { email, password, accountName } = req.body;
        
        if (!email || !password) {
            return res.status(400).json({ 
                success: false,
                error: "Email and password are required" 
            });
        }

        // Build query
        const query = { email };
        if (accountName) {
            query.accountName = accountName;
        } else {
            query.$or = [
                { accountName: { $exists: false } },
                { accountName: null }
            ];
        }

        // Find user
        const user = await User.findOne(query);
        if (!user) {
            return res.status(404).json({ 
                success: false,
                error: "Account not found" 
            });
        }
        
        // Compare password
        const isMatch = await user.comparePassword(password);
        
        if (isMatch) {
            return res.status(200).json({ 
                success: true,
                message: "Password verified",
                data: {
                    _id: user._id,
                    email: user.email,
                    accountName: user.accountName
                }
            });
        } else {
            return res.status(401).json({ 
                success: false,
                error: "Invalid password" 
            });
        }
    } catch (err) {
        console.error("Password verification error:", err);
        return res.status(500).json({ 
            success: false,
            error: "Server error during password verification",
            details: err.message
        });
    }
};

// Get current user
const getCurrentUser = async (req, res) => {
    try {
        const userId = req.params.userId;
        const user = await User.findById(userId).select('-password -__v');
        
        if (!user) {
            return res.status(404).json({ 
                success: false,
                error: "User not found" 
            });
        }
        
        return res.status(200).json({ 
            success: true,
            data: user 
        });
    } catch (err) {
        handleError(res, err);
    }
};



// Validation middleware
const validateUser = [
    check('email')
        .isEmail().withMessage('Please enter a valid email')
        .normalizeEmail(),
    check('password')
        .isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
        .trim()
];

module.exports = { 
    getUsers,
    getUserAccounts,
    signup,
    signin,
    verifyPassword,
    createSubAccount,
    switchAccount,
    deleteAccount,
    updateAccount,
    getCurrentUser,
    checkAccountExists,
    validateUser 
};