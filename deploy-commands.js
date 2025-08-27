const fs = require('node:fs');
const path = require('node:path');
const { REST, Routes } = require('discord.js');
require('dotenv').config();

const commands = [];
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

// Cargar todos los comandos
for (const file of commandFiles) {
  const filePath = path.join(commandsPath, file);
  const command = require(filePath);
  if ('data' in command && 'execute' in command) {
    commands.push(command.data.toJSON());
  } else {
    console.log(`[ADVERTENCIA] El comando en ${filePath} está mal formado.`);
  }
}

const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

(async () => {
  try {
    console.log('🔁 Registrando comandos (globales)…');

    await rest.put(
      Routes.applicationCommands(process.env.CLIENT_ID),
      { body: commands },
    );

    console.log('✅ ¡Todos los comandos fueron registrados correctamente!');
  } catch (error) {
    console.error('❌ Error al registrar:', error);
  }
})();
