const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('timeout')
    .setDescription('Silencia temporalmente a un usuario.')
    .addUserOption(option =>
      option.setName('usuario')
        .setDescription('Usuario a silenciar')
        .setRequired(true))
    .addIntegerOption(option =>
      option.setName('minutos')
        .setDescription('Duración del silencio en minutos')
        .setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),

  async execute(interaction) {
    const user = interaction.options.getUser('usuario');
    const minutes = interaction.options.getInteger('minutos');
    const member = await interaction.guild.members.fetch(user.id);

    try {
      await member.timeout(minutes * 60 * 1000);
      await interaction.reply({ content: `⏳ ${user.tag} fue silenciado por ${minutes} minutos.`, ephemeral: true });
    } catch (err) {
      console.error(err);
      await interaction.reply({ content: '❌ No pude silenciar a ese usuario.', ephemeral: true });
    }
  },
};
