const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ban')
    .setDescription('Banea a un usuario del servidor.')
    .addUserOption(option =>
      option.setName('usuario')
        .setDescription('Usuario a banear')
        .setRequired(true))
    .addStringOption(option =>
      option.setName('razon')
        .setDescription('Razón del baneo')
        .setRequired(false))
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers), // 👈 solo admins/mods con permiso de ban

  async execute(interaction) {
    const user = interaction.options.getUser('usuario');
    const razon = interaction.options.getString('razon') || 'No especificada';

    try {
      const member = await interaction.guild.members.fetch(user.id);
      await member.ban({ reason: razon });

      await interaction.reply(`🔨 ${user.tag} fue baneado.\n📄 Razón: ${razon}`);
    } catch (err) {
      console.error(err);
      await interaction.reply('❌ No pude banear a ese usuario.');
    }
  },
};
