const discordTTS = require("discord-tts");
const { AudioPlayer, createAudioResource, StreamType, entersState, VoiceConnectionStatus, joinVoiceChannel } = require('@discordjs/voice');
let audioPlayer = new AudioPlayer();

module.exports = {
    name: "say",
    run: async (client, message, messi) => {
        if (!messi[1]) return message.reply("Tienes que escribir algo", { tts: true });
        else {
            try {
                var repite = message.author.username+" dice ";
                for (var j = 1; j < messi.length; j++) {
                    repite += messi[j] + " ";
                }
                const stream = discordTTS.getVoiceStream(repite);
                const audioResource = createAudioResource(stream, { inputType: StreamType.Arbitrary, inlineVolume: true });
                voiceConnection = joinVoiceChannel({
                    channelId: message.member.voice.channelId,
                    guildId: message.guildId,
                    adapterCreator: message.guild.voiceAdapterCreator,
                    selfDeaf: false
                });
                if (voiceConnection.status != VoiceConnectionStatus.Connected) {
                    voiceConnection = await entersState(voiceConnection, VoiceConnectionStatus.Connecting, 5_000);
                }
                if (voiceConnection.status === VoiceConnectionStatus.Connected) {
                    voiceConnection.subscribe(audioPlayer);
                    audioPlayer.play(audioResource);
                }
            }
            catch (error) {
                voiceConnection.destroy();
                return message.reply('Ocurrió un error: '+error);
            }
        }
    }
}