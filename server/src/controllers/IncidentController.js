const { validationResult } = require('express-validator')
const crypto = require('crypto')
const Incident = require('../database/models/incident')
const NGO = require('../database/models/ngo')
const incident = require('../database/models/incident')

module.exports = {
	async create(req, res) {
		const { errors } = validationResult(req)
		if (errors.length) return res.status(422).json(errors)

		const { title, description, value } = req.body
		const id = crypto.randomBytes(4).toString('hex')
		const authId = req.headers.authorization

		if (!authId) return res.status(403).json({
			error: 'you are not logged in'
		})
		
		try {
			if (!(await NGO.find({ id: authId })).length) {
				return res.status(404).json({
					error: `NGO with id ${authId} not found`
				})
			}
		} catch (error) {
			return res.json({ error: error })
		}
		
		let incident = null

		try {
			incident = await Incident.create({
				id: id,
				title: title,
				description: description,
				value: Number(value),
				ngo_owner: await NGO.findOne({ id: authId })
			})
		} catch (error) {
			return res.json({ error: error })
		}

		try {
			NGO.findOneAndUpdate({
				id: authId
			}, {
				$push: {
					incidents: incident
				}
			}, error => {
				if (error) throw error
			})
		} catch (error) {
			return res.json({ error: error })
		}

		return res.json({ id: incident['id']} )
	},
	
	async index(req, res) {
		const { page = 1 } = req.query // get page param value; set 1 if any page param exist
		const count = await incident.count() // counts the amount of incidents existent
		const limPage = 5 // amount of registers per page
		let incidents = null

		try {
			incidents = await Incident
				.find() // get all incidents from database
				.populate({ // join 'ngo' columns with 'incident' specific columns
					path: 'ngo_owner',
					select: ['name', 'email', 'whatsapp', 'city', 'state']
				})
				.limit(limPage) // limit return registers
				.skip((page - 1) * limPage) // set registers to be presented
		} catch (error) {
			return res.json({ error: error })
		}
		
		/* when making pagination, the amount of items in database
    is sent to front-end through the response's header */
		res.header('X-Total-Count', count['count(*)'])
			
		return res.json(incidents)
	},

	async show(req, res) {
		const { errors } = validationResult(req)
		if (errors.length) return res.status(422).json(errors)
		
		const id = req.params.id

		try {
			Incident.findOne({ id: id }, (error, incident) => {
				if (error) throw error
				return res.json(incident)
			})
		} catch (error) {
			return res.json({ error: error })
		}
	},

	async update(req, res) {
		const { errors } = validationResult(req)
		if (errors.length) return res.status(422).json(errors)

		const { id, title, description, value } = req.body

		try {
			Incident.findOneAndUpdate({
				id: id
			}, {
				title: title,
				description: description,
				value: value,
				created_at: (await Incident.findOne({ id: id }))['created_at'],
				updated_at: Date.now()
			}, error => {
				if (error) throw error
				return res.json({ updated: true })
			})
		} catch (error) {
			return res.json({ error: error })
		}
	},

	async delete(req, res) {
		const errors = validationResult(req)['errors']
		if (errors.length) return res.status(422).json(errors)

		const { id } = req.params
		const authId = req.headers.authorization

		const incident = await Incident.findOne({ id: id })

		if (!incident) return res.status(404).json({ error: `NGO with id '${id}' not found` })

		if ((id !== authId) || (incident.id !== authId)) return res.status(401).json({
			error: 'Unauthorized'
		})

		try {
			Incident.deleteOne({ id: incident.id }, error => {
				if (error) throw error
			})
		} catch (error) {
			res.json(error)
		}
    
		return res.status(410).json({ id: id })
	}
}