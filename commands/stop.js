const { SlashCommandBuilder } = require('discord.js');
const Discord = require("discord.js");
const { getVoiceConnection } = require('@discordjs/voice');
const ffmpeg = require('ffmpeg');
const sleep = require('util').promisify(setTimeout);
const fs = require ('fs');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('stop')
		.setDescription('Stop Recording'),
	async execute(interaction) { 
    VoiceConnection = getVoiceConnection(interaction.guildId)
        
        if (VoiceConnection) {
            /* Send waiting message */
            await interaction.deferReply(); 
            /* wait for 5 seconds */
            await sleep(5000)

            /* disconnect the bot from voice channel */
            VoiceConnection.destroy();

            /* Remove voice state from collection */
            
            const filename = `./recordings/${interaction.user.id}`;

            /* Create ffmpeg command to convert pcm to mp3 */
            const process = new ffmpeg(`${filename}.pcm`);
            process.then(function (audio) {
                audio.fnExtractSoundToMP3(`${filename}.mp3`, async function (error, file) {
                    await interaction.editReply(
                        { content: '🔉 Here is your recording!', 
                         files: [`./recordings/${interaction.user.id}.mp3`] 
                        }
                    )
                    
                    //delete both files
                    fs.unlinkSync(`${filename}.pcm`)
                    fs.unlinkSync(`${filename}.mp3`)
                    
                });
            }, function (err) {
                /* handle error by sending error message to discord */
                return msg.edit(`❌ An error occurred while processing your recording: ${err.message}`);
            })
        }
    }
}