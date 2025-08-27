const fs = require('node:fs');
const path = require('node:path');
const {Client, Collection, GatewayIntentBits, EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder, UserSelectMenuBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, PermissionsBitField} = require('discord.js');
require('dotenv').config();

console.log('🔁 Iniciando bot...');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildPresences, // Para /perfil
    GatewayIntentBits.GuildMembers,   // Para moderación
    GatewayIntentBits.GuildMessages,  // Para /purge
    GatewayIntentBits.MessageContent, // Para leer mensajes si es necesario
  ],
});

// ======================
// 📂 CARGA DE COMANDOS
// ======================
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

// ======================
// 📂 HANDLER COMANDOS
// ======================
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

// ==============================
// 📂 ADMIN PANEL INTERACTIVO
// ==============================
client.on('interactionCreate', async (interaction) => {
  // --- MENÚ PRINCIPAL ---
  if (interaction.isStringSelectMenu() && interaction.customId === 'admin_action') {
    const action = interaction.values[0];

    // Acciones que requieren seleccionar usuario
    if (['kick', 'ban', 'timeout', 'remove-timeout'].includes(action)) {
      const row = new ActionRowBuilder().addComponents(
        new UserSelectMenuBuilder()
          .setCustomId(`admin_${action}`)
          .setPlaceholder('👤 Selecciona un usuario')
          .setMinValues(1)
          .setMaxValues(1)
      );

      return interaction.update({
        content: `👉 Selecciona el usuario para **${action}**:`,
        embeds: [],
        components: [row],
      });
    }

    // Unban con modal
    if (action === 'unban') {
      const modal = new ModalBuilder()
        .setCustomId('admin_unban_modal')
        .setTitle('🔨 Desbanear Usuario');

      const userIdInput = new TextInputBuilder()
        .setCustomId('unban_userid')
        .setLabel('ID del usuario a desbanear')
        .setStyle(TextInputStyle.Short)
        .setPlaceholder('Ejemplo: 123456789012345678')
        .setRequired(true);

      modal.addComponents(new ActionRowBuilder().addComponents(userIdInput));
      return interaction.showModal(modal);
    }

    // Purge con modal
    if (action === 'purge') {
      const modal = new ModalBuilder()
        .setCustomId('admin_purge_modal')
        .setTitle('🧹 Eliminar Mensajes');

      const amountInput = new TextInputBuilder()
        .setCustomId('purge_amount')
        .setLabel('Cantidad de mensajes a eliminar (máx 100)')
        .setStyle(TextInputStyle.Short)
        .setPlaceholder('Ejemplo: 10')
        .setRequired(true);

      const userIdInput = new TextInputBuilder()
        .setCustomId('purge_userid')
        .setLabel('ID del usuario (opcional)')
        .setStyle(TextInputStyle.Short)
        .setPlaceholder('Deja vacío para borrar mensajes generales')
        .setRequired(false);

      modal.addComponents(
        new ActionRowBuilder().addComponents(amountInput),
        new ActionRowBuilder().addComponents(userIdInput),
      );

      return interaction.showModal(modal);
    }
  }

  // --- SELECCIÓN DE USUARIO ---
  if (interaction.isUserSelectMenu() && interaction.customId.startsWith('admin_')) {
    const action = interaction.customId.replace('admin_', '');
    const user = interaction.users.first();
    const member = await interaction.guild.members.fetch(user.id);

    try {
      if (action === 'kick') {
        await member.kick();
        return interaction.update({ content: `👢 ${user.tag} fue expulsado.`, components: [] });
      }
      if (action === 'ban') {
        await member.ban();
        return interaction.update({ content: `🔨 ${user.tag} fue baneado.`, components: [] });
      }
      if (action === 'timeout') {
        await member.timeout(10 * 60 * 1000);
        return interaction.update({ content: `⏳ ${user.tag} está en timeout 10 min.`, components: [] });
      }
      if (action === 'remove-timeout') {
        await member.timeout(null);
        return interaction.update({ content: `🔓 Timeout de ${user.tag} eliminado.`, components: [] });
      }
    } catch (error) {
      console.error(error);
      return interaction.update({ content: `❌ Error al aplicar la acción en ${user.tag}.`, components: [] });
    }
  }

  // --- MODAL UNBAN ---
  if (interaction.isModalSubmit() && interaction.customId === 'admin_unban_modal') {
    const userId = interaction.fields.getTextInputValue('unban_userid');
    try {
      await interaction.guild.members.unban(userId);
      await interaction.reply({ content: `✅ Usuario <@${userId}> desbaneado.`, ephemeral: true });
    } catch (error) {
      console.error(error);
      await interaction.reply({ content: '❌ No pude desbanear. Verifica el ID.', ephemeral: true });
    }
  }

  // --- MODAL PURGE ---
  if (interaction.isModalSubmit() && interaction.customId === 'admin_purge_modal') {
    const amount = parseInt(interaction.fields.getTextInputValue('purge_amount'));
    const userId = interaction.fields.getTextInputValue('purge_userid');

    if (isNaN(amount) || amount < 1 || amount > 100) {
      return interaction.reply({ content: '❌ Debes especificar un número entre 1 y 100.', ephemeral: true });
    }

    try {
      const messages = await interaction.channel.messages.fetch({ limit: amount });
      let deleted;

      if (userId) {
        deleted = await interaction.channel.bulkDelete(
          messages.filter((m) => m.author.id === userId),
          true
        );
        await interaction.reply({ content: `🧹 Eliminados ${deleted.size} mensajes de <@${userId}>.`, ephemeral: true });
      } else {
        deleted = await interaction.channel.bulkDelete(messages, true);
        await interaction.reply({ content: `🧹 Eliminados ${deleted.size} mensajes.`, ephemeral: true });
      }
    } catch (error) {
      console.error(error);
      await interaction.reply({ content: '❌ Ocurrió un error al eliminar mensajes.', ephemeral: true });
    }
  }
});

client.login(process.env.TOKEN);
