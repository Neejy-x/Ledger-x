
const validate = (schema) => (req, res, next) => {
    const valid = schema.parse(req.body)
    req.body = valid
    next()
}

module.exports = validate