const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('moneda')
    .setDescription('Lanza una moneda'),
  async execute(interaction) {
    const cara = Math.random() < 0.5 ? 'Cara' : 'Cruz';
    await interaction.reply(`🪙 La moneda cayó en: **${cara}**`);
  }
};
