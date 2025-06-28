const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ayuda')
    .setDescription('Lista los comandos disponibles'),
  async execute(interaction) {
    const embed = new EmbedBuilder()
      .setTitle('🤖 Comandos disponibles')
      .setColor('#00AAFF')
      .setTimestamp()
      .setFooter({ text: `Solicitado por ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL() });

    interaction.client.commands.forEach(cmd => {
      embed.addFields({ name: `/${cmd.data.name}`, value: cmd.data.description, inline: false });
    });

    await interaction.reply({ embeds: [embed], ephemeral: true });
  }
};
