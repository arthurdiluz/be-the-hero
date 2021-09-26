const router = require('express')()
const { body } = require('express-validator')

// import controllers
const ngoController = require('./controllers/NgoController')
const IncidentController = require('./controllers/IncidentController')

// parameter requirements
const NgoBodyParams = [
	body('name')
		.isString()
		.isLength({
			min: 4,
			max: 32
		}),
	body('email')
		.isEmail()
		.isLength({
			max: 32
		}),
	body('password')
		.isString()
		.isLength({
			min: 8, max: 32
		}),
	body('whatsapp')
		.isMobilePhone()
		.isNumeric()
		.isLength({
			max: 16
		}),
	body('city')
		.isString()
		.isLength({
			min: 2,
			max: 32
		}),
	body('state')
		.isString()
		.isAlpha()
		.isLength(2)
]

// setup URIs (paths)
router.post('/ngo', NgoBodyParams, ngoController.create)
router.get('/ngos', ngoController.index)
router.get('/ngo/:id', ngoController.show)
router.patch('/ngo', NgoBodyParams, ngoController.update)
router.delete('/ngo/:id', ngoController.delete)

// export router with paths
module.exports = router
