const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { time } = require('@discordjs/builders');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('perfil')
    .setDescription('Muestra tu perfil o el de otra persona')
    .addUserOption(o =>
      o.setName('usuario')
       .setDescription('Usuario a consultar')
    ),
  async execute(interaction) {
    const user   = interaction.options.getUser('usuario') || interaction.user;
    const member = await interaction.guild.members.fetch(user.id);

    // -------- actividad
    let actividadTexto  = 'Este usuario no tiene actividad activa actualmente.';
    let actividadImagen = null;

    const presence = member.presence;
    if (presence && presence.activities.length) {
      const actividadValida = presence.activities.find(a => a.type !== 4);
      if (actividadValida) {
        const tipoActividad = {
          0: '🎮 Jugando',
          1: '📡 Transmitiendo',
          2: '🎧 Escuchando',
          3: '📺 Viendo',
          5: '🏆 Compitiendo'
        }[actividadValida.type] || '🌀 Actividad';

        const nombre = actividadValida.name;
        const inicio = actividadValida.timestamps?.start;

        if (inicio) {
          const duracionMs = Date.now() - inicio;
          const min = Math.floor(duracionMs / 60000);
          const seg = Math.floor((duracionMs % 60000) / 1000);
          actividadTexto = `${tipoActividad}: **${nombre}**\n🕒 Desde hace ${min} min ${seg} seg`;
        } else {
          actividadTexto = `${tipoActividad}: **${nombre}**`;
        }

        if (actividadValida.assets?.largeImage) {
          let imageId       = actividadValida.assets.largeImage.replace(/^mp:/, '');
          const appId       = actividadValida.applicationId;
          if (!imageId.startsWith('external/')) {
            actividadImagen = `https://cdn.discordapp.com/app-assets/${appId}/${imageId}.png`;
          }
        }
      }
    }

    // -------- fechas
    const creado = time(user.createdAt, 'F');
    const unido  = time(member.joinedAt, 'F');

    const embed = new EmbedBuilder()
      .setTitle(`👤 Perfil de ${user.tag}`)
      .setColor('#0099ff')
      .setThumbnail(user.displayAvatarURL({ dynamic: true, size: 1024 }))
      .addFields(
        { name: '🆔 ID', value: user.id, inline: true },
        { name: '📅 Cuenta creada', value: creado, inline: true },
        { name: '📥 Se unió al servidor', value: unido, inline: true },
        { name: '🎮 Actividad', value: actividadTexto, inline: false }
      )
      .setFooter({ text: `Solicitado por ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL() })
      .setTimestamp();

    if (actividadImagen) {
      embed.setImage(actividadImagen);
    } else {
      const fetched = await interaction.client.users.fetch(user.id, { force: true });
      if (fetched.banner) {
        embed.setImage(fetched.bannerURL({ size: 1024, dynamic: true }));
      }
    }

    await interaction.reply({ embeds: [embed] });
  }
};
