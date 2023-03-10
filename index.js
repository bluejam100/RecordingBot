//Required Modules
const { entersState, joinVoiceChannel, VoiceConnectionStatus, EndBehaviorType } = require('@discordjs/voice');
const { createWriteStream } = require('node:fs');
const prism = require('prism-media');
const { pipeline } = require('node:stream');
const ffmpeg = require('ffmpeg');
const sleep = require('util').promisify(setTimeout);
const fs = require ('fs');
const path = require('node:path');
const { Client, Collection, GatewayIntentBits, MessageAttachment } = require('discord.js') 

//Token
const mySecret = process.env['token']



// Create a new client instance
const client = new Client({ 
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.GuildMessages
    ] 

});

client.commands = new Collection();
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const filePath = path.join(commandsPath, file);
	const command = require(filePath);
    client.commands.set(command.data.name, command);
}


// When the client is ready, run this code (only once)
client.once('ready', () => {
	console.log('Ready!');
});

client.on('interactionCreate', async interaction => {
	if (!interaction.isChatInputCommand()) return;

	const command = client.commands.get (interaction.commandName);

	if (!command) return;

    try{
        await command.execute (interaction);
    } catch (error){
        console.error(error);
        await interaction.reply({content:'There was an error while executing this command!', ephemeral: true})
    }
});





// Login to Discord with your client's token
client.login(mySecret);