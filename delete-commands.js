const { REST } = require('@discordjs/rest');
const { Routes } = require('discord.js');

const clientId = process.env['clientId']
const guildId = process.env['guildId']
const token = process.env['token']


const rest = new REST({ version: '10' }).setToken(token);

rest.put(Routes.applicationGuildCommands(clientId, guildId), { body: [] })
	.then(() => console.log('Successfully deleted all guild commands.'))
	.catch(console.error);