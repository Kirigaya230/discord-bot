const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('admin-panel')
    .setDescription('Abre un panel interactivo de moderación')
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),

  async execute(interaction) {
    const embed = new EmbedBuilder()
      .setTitle('⚙️ Panel de Moderación')
      .setDescription('Selecciona una categoría en el menú de abajo.')
      .setColor(0xff0000);

    const menu = new StringSelectMenuBuilder()
      .setCustomId('admin-panel-menu')
      .setPlaceholder('📂 Selecciona una acción de moderación')
      .addOptions(
        { label: 'Kick', value: 'kick', emoji: '👢' },
        { label: 'Ban', value: 'ban', emoji: '🔨' },
        { label: 'Unban', value: 'unban', emoji: '✅' },
        { label: 'Timeout', value: 'timeout', emoji: '⏳' },
        { label: 'Remove Timeout', value: 'remove-timeout', emoji: '🔓' },
        { label: 'Purge', value: 'purge', emoji: '🧹' }
      );

    const row = new ActionRowBuilder().addComponents(menu);

    await interaction.reply({ embeds: [embed], components: [row], ephemeral: true });
  },
};
