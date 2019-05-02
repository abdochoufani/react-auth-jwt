const router = require('express').Router()


//@Route GET  api/users/test
//@description test users request
//@access Public
router.get('/test', (req, res) => {
    res.json({ msg: 'test users works' })
})


module.exports = router