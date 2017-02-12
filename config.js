module.exports = {
	discord: {
		token: 'YOUR_BOT_TOKEN_HERE',
		command: ['!rep', '!reputation']
	},
	colours: {
		neutral: 0,
		positive: 3066993,
		negative: 15158332
	},
	emotes: {
		upvote: ['upvote'],
		downvote: ['downvote']
	},
	db: {
		type: 'sqlite',
		sqlite: {
			memory: false,
			file: 'rep.sqlite3'
		}
	}
};