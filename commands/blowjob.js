const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('blowjob')
    .setDescription('Envía una imagen aleatoria de blowjob (nsfw).'),
  async execute(interaction) {
    await interaction.deferReply(); // por si tarda un poquito

    try {
      const res = await fetch('https://api.waifu.pics/nsfw/blowjob');
      const data = await res.json();

      const embed = new EmbedBuilder()
        .setColor(0xff66cc)
        .setTitle('💖 blowjob Random')
        .setImage(data.url)
        .setFooter({ text: 'Fuente: waifu.pics' });

      await interaction.editReply({ embeds: [embed] });
    } catch (err) {
      console.error(err);
      await interaction.editReply('❌ Error al obtener la imagen.');
    }
  },
};
