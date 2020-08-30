const bcrypt = require('bcryptjs'),
    BCRYPT_ITERATIONS = 10;

module.exports = {
    /**
     * Generate password hash
     * @param {String} password
     * @returns {String}
     */
    passwordHash(password) {
        return bcrypt.hashSync(password, bcrypt.genSaltSync(BCRYPT_ITERATIONS));
    },
};
