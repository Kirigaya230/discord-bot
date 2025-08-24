const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('purge')
    .setDescription('Elimina mensajes en un canal o de un usuario específico.')
    .addIntegerOption(option =>
      option.setName('cantidad')
        .setDescription('Cantidad de mensajes a eliminar (1-100)')
        .setRequired(true))
    .addUserOption(option =>
      option.setName('usuario')
        .setDescription('Usuario del que eliminar mensajes')
        .setRequired(false))
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),

  async execute(interaction) {
    const cantidad = interaction.options.getInteger('cantidad');
    const usuario = interaction.options.getUser('usuario');

    if (cantidad < 1 || cantidad > 100) {
      return interaction.reply({ content: '❌ La cantidad debe estar entre 1 y 100.', ephemeral: true });
    }

    const mensajes = await interaction.channel.messages.fetch({ limit: 100 });

    let filtrados;
    if (usuario) {
      filtrados = mensajes.filter(m => m.author.id === usuario.id).first(cantidad);
    } else {
      filtrados = mensajes.first(cantidad);
    }

    try {
      await interaction.channel.bulkDelete(filtrados, true);
      await interaction.reply(`🧹 Se eliminaron ${filtrados.length} mensajes ${usuario ? `de ${usuario.tag}` : ''}.`);
    } catch (err) {
      console.error(err);
      await interaction.reply('❌ No pude eliminar los mensajes.');
    }
  },
};
