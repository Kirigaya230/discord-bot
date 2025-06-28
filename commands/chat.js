const { SlashCommandBuilder } = require('discord.js');
const OpenAI = require('openai');
require('dotenv').config();

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

module.exports = {
  data: new SlashCommandBuilder()
    .setName('chat')
    .setDescription('Pregunta a la IA de ChatGPT')
    .addStringOption(o =>
      o.setName('mensaje')
       .setDescription('Tu pregunta')
       .setRequired(true)
    ),
  async execute(interaction) {
    const pregunta = interaction.options.getString('mensaje');
    await interaction.deferReply();

    try {
      const completion = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: pregunta }],
        max_tokens: 800
      });

      const respuesta = completion.choices[0].message.content;
      await interaction.editReply(respuesta);
    } catch (err) {
      console.error('❌ Error al consultar OpenAI:', err);
      await interaction.editReply('🤖 Comando deshabilitado temporalmente (IA sin créditos).');
    }
  }
};
