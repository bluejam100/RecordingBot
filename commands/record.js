const { SlashCommandBuilder, Collection } = require('discord.js');
const { entersState, joinVoiceChannel, VoiceConnectionStatus, EndBehaviorType } = require('@discordjs/voice');
const prism = require('prism-media');
const { createWriteStream } = require('node:fs');
const { pipeline } = require('node:stream');
const { getVoiceConnection } = require('@discordjs/voice');


module.exports = {
	data: new SlashCommandBuilder()
		.setName('record')
		.setDescription('Recording'),
    
	async execute(interaction) {
    const voiceChannel = interaction.member.voice.channel;
    
    VoiceConnection = getVoiceConnection(interaction.guildId)
    //If bot is not in voice channel
    if (!VoiceConnection){
        if (!voiceChannel) 
        {
        await interaction.reply('You must be in a voice channel to use this command!');
        return null;
      }
    }

  // Join VC  
    connection = joinVoiceChannel({
	channelId: voiceChannel.id,
	guildId: voiceChannel.guild.id,
    selfDeaf : false,
    selfMute: true,
	adapterCreator: voiceChannel.guild.voiceAdapterCreator
    });



    await entersState (connection, VoiceConnectionStatus.Ready, 20e3);
    const receiver = connection.receiver;

    receiver.speaking.on( 'start', (userId) => {
                if(userId !== interaction.user.id) return;
                /* create live stream to save audio */
                createListeningStream(receiver, userId );
            });

            /* Return success message */
            await interaction.reply(`🎙️ I am now recording ${voiceChannel.name}`);
    },
};


/* Function to write audio to file (from discord.js example) */
function createListeningStream(receiver, userId) {
  
    const opusStream = receiver.subscribe(userId, {
        end: {
            behavior: EndBehaviorType.AfterSilence,
            duration: 100,
        },
    });

    const oggStream = new prism.opus.OggLogicalBitstream({
        opusHead: new prism.opus.OpusHead({
            channelCount: 2,
            sampleRate: 48000,
        }),
        pageSizeControl: {
            maxPackets: 10,
        },
    });

    const filename = `./recordings/${userId}.pcm`;

    const out = createWriteStream(filename, { flags: 'a' });
    console.log(`👂 Started recording ${filename}`);

    pipeline(opusStream, oggStream, out, (err) => {
        if (err) {
            console.warn(`❌ Error recording file ${filename} - ${err.message}`);
        } else {
            console.log(`✅ Recorded ${filename}`);
        }
    });
}