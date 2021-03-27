const axios = require('axios')
const { Client, EVENT } = require('dogehouse.js');
let app = new Client()
require('dotenv').config()

app.connect(process.env.TOKEN, process.env.REFRESH_TOKEN).then(async () => {
	console.log('Connected!')
	app.rooms.join('2293ef87-2d6b-42f2-bcf9-68ee71438b1b')
});

let prefix = '!'

app.on(EVENT.NEW_CHAT_MESSAGE, async (message) => {
	if (message.content == prefix + 'ping') {
		await message.delete()
		message.reply('Pong!', { whispered: true, mentionUser: false })
	}

	if (message.content == prefix + 'statistics') {
		let data = await axios.get('https://api.dogehouse.xyz/v1/statistics')
		await message.delete()
		message.reply(`Total Online: ${data.data.totalOnline} | Total Rooms: ${data.data.totalRooms} | Total Bots Online: ${data.data.totalBotsOnline}`, { mentionUser: false })
	}

	if (message.content == prefix + 'userinfo') {
		await message.delete()
		let msgObj = [` :catJAM: Username: ${await message.author.username}  :catJAM: Bio: ${await message.author.bio}  :catJAM: Followers: ${await message.author.numFollowers}  :catJAM: Following: ${await message.author.numFollowing}  :catJAM: Avatar: `, { link: await message.author.avatarUrl }]
		await message.author.whisper(msgObj)
	}

	console.log(`${await message.author.username}: ${message.content}`);

});

app.on(EVENT.USER_JOINED_ROOM, user => {
	
	const publicWelcomeMessage = [ { mention : user.username }, " has joined the room!" ];
	const privateWelcomeMessage = [ "Welcome to the room ", { mention : user.username }, " I hope you enjoy your stay." ];

	app.bot.sendMessage(publicWelcomeMessage);

	user.whisper(privateWelcomeMessage);	
});

app.on(EVENT.USER_LEFT_ROOM, user => {
	app.bot.sendMessage(`@${user.username} has left the room!`)
});