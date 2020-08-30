const _ = require('lodash'),
    md5 = require('md5'),
    uuidV4 = require('uuid/v4'),
    validator = require('validator'),
    chance = require('chance').Chance();

const DIGITS_POOL = '123456789';
const ALPHA_NUMERIC_POOL = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

module.exports = {
    isNumber(n) {
        return !isNaN(parseFloat(n)) && isFinite(n);
    },

    toBoolean(value) {
        let result = false;
        try {
            result = (_.isString(value) && (value.toLowerCase() === 'false' || value === '0')) ? false : Boolean(value);
        } catch (e) {
            console.error(e);
        }
        return result;
    },

    randomString(length) {
        return chance.string({ length, pool: ALPHA_NUMERIC_POOL });
    },

    randomStringDigits(length) {
        return chance.string({ length, pool: DIGITS_POOL });
    },

    clamp(v, min, max) {
        if (v < min) v = min;
        if (v > max) v = max;
        if (!this.isNumber(v)) {
            v = (min + max) / 2;
        }
        if (!this.isNumber(v)) {
            v = min;
        }
        return v;
    },

    clampPercent(v) {
        return this.clamp(v, 0, 100);
    },

    isValidUsername(username) {
        if (!username || !username.trim()) return false;
        // can contain alphanumeric characters as well as ".", "_","-"
        const regex = /^[a-zA-Z]+[a-zA-Z0-9._-]*$/;
        const regex_result = username.match(regex);
        return !!regex_result;
    },

    isNumeric(str) {
        return !_.isNil(str) && validator.isNumeric(str);
    },

    generateRandomMD5() {
        const timestamp = (new Date()).getTime();
        return md5(`${uuidV4()}_${timestamp}`);
    },

    /**
     * Modifies object
     * @param value
     * @returns {*}
     */
    castToLowerCase(value, keysToConvert) {
        if (!value) return null;

        if (_.isString(value)) return value.toLowerCase().trim();

        if (_.isObject(value)) {
            keysToConvert = keysToConvert || _.keys(value);
            _.each(keysToConvert, (_k) => {
                const _v = value[_k];
                if (_v && _.isString(_v)) value[_k] = _v.toLowerCase().trim();
            });
        }
        return value;
    },


    emailAndPasswordValid(email, password) {
        return _.isString(email) && _.isString(password) && this.isValidEmail(email);
    },


    isValidEmail(email) {
        return !_.isNil(email) && validator.isEmail(email);
    },

    transformKeys(obj, fn) {
        if (!fn || !_.isFunction(fn)) {
            fn = t => t; // identity function
        }
        _.each(obj, (_v, _k) => {
            const newKey = fn(_k);
            obj[newKey] = _v;
            delete obj[_k];
        });
        return obj;
    },

    /**
     * Converts number to pretty USD price (e.g. 1234.56 to $1,234.56)
     */
    numberToUSD(enteredNumber) {
        const formattedCurrency = Number(enteredNumber).toFixed(2).replace(/./g, (c, i, a) => {
            return i && c !== '.' && ((a.length - i) % 3 === 0) ? `,${c}` : c;
        });
        return `$${formattedCurrency}`;
    },

    digitsPrecision(n, precision) {
        const number = parseFloat(n);
        const pow = Math.pow(10, precision);
        return Math.round(number * pow) / pow;
    },
};
