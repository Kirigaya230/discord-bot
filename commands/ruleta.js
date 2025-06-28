const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ruleta')
    .setDescription('Gira una ruleta virtual')
    .addIntegerOption(o =>
      o.setName('opciones')
       .setDescription('Número de secciones (2‑10)')
       .setMinValue(2)
       .setMaxValue(10)
    ),
  async execute(interaction) {
    const total = interaction.options.getInteger('opciones') || 6;
    const res = Math.floor(Math.random() * total) + 1;
    await interaction.reply(`🎡 Resultado: opción **#${res}** de ${total}`);
  }
};
