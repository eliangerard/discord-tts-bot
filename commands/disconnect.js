module.exports = {
    name: "disconnect",
    aliases:['salte','saquese','dc','fuckoff'],
    run: async (client, message, messi) => {
        try {
            voiceConnection.destroy();
            return message.reply('aylavemos');
          }
          catch (error) {
            return message.reply('mmm, no estaba en ningún canal');
          }
    }
}