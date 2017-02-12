# DiscordREP v1.0.0

Tracks discord reputation via reactions.

## Installation

Using npm:
```shell
npm install
npm start
```

## Configuration

config.js
```js
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
```

Parameters:
- discord
  - token - String - Discord bot token
  - command - Array - Commands to view reputation
- colours
  - neutral - Discord Colour Code - Balanced total karma
  - positive - Discord Colour Code - Positive total karma
  - negative - Discord Colour Code - Negative total karma
- emotes
  - upvote - Array - Upvote reactions
  - downvote - Array - Downvote reactions
 - db
   - type - String - Database type, options:
     - `sqlite` - Sqlite3 database
   - sqlite
     - memory - Boolean - Should sqlite store data in memory
     - file - String - If not storing in memory, where should data be saved
