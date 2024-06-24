const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const userRoutes = require('./routes/userRoutes');
const path = require('path');
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Set EJS as the templating engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/api/users', userRoutes);

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Routes for login and signup pages
app.get('/signup', (req, res) => {
  res.render('signup');
});

app.get('/login', (req, res) => {
  res.render('login');
});


app.get('/signup', (req, res) => {
    res.render('signup.ejs');
  });

// JWT authentication middleware
const authenticateJWT = (req, res, next) => {
  const token = req.header('Authorization')?.split(' ')[1];
  
  if (token) {
    jwt.verify(token, AB, (err, user) => {
      if (err) {
        return res.sendStatus(403);
      }
      req.user = user;
      next();
    });
  } else {
    res.sendStatus(401);
  }
};

// Mock user data
const mockUser = { id: 1, username: 'testuser', password: 'testpassword' };

// Login endpoint to issue JWT
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;

  // Validate user (in real applications, validate against a database)
  if (username === mockUser.username && password === mockUser.password) {
    const token = jwt.sign({ username: mockUser.username, id: mockUser.id }, AB, { expiresIn: '1h' });
    res.json({ token });
  } else {
    res.sendStatus(401);
  }
});

// Protected route
app.get('/api/protected', authenticateJWT, (req, res) => {
  res.json({ message: 'This is a protected route.', user: req.user });
});
  
  
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
