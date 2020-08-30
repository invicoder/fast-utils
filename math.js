const _ = require('lodash');

module.exports = {

    isNumber(n) {
        return !Number.isNaN(parseFloat(n)) && isFinite(n);
    },

    fieldAverage(list, key) {
        if (!_.isArray(list) || !list.length) {
            return null;
        }
        let count = 0;
        let sum = 0;
        _.each(list, (item) => {
            if (item && item[key] && this.isNumber(item[key])) {
                count += 1;
                sum += parseFloat(item[key]);
            }
        });
        if (count === 0) {
            return null;
        }
        return sum / count;
    },

    fieldAverageWeighted(list, key, weightKey) {
        if (!_.isArray(list) || !list.length) {
            return null;
        }
        let totalWeight = 0;
        let sum = 0;
        _.each(list, (item) => {
            const isValid = item && item[key] && this.isNumber(item[key])
                && item[weightKey] && this.isNumber(item[weightKey]);
            if (isValid) {
                const weight = parseFloat(item[weightKey]);
                totalWeight += weight;
                sum += parseFloat(item[key]) * weight;
            }
        });
        if (totalWeight === 0) {
            return null;
        }
        const average = sum / totalWeight;
        return { average, weight: totalWeight };
    },

    safeParseFloat(n, defaultValue) {
        let result;
        try {
            result = parseFloat(n);
        } catch (e) {
            console.error(e);
        }
        if (!result || Number.isNaN(result)) {
            result = defaultValue || 0;
        }
        return result;
    },

    digitsPrecision(n, precision) {
        const number = this.safeParseFloat(n);
        const pow = 10 ** precision;
        return Math.round(number * pow) / pow;
    },

    defaultPrecision(n) {
        return this.digitsPrecision(n, 10);
    },

    maxIntBy(list, key, defaultValue) {
        let value = defaultValue || 0;
        if (!_.isArray(list) || list.length === 0 || !_.isString(key)) {
            return value;
        }
        const maxRecord = _.maxBy(list, key);
        if (maxRecord && this.isNumber(maxRecord[key])) {
            value = parseInt(maxRecord[key], 10);
        }
        return value;
    },

    percentChange(from, to) {
        if (!this.isNumber(from) || !this.isNumber(to)) {
            return NaN;
        }
        const fromN = parseFloat(from);
        const toN = parseFloat(to);
        if (fromN === 0) {
            return 100;
        }
        return ((toN - fromN) * 100) / fromN;
    },

};
