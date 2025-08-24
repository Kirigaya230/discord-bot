const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('unban')
    .setDescription('Desbanea a un usuario usando su ID.')
    .addStringOption(option =>
      option.setName('idusuario')
        .setDescription('ID del usuario a desbanear')
        .setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers), // 👈 solo admins con permiso de ban

  async execute(interaction) {
    const userId = interaction.options.getString('idusuario');

    try {
      await interaction.guild.members.unban(userId);
      await interaction.reply(`✅ El usuario con ID \`${userId}\` fue desbaneado.`);
    } catch (err) {
      console.error(err);
      await interaction.reply('❌ No pude desbanear a ese usuario. Verifica que el ID sea correcto.');
    }
  },
};
