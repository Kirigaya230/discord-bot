const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder, PermissionsBitField } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('admin-panel')
    .setDescription('📋 Panel interactivo de moderación')
    .setDefaultMemberPermissions(PermissionsBitField.Flags.Administrator), // Solo admins

  async execute(interaction) {
    // Embed bonito
    const embed = new EmbedBuilder()
      .setColor(0xff0000)
      .setTitle('⚙️ Panel de Moderación')
      .setDescription('Usa el menú de abajo para seleccionar una acción de moderación.')
      .setFooter({ text: `Solicitado por ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL() })
      .setTimestamp();

    // Menú de selección
    const menu = new StringSelectMenuBuilder()
      .setCustomId('admin_action')
      .setPlaceholder('👉 Selecciona una acción...')
      .addOptions(
        { label: '👢 Kick', value: 'kick', description: 'Expulsar a un usuario del servidor' },
        { label: '🔨 Ban', value: 'ban', description: 'Banear a un usuario del servidor' },
        { label: '✅ Unban', value: 'unban', description: 'Desbanear a un usuario por ID' },
        { label: '⏳ Timeout', value: 'timeout', description: 'Silenciar temporalmente a un usuario' },
        { label: '🔓 Remove Timeout', value: 'remove-timeout', description: 'Quitar timeout a un usuario' },
        { label: '🧹 Purge', value: 'purge', description: 'Eliminar mensajes de un canal o usuario' },
      );

    const row = new ActionRowBuilder().addComponents(menu);

    // Responder solo al moderador
    await interaction.reply({
      embeds: [embed],
      components: [row],
      ephemeral: true,
    });
  },
};
