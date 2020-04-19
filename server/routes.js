let router = require('express').Router()

// initialized express router
router.get('/', (req, res) => {
  res.json({
    status: 'Api working',
    message: 'Test'
  })
})

// import feature controller
const featureController = require('./controllers/featureController')

router.route('/features')
  .get(featureController.list)

// expose endpoints
module.exports = router