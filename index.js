const fs = require('fs');
const { Intents } = require("discord.js");
const { DisTube } = require("distube");
const Discord = require("discord.js");
const config = require("./config.json")

const client = new Discord.Client({
  intents: [
    Intents.FLAGS.GUILD_MEMBERS,
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.GUILD_VOICE_STATES,
    Intents.FLAGS.GUILD_BANS,
  ],
  restRequestTimeout: 30000,
  shards: "auto",
});
client.config = require("./config.json")
client.commands = new Discord.Collection()
client.aliases = new Discord.Collection()

client.distube = new DisTube(client, {
  searchSongs: 10,
  emitNewSongOnly: true
})

fs.readdir("./commands/", (err, files) => {
  if (err) return console.log("No se encontraron comandos")
  const jsFiles = files.filter(f => f.split(".").pop() === "js")
  if (jsFiles.length <= 0) return console.log("No se encontraron comandos")
  jsFiles.forEach(file => {
    const cmd = require(`./commands/${file}`)
    console.log(`Comando ${file} cargado`)
    client.commands.set(cmd.name, cmd)
    if (cmd.aliases) cmd.aliases.forEach(alias => client.aliases.set(alias, cmd.name))
  })
})

client.on('ready', function () {
  client.user.setActivity("a los otros bots mecos", {
    type: "LISTENING"
  });
  console.log(`${client.user.tag} está listo`)
  i = 0;
});

client.on("messageCreate", async (message) => {
  //const prefix = config.prefix
  //if(!message.content.startsWith(prefix))return
  var messi = message.content.split(' ');
  const command = messi[0].toLowerCase()
  const cmd = client.commands.get(command) || client.commands.get(client.aliases.get(command))
  if (!cmd) return
  if (cmd.inVoiceChannel && !message.member.voice.channel) return message.channel.send(`${client.emotes.error} | Tienes que estar en un canal de voz`)
  try {
    cmd.run(client, message, messi)
  } catch (e) {
    console.error(e)
    message.reply(`Error: ${e}`)
  }
});

client.distube.on("empty", channel => {
  const embed = new Discord.MessageEmbed()
    .setTitle(client.emotes.sad + " Soledad")
    .setColor("#1111EE")
    .setDescription("No hay nadie en el canal de voz, saliendo...")
    .setTimestamp()
    .setFooter('Memer', botUrl)
  message.channel.send({ embeds: [embed] })
})

client.login(config.token);