const router = require('express').Router();
const User = require('../../models/User');
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const keys = require('../../config/keys');
const jwt = require('jsonwebtoken');
const passport = require('passport');

//@Route GET  api/users/test
//@description test users request
//@access Public
router.get('/test', (req, res) => {
	res.json({ msg: 'test users works' });
});

//@Route GET  api/users/register
//@description register users request
//@access Public
router.post('/register', (req, res) => {
	User.findOne({ email: req.body.email }).then((user) => {
		if (user) {
			return res.status(400).json({ email: 'email already exists' });
		} else {
			const avatar = gravatar.url(req.body.email, {
				s: '200',
				r: 'pg',
				d: 'mm'
			});
			const newUser = new User({
				name: req.body.name,
				email: req.body.email,
				avatar,
				password: req.body.password
			});

			bcrypt.genSalt(10, (err, salt) => {
				bcrypt.hash(req.body.password, salt, (err, hash) => {
					if (err) throw err;
					newUser.password = hash;
					newUser
						.save()
						.then((user) => {
							res.json(user);
						})
						.catch((err) => {
							console.log(err);
						});
				});
			});
		}
	});
});

//@Route GET  api/users/login
//@description login users request / returning jwt
//@access Public

router.post('/login', (req, res) => {
	const email = req.body.email;
	const password = req.body.password;

	//find user
	User.findOne({ email })
		.then((user) => {
			if (!user) {
				return res.status(404).json({ email: 'user not found' });
			}
			//check password
			bcrypt
				.compare(password, user.password)
				.then((isMatched) => {
					if (isMatched) {
						//create jwt payload
						const payload = {
							id: user.id,
							name: user.name,
							avatar: user.avatar
						};

						//sign token
						jwt.sign(payload, keys.secretOrkeys, { expiresIn: 36000 }, (err, token) => {
							if (err) res.send(err);
							else
								res.json({
									success: true,
									token: 'Bearer ' + token
								});
						});
					} else {
						return res.status(400).json({ password: 'password is incorrect' });
					}
				})
				.catch((err) => {
					res.json({ msg: 'error 101' });
				});
		})
		.catch((err) => {
			res.json({ msg: 'error 102' });
		});
});

//@Route GET  api/users/current
//@description return current user
//@access Private
router.get('/current', passport.authenticate('jwt', { session: false }), (req, res) => {
	res.json(req.user);
});

module.exports = router;
