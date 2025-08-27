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
      await interaction.reply({ content: `👢 ${user.tag} fue expulsado del servidor.`, ephemeral: true });

    } catch (err) {
      console.error(err);
      await interaction.reply({ content: '❌ No pude expulsar a ese usuario.', ephemeral: true });

    }
  },
};
