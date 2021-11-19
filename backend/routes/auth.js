const Router = require('express').Router;
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const db = require('../db');

const router = Router();

const createToken = () => {
  return jwt.sign({}, 'secret', { expiresIn: '1h' });
};

router.post('/login', (req, res, next) => {
  const email = req.body.email;
  const pw = req.body.password;
  db.getClient().db('shops').collection('users').findOne({ email: email })
    .then(user => {
      if (!user) {
        throw 'Email ID does not exist';
      }
      return bcrypt.compare(pw, user.password);
    })
    .then(passwordMatched => {
      if (!passwordMatched) {
        throw 'Password does not match';
      }
      const token = createToken();
      res.status(201).json({ token: token, user: { email } });
    })
    .catch(err => {
      console.log(err);
      res.status(401).json({ message: 'Authentication failed, invalid username or password.' });
    })

});

router.post('/signup', (req, res, next) => {
  const email = req.body.email;
  const pw = req.body.password;
  // Hash password before storing it in database => Encryption at Rest
  bcrypt
    .hash(pw, 12)
    .then(hashedPW => {
      return db.getClient().db('shops').collection('users').insertOne({ email, password: hashedPW });
    })
    .then(result => {
      const token = createToken();
      res.status(201).json({ token: token, user: { email } });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ message: 'Creating the user failed.' });
    });
});

module.exports = router;
