const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User } = require('../models');



// Ensure the JWT secret is read from the environment variables
const jwtSecret = "AB";


exports.signup = async (req, res) => {
    const { username, email, password } = req.body;
    try {
      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        return res.status(400).render('error', {
          message: 'User already exists with this email',
          redirectUrl: '/signup'
        });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ username, email, password: hashedPassword });
    res.status(201).render("signupSucess",{ message: 'User created successfully',
            redirectUrl:'/signup' 
        });
  } catch (error) {
    res.status(500).render('error', {
      message: 'An error occurred during signup. Please try again.',
      redirectUrl: '/signup'
    });
  }
};


exports.login = async (req, res) => {
    const { email, password } = req.body;
    try {
      const user = await User.findOne({ where: { email } });
      if (!user) {
        return res.status(404).render('loginError', {
          message: 'User not found',
          redirectUrl: '/login'
        });
      }
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).render('loginError', {
          message: 'Invalid password',
         
          redirectUrl: '/login'
        });
      }
      const token = jwt.sign({ userId: user.id }, jwtSecret, { expiresIn: '1h' });
      res.status(200).render("loginSucess",{ message: 'Login successful',
        token: token,
        redirectUrl:'/login'
      });
    } catch (error) {
      res.status(500).render('loginError', {
        message: 'An error occurred during login. Please try again.',
        redirectUrl: '/login'
      });
    }
  };


