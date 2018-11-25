const passport = require('passport');
const GoogleStrat = require('passport-google-oauth20');
const User = require('../models/user-model');
require('dotenv').config();

passport.serializeUser((user, done) => {
    done(null, user.id)
})
passport.deserializeUser((id, done) => {
    User.findById(id).then((user) => {
        done(null, user)
    })
})

passport.use(new GoogleStrat({
callbackURL: '/auth/google/redirect',
clientID: process.env.CLIENTID,
clientSecret: process.env.CLIENTSECRET,
proxy: true
}, (accessToken, refreshToken, profile, done) => {
    User.findOne({
        googleId: profile.id
    }).then((currentUser) => {
        if(currentUser) {
                done(null, currentUser)
        } else {
            new User({
                username: profile.displayName,
                googleId: profile.id,
                email: profile.emails[0].value
            }).save()
              .then((newUser) => {
                  done(null, newUser)
              })
        }
    })
})
)
