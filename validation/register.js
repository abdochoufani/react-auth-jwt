const validator = require('validator')
const isEmpty = require('./is-empty')

module.exports = function validateRegisterInput(data) {
    let errors = {}
    if (!validator.islength(data.name, { min: 2, max: 30 })) {
        error.name = "Name must be between 2 and 30 characters"
    }
    return {
        errors,
        isValid: isEmpty(errors)
    }
}