'use strict';
const Discordie = require('discordie');
const client = new Discordie();
const config = require('./config');
const db = require('./db/' + config.db.type);

client.connect({
	token: config.discord.token
});

client.Dispatcher.on('GATEWAY_READY', e => {
	console.log('Connected as: ' + client.User.username);
});

client.Dispatcher.on('MESSAGE_CREATE', e => {
	for(let x in config.discord.command) {
		let cmd = config.discord.command[x];
		if(e.message.content.substring(0, cmd.length) == cmd) {
			var mentions = e.message.mentions;
			if(e.message.mentions.length == 0) {
				mentions.push(e.message.author);
			}
			for(let y in mentions) {
				db.fetch(mentions[y].id)
				.then(function(rep) {
					let total = rep.up - rep.down;
					if(total == 0) {
						var colour = config.colours.neutral;
					} else if(total > 0) {
						var colour = config.colours.positive;
					} else if(total < 0) {
						var colour = config.colours.negative;
					}
					e.message.channel.sendMessage('', false, {
						color: colour,
						title: 'Karma for ' + mentions[y].username,
						fields: [
							{ name: 'Upvotes', value: rep.up, inline: true },
							{ name: 'Downvotes', value: rep.down, inline: true },
							{ name: 'Karma', value: rep.up - rep.down, inline: true }
						]
					});
				})
				.catch(function(err) {
					console.error(err);
					e.message.channel.sendMessage(':warning: Failed to fetch reputation!');
				});
			}
			break;
		}
	}
});

client.Dispatcher.on('MESSAGE_REACTION_ADD', e => {
	if(config.emotes.upvote.indexOf(e.data.emoji.name) != -1) {
		db.up(e.message.author.id, 1)
			.then(function() {
				console.log(e.user.username + '\t\t Gained upvote');
			})
			.catch(function(err) {
				console.error('Error while giving upvote:', err);
			});
	}
	if(config.emotes.downvote.indexOf(e.data.emoji.name) != -1) {
		db.down(e.message.author.id, 1)
			.then(function() {
				console.log(e.user.username + '\t\t Gained downvote');
			})
			.catch(function(err) {
				console.error('Error while giving downvote:', err);
			});
	}
});

client.Dispatcher.on('MESSAGE_REACTION_REMOVE', e => {
	if(config.emotes.upvote.indexOf(e.data.emoji.name) != -1) {
		db.up(e.message.author.id, -1)
			.then(function() {
				console.log(e.user.username + '\t\t Lost upvote');
			})
			.catch(function(err) {
				console.error('Error while removing upvote:', err);
			})
	}
	if(config.emotes.downvote.indexOf(e.data.emoji.name) != -1) {
		db.down(e.message.author.id, -1)
			.then(function() {
				console.log(e.user.username + '\t\t Lost downvote');
			})
			.catch(function(err) {
				console.error('Error while removing downvote:', err);
			})
	}
});