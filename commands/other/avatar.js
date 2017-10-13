const { Command } = require('discord.js-commando');
const snekfetch = require('snekfetch');

module.exports = class AvatarCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'avatar',
			aliases: ['profile-picture', 'profile-pic'],
			group: 'other',
			memberName: 'avatar',
			description: 'Responds with a user\'s avatar.',
			clientPermissions: ['ATTACH_FILES'],
			args: [
				{
					key: 'user',
					prompt: 'Which user would you like to get the avatar of?',
					type: 'user',
					default: ''
				}
			]
		});
	}

	async run(msg, { user }) {
		if (!user) user = msg.author;
		if (!user.avatar) return msg.say('This user has no avatar.');
		const format = user.avatar.startsWith('a_') ? 'gif' : 'png';
		const avatarURL = user.avatarURL({
			format,
			size: 512
		});
		try {
			const { body } = await snekfetch.get(avatarURL);
			return msg.say({ files: [{ attachment: body, name: `avatar.${format}` }] });
		} catch (err) {
			return msg.say(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}
};
