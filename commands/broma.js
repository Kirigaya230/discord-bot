const { SlashCommandBuilder } = require('discord.js');

const bromas = [
  '¿Cómo se llama un boomerang que no vuelve? Un palo.',
  '¿Por qué los pájaros no usan Facebook? Porque ya tienen Twitter.',
  '¿Qué hace una abeja en el gimnasio? ¡Zum-ba!',
  '¿Y tu mamá qué hace? ¡Hace falta de ortografía!',
];

module.exports = {
  data: new SlashCommandBuilder()
    .setName('broma')
    .setDescription('Cuenta una broma aleatoria'),
  async execute(interaction) {
    const random = bromas[Math.floor(Math.random() * bromas.length)];
    await interaction.reply(`🤣 ${random}`);
  }
};
