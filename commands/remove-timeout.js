const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('remove-timeout')
    .setDescription('Quita el tiempo de espera de un usuario.')
    .addUserOption(option =>
      option.setName('usuario')
        .setDescription('Usuario al que deseas quitar el timeout')
        .setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers), // 👈 solo admins/mods con permiso

  async execute(interaction) {
    const user = interaction.options.getUser('usuario');

    try {
      const member = await interaction.guild.members.fetch(user.id);

      if (!member.isCommunicationDisabled()) {
        return await interaction.reply({ content: `ℹ️ ${user.tag} no tiene un timeout activo.`, ephemeral: true });
      }

      await member.timeout(null); // 👈 null quita el timeout

      await interaction.reply({ content: `✅ Timeout de ${user.tag} eliminado correctamente.`, ephemeral: true });
    } catch (err) {
      console.error(err);
      await interaction.reply({ content: '❌ No pude quitar el timeout de ese usuario.', ephemeral: true });
    }
  },
};
