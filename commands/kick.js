const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('kick')
    .setDescription('Expulsa a un usuario del servidor.')
    .addUserOption(option =>
      option.setName('usuario')
        .setDescription('Usuario a expulsar')
        .setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers), // 👈 solo quienes tengan permiso

  async execute(interaction) {
    const user = interaction.options.getUser('usuario');
    const member = await interaction.guild.members.fetch(user.id);

    try {
      await member.kick();
      await interaction.reply(`👢 ${user.tag} fue expulsado del servidor.`);
    } catch (err) {
      console.error(err);
      await interaction.reply('❌ No pude expulsar a ese usuario.');
    }
  },
};
