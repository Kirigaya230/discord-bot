const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('dado')
    .setDescription('Lanza un dado virtual')
    .addIntegerOption(o =>
      o.setName('caras')
       .setDescription('Número de caras (por defecto 6)')
       .setMinValue(2)
    ),
  async execute(interaction) {
    const caras = interaction.options.getInteger('caras') || 6;
    const resultado = Math.floor(Math.random() * caras) + 1;
    await interaction.reply(`🎲 Resultado: **${resultado}** (d${caras})`);
  }
};
