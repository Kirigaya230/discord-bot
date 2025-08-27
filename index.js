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


const { 
  ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder,
  PermissionsBitField
} = require('discord.js');

client.on('interactionCreate', async interaction => {
  // =========================
  // 📌 MENÚ DEL ADMIN PANEL
  // =========================
  if (interaction.isStringSelectMenu() && interaction.customId === 'admin-panel-menu') {
    const opcion = interaction.values[0];

    // FUNCIONES PARA CREAR MODALS
    const crearModal = (id, titulo, inputs) => {
      const modal = new ModalBuilder().setCustomId(id).setTitle(titulo);
      modal.addComponents(inputs.map(input => new ActionRowBuilder().addComponents(input)));
      return modal;
    };

    // Inputs rápidos
    const inputUsuario = (id, label, obligatorio = true) =>
      new TextInputBuilder()
        .setCustomId(id)
        .setLabel(label)
        .setStyle(TextInputStyle.Short)
        .setRequired(obligatorio);

    const inputMotivo = (id = 'reason') =>
      new TextInputBuilder()
        .setCustomId(id)
        .setLabel('Motivo (opcional)')
        .setStyle(TextInputStyle.Paragraph)
        .setRequired(false);

    const inputTiempo = () =>
      new TextInputBuilder()
        .setCustomId('duration')
        .setLabel('Duración en minutos')
        .setStyle(TextInputStyle.Short)
        .setRequired(true);

    const inputCantidad = () =>
      new TextInputBuilder()
        .setCustomId('amount')
        .setLabel('Cantidad de mensajes a eliminar')
        .setStyle(TextInputStyle.Short)
        .setRequired(true);

    // Abrimos modal según la opción
    if (opcion === 'kick')
      return interaction.showModal(crearModal('kickModal', '👢 Expulsar Usuario', [inputUsuario('kickUser', 'Usuario o ID'), inputMotivo('kickReason')]));

    if (opcion === 'ban')
      return interaction.showModal(crearModal('banModal', '🔨 Banear Usuario', [inputUsuario('banUser', 'Usuario o ID'), inputMotivo('banReason')]));

    if (opcion === 'unban')
      return interaction.showModal(crearModal('unbanModal', '✅ Desbanear Usuario', [inputUsuario('unbanUser', 'ID de Usuario')]));

    if (opcion === 'timeout')
      return interaction.showModal(crearModal('timeoutModal', '⏳ Timeout', [inputUsuario('timeoutUser', 'Usuario o ID'), inputTiempo(), inputMotivo('timeoutReason')]));

    if (opcion === 'remove-timeout')
      return interaction.showModal(crearModal('removeTimeoutModal', '🔓 Quitar Timeout', [inputUsuario('removeTimeoutUser', 'Usuario o ID')]));

    if (opcion === 'purge')
      return interaction.showModal(crearModal('purgeModal', '🧹 Purgar Mensajes', [inputCantidad(), inputUsuario('purgeUser', 'Usuario o ID (opcional)', false)]));
  }

  // =========================
  // 📌 PROCESAR MODALS
  // =========================
  if (interaction.isModalSubmit()) {
    try {
      // ---- KICK ----
      if (interaction.customId === 'kickModal') {
        const userId = interaction.fields.getTextInputValue('kickUser').replace(/[<@!>]/g, '');
        const reason = interaction.fields.getTextInputValue('kickReason') || 'Sin motivo';
        const member = await interaction.guild.members.fetch(userId);
        await member.kick(reason);
        return interaction.reply({ content: `✅ ${member.user.tag} fue expulsado. Razón: ${reason}`, ephemeral: true });
      }

      // ---- BAN ----
      if (interaction.customId === 'banModal') {
        const userId = interaction.fields.getTextInputValue('banUser').replace(/[<@!>]/g, '');
        const reason = interaction.fields.getTextInputValue('banReason') || 'Sin motivo';
        const member = await interaction.guild.members.fetch(userId);
        await interaction.guild.members.ban(member, { reason });
        return interaction.reply({ content: `✅ ${member.user.tag} fue baneado. Razón: ${reason}`, ephemeral: true });
      }

      // ---- UNBAN ----
      if (interaction.customId === 'unbanModal') {
        const userId = interaction.fields.getTextInputValue('unbanUser').replace(/[<@!>]/g, '');
        await interaction.guild.members.unban(userId);
        return interaction.reply({ content: `✅ Usuario con ID ${userId} fue desbaneado.`, ephemeral: true });
      }

      // ---- TIMEOUT ----
      if (interaction.customId === 'timeoutModal') {
        const userId = interaction.fields.getTextInputValue('timeoutUser').replace(/[<@!>]/g, '');
        const minutes = parseInt(interaction.fields.getTextInputValue('duration'));
        const reason = interaction.fields.getTextInputValue('timeoutReason') || 'Sin motivo';
        const member = await interaction.guild.members.fetch(userId);
        const ms = minutes * 60 * 1000;
        await member.timeout(ms, reason);
        return interaction.reply({ content: `✅ ${member.user.tag} está en timeout por ${minutes} minutos.`, ephemeral: true });
      }

      // ---- REMOVE TIMEOUT ----
      if (interaction.customId === 'removeTimeoutModal') {
        const userId = interaction.fields.getTextInputValue('removeTimeoutUser').replace(/[<@!>]/g, '');
        const member = await interaction.guild.members.fetch(userId);
        await member.timeout(null);
        return interaction.reply({ content: `✅ Timeout removido para ${member.user.tag}`, ephemeral: true });
      }

      // ---- PURGE ----
      if (interaction.customId === 'purgeModal') {
        const amount = parseInt(interaction.fields.getTextInputValue('amount'));
        const userInput = interaction.fields.getTextInputValue('purgeUser');

        const messages = await interaction.channel.messages.fetch({ limit: amount });
        let deleted;

        if (userInput) {
          const userId = userInput.replace(/[<@!>]/g, '');
          deleted = messages.filter(m => m.author.id === userId).first(amount);
        } else {
          deleted = messages;
        }

        await interaction.channel.bulkDelete(deleted, true);
        return interaction.reply({ content: `✅ Eliminados ${deleted.size || deleted.length} mensajes.`, ephemeral: true });
      }

    } catch (err) {
      console.error(err);
      return interaction.reply({ content: '❌ Error al ejecutar la acción.', ephemeral: true });
    }
  }
});


client.login(process.env.TOKEN);
