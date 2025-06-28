const fs = require('node:fs');
const path = require('node:path');
const { Client, Collection, GatewayIntentBits } = require('discord.js');
require('dotenv').config();

console.log('🔁 Iniciando bot...');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildPresences, // Para /perfil
    GatewayIntentBits.GuildMembers    // Para futuras funciones
  ]
});

client.commands = new Collection();
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(f => f.endsWith('.js'));

for (const file of commandFiles) {
  const cmdPath = path.join(commandsPath, file);
  const command = require(cmdPath);
  if ('data' in command && 'execute' in command) {
    client.commands.set(command.data.name, command);
  } else {
    console.warn(`[ADVERTENCIA] El comando en ${file} está mal formado.`);
  }
}

client.once('ready', () => {
  console.log(`✅ Bot conectado como ${client.user.tag}`);
});

client.on('interactionCreate', async interaction => {
  if (!interaction.isChatInputCommand()) return;

  const command = client.commands.get(interaction.commandName);
  if (!command) return;

  try {
    await command.execute(interaction);
  } catch (err) {
    console.error(err);
    if (interaction.deferred || interaction.replied) {
      interaction.editReply('❌ Error interno al ejecutar el comando.');
    } else {
      interaction.reply({ content: '❌ Error interno al ejecutar el comando.', ephemeral: true });
    }
  }
});

client.login(process.env.TOKEN);
