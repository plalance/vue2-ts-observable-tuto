/**
 * Provide methods to deal with type elements
 */
exports.TypeUtils = {
    // Returns if a value is an object
    isObject: function (value) {
        return value && typeof value === 'object' && value.constructor === Object;
    },
    /**
     * Check whether value is a number
     * @param n
     * @returns {boolean}
     */
    isNumber: function (obj) {
        return !isNaN(parseFloat(obj)) && isFinite(obj);
    },
    /**
     * Check whether value is a function
     * @param obj
     * @returns {boolean}
     */
    isFunction: function (obj) {
        return (typeof (obj) == 'function');
    },
    // Returns if a value is a string
    isString: function (value) {
        return typeof value === 'string' || value instanceof String;
    },
    // ----------------------------------------------------------------------
    /**
     * Check whether obj is Empty depending of its type.
     * Results :
     *         []        true, empty array
     *         {}        true, empty object
     *         null      true
     *         undefined true
     *         ""        true, empty string
     *         ''        true, empty string
     *         0         false, number
     *         true      false, boolean
     *         false     false, boolean
     *         Date      false
     *         function  false
     * @param obj object
     */
    isEmpty: function (obj) {
        if (obj === undefined)
            return true;
        if (typeof (obj) == 'function' || typeof (obj) == 'number' || typeof (obj) == 'boolean' || Object.prototype.toString.call(obj) === '[object Date]')
            return false;
        if (obj == null || obj.length === 0)
            return true;
        // empty object
        if (typeof (obj) == 'object') {
            for (var f in obj)
                return false;
            return true;
        }
        return false;
    }
};
