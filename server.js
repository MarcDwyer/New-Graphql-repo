const express = require('express');
const app = express();
require('dotenv').config();
const graphQLHTTP=require('express-graphql');
const mongoose = require('mongoose');
const cookieSession = require('cookie-session');
const passport = require('passport');
const passportSetup = require('./config/passport_setup');
const schema = require('./schema/schema');
const authRoutes = require('./routes/authroutes');
const cors = require('cors');

const port = 5000;

app.listen(port);

const mongo = process.env.MONGODB;
mongoose.connect(mongo);

app.use(cookieSession({
    maxAge: 24 * 60 * 60 * 1000,
    keys: [process.env.SECRET]
}))

app.use(passport.initialize());
app.use(passport.session());

const hosts = 'https://forumsite1234.herokuapp.com/' || 'http://localhost:3000';
var corsOptions = {
  origin: hosts,
  credentials: true
};
app.use(cors(corsOptions));


app.get('/login', cors(), (req, res) => {
    if (!req.user) return;

    const obj = {
        user: req.user.username,
        id: req.user._id
    }
        res.send(obj)
})


app.use('/auth', authRoutes)

app.use('/graph', cors(),
 graphQLHTTP(req => ({
  schema,
  graphiql: true,
  context: {
    user: req.user
  }
})))


mongoose.connection.once('open', () => {
  console.log('db connected');
})
