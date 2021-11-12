const bcrypt = require('bcrypt-nodejs')

class InFisioBcrypt {
    // obterHash(password, callback) {
    //     bcrypt.genSalt(10, (err, salt) => {
    //         bcrypt.hash(password, salt, null, (err, hash) => {
    //             callback(hash)
    //         })
    //     })
    // }

    obterHash(password) {
        const salt = bcrypt.genSaltSync(10)
        return bcrypt.hashSync(password, salt)
    }
}

module.exports = {
    InFisioBcrypt
}