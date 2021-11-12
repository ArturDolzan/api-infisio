const { authSecret } = require('../.env')
const passport = require('passport')
const passportJwt = require('passport-jwt')
const db = require('./db')
const { Strategy, ExtractJwt } = passportJwt

const params = {
    secretOrKey: authSecret,
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
}

module.exports = function() {

    const strategy = new Strategy(params, (payload, done) => {

        db.raw(`set infisio.idtenant = ${payload.idtenant}`)
        .then(() => {

            if (payload.master) {
                db('contas_tenant')
                .where({ idtenant: payload.idtenant })
                .first()
                .then(user => {
                    if (user) {
                        done(null, { email: user.email, idtenant: user.idtenant, master: payload.master })
                    } else {
                        done(null, false)
                    }    
                })
                .catch(err => done(err, false))
            } else {
                
                db('agentes')
                .where({ idtenant: payload.idtenant, email: payload.email })
                .first()
                .then(user => {
                    if (user) {
                        done(null, { email: user.email, idtenant: user.idtenant, master: payload.master })
                    } else {
                        done(null, false)
                    }
                })
                .catch(err => done(err, false))
            }
        }).catch(err => done(err, false))

    })

    passport.use(strategy)

    return {
        initialize: function() {return passport.initialize()} ,
        authenticate: function() {return passport.authenticate('jwt', { session: false })},
    }    
}