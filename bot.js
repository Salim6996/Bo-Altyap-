const { Client, GatewayIntentBits } = require('discord.js');

const client = new Client({

  intents: [

    GatewayIntentBits.Guilds,

    GatewayIntentBits.GuildMessages,

    GatewayIntentBits.MessageContent,

  ],

});

const { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder, PermissionsBitField } = require('discord.js');

var http = require("http");

http.createServer(function(req, res){

res.write("Hars Uptime ile calisiyor!"); 

res.end();

}).listen(8080);

client.on('ready', () => {

  console.log(`${client.user.tag} olarak giriş yapıldı!`);

  const activities = [

    { name: '📁 Uploading Files', type: 0 }, // Oynuyor

    { name: '📂 Uploading Files', type: 0 }, // Dinliyor

    { name: '💾 Saving Files', type: 0 }   

  ];

  setInterval(() => {

    const randomIndex = Math.floor(Math.random() * activities.length);

    const newActivity = activities[randomIndex];

    client.user.setActivity(newActivity.name, { type: newActivity.type });

  }, 7000); // 7 saniyede bir değişecek

});

client.login(process.env.token);

client.once('ready', () => {

  console.log(`${client.user.tag} olarak giriş yapıldı!`);

});

client.on('ready', () => {

  console.log(`bot status hazır ${client.user.tag}!`);

  client.user.setPresence({ status: 'dnd' }); // Botun durumunu "Rahatsız Etmeyin" olarak ayarlar

});

client.on('messageCreate', async message => {

  if (message.content.startsWith('.ban')) {

    if

       (!message.member.permissions.has(PermissionsBitField.Flags.BanMembers)) {

      return message.reply('<a:hayir:1186966298605912124> Sorry, you do not have the authority to ban users.');

    }

    if (!message.guild.members.me.permissions.has(PermissionsBitField.Flags.BanMembers)) {

      return message.reply('<a:hayir:1186966298605912124> Sorry, the bot does not have the authority to ban users.');

    }

    const userToBan = message.mentions.members.first();

    const banReason = message.content.split(' ').slice(2).join(' ') || 'No reason given';

    if (!userToBan) {

      return message.reply('Please tag the user you want to ban.');

    }

    // Yönetici izni olan bir kullanıcıyı banlamaya çalışıyorsa

    if (userToBan.permissions.has(PermissionsBitField.Flags.Administrator) || userToBan.roles.highest.position >= message.guild.members.me.roles.highest.position) {

      return message.reply('<a:hayir:1186966298605912124> I cant ban this user because he either has `administrator` privilege or his `role` is higher than mine.');

    }

    const embed = new EmbedBuilder()

      .setTitle('Ban Approval')

      .setThumbnail(userToBan.user.displayAvatarURL())

      .addFields(

        { name: 'Banned', value: `ID: ${userToBan.user.id}`, inline: true },

        { name: 'Reason', value: banReason, inline: true },

        { name: 'Time', value: `<t:${Math.floor(Date.now() / 1000)}:F>`, inline: true },

        { name: 'Banning Official', value: `ID: ${message.author.id}\nTag: ${message.author.tag}`, inline: true },

        { name: '<:neyapacaksin:1190351595133747260> Do You Approve Banning?', value: 'Evet: <:1760checkmarkicon:1190347710197416076> Hayır: <:5060crossmarkicon:1190347711988371687>', inline: true },

      )

      .setColor(0xFF0000);

    const row = new ActionRowBuilder()

      .addComponents(

        new ButtonBuilder()

          .setCustomId('confirmBan')

          .setLabel('Approve')

          .setStyle(ButtonStyle.Danger)

          .setEmoji('<:1760checkmarkicon:1190347710197416076>'),

        new ButtonBuilder()

          .setCustomId('cancelBan')

          .setLabel('Cancel')

          .setStyle(ButtonStyle.Secondary)

          .setEmoji('<:5060crossmarkicon:1190347711988371687>')

      );

    const banMessage = await message.reply({ embeds: [embed], components: [row] });

    const filter = i => i.user.id === message.author.id;

    const collector = message.channel.createMessageComponentCollector({ filter, time: 15000 });

    collector.on('collect', async i => {

      if (i.customId === 'confirmBan') {

        await message.guild.members.ban(userToBan, { reason: banReason });

        await i.update({ content: `${userToBan.user.tag} The user has been successfully banned.`, embeds: [], components: [] });

      } else if (i.customId === 'cancelBan') {

        await i.update({ content: 'The ban has been cancelled.', embeds: [], components: [] });

      }

    });

    collector.on('end', collected => {

      if (collected.size === 0) banMessage.edit({ content: 'The ban has timed out.', components: [] });

    });

  }

});

const fs = require('fs');

const saasSettingsPath = './saasSettings.json';

let saasEnabled = {};

// SAAS ayarlarını dosyadan yükle

if (fs.existsSync(saasSettingsPath)) {

  saasEnabled = JSON.parse(fs.readFileSync(saasSettingsPath));

}

client.on('messageCreate', message => {

  if (message.content === '.saas aç') {

    

    if (message.member.permissions.has(PermissionsBitField.Flags.ManageGuild)) {

      saasEnabled[message.guild.id] = true;

      fs.writeFileSync(saasSettingsPath, JSON.stringify(saasEnabled));

      message.channel.send('<:acik:1186974444665704578> SAAS artık bu sunucuda açık!');

    } else {

      message.channel.send('<a:hayir:1186966298605912124>Üzgünüm, bunu yapmak için `Sunucuyu Yönet` yetkisine sahip olmalısın.');

    }

  } else if (message.content === '.saas kapat') {

    if (message.member.permissions.has(PermissionsBitField.Flags.ManageGuild)) {

      saasEnabled[message.guild.id] = false;

      fs.writeFileSync(saasSettingsPath, JSON.stringify(saasEnabled));

      message.channel.send('<:kapali2:1186974339334160384> SAAS artık bu sunucuda kapalı!');

    } else {

      message.channel.send('<a:hayir:1186966298605912124>Üzgünüm, bunu yapmak için `Sunucuyu Yönet` yetkisine sahip olmalısın.');

    }

  }

const selamMessages = ['sa', 'selam', 'selamün aleyküm', 'selamun aleyküm', 'selamun aleykum', 'selamın aleyküm', 'selamın aleykum'];

  if (saasEnabled[message.guild.id] && selamMessages.includes(message.content.toLowerCase())) {

    message.channel.send(`<a:merhaba:1190314995305676840>**Aleyküm Selam Hoşgeldin** ${message.author}`);

  }

});

const linkEngellerDosyasi = './linkengeller.json';

let linkEngeller = {};

// Link engelleri dosyadan yükle

if (fs.existsSync(linkEngellerDosyasi)) {

  linkEngeller = JSON.parse(fs.readFileSync(linkEngellerDosyasi, 'utf-8'));

}

client.once('ready', () => {

  console.log(`Link Block System is Active!`);

});

client.on('messageCreate', async message => {

  // Botun mesajları silme yetkisi kontrolü

  if (!message.guild.members.me.permissions.has(PermissionsBitField.Flags.ManageMessages)) {

    console.log('The bot does not have the authority to delete messages.');

    return;

  }

  // Bot mesajları ve yönetici izni olan kullanıcıların mesajlarını yoksay

  if (message.author.bot || message.member.permissions.has(PermissionsBitField.Flags.Administrator)) return;

  // Link engelleme aktif mi kontrol et

  if (linkEngeller[message.guild.id]) {

    // Mesajda 'http://' veya 'https://' var mı kontrol et

    if (message.content.includes('http://') || message.content.includes('https://')) {

      await message.delete(); // Mesajı sil

      const uyarıMesajı = await message.channel.send(`<a:sinirli:1190690836539773008> ${message.author}, Link sharing is prohibited on this server!`);

      setTimeout(() => uyarıMesajı.delete(), 5000); // 5 saniye sonra uyarı mesajını sil

    }

  }

});

client.on('messageCreate', async message => {

  if (message.content === '.linkblock') {

    // Botun ve kullanıcının yetkilerini kontrol et

    if (!message.guild.members.me.permissions.has(PermissionsBitField.Flags.ManageGuild) || !message.member.permissions.has(PermissionsBitField.Flags.ManageGuild)) {

      return message.reply('You do not have the authority to block links.');

    }

    // Link engelleme durumunu kaydet

    linkEngeller[message.guild.id] = true;

    fs.writeFileSync(linkEngellerDosyasi, JSON.stringify(linkEngeller, null, 2));

    await message.reply('<:acik:1186974444665704578> Link blocking system has been activated.');

  } else if (message.content === '.unlinkblock') {

    // Botun ve kullanıcının yetkilerini kontrol et

    if (!message.guild.members.me.permissions.has(PermissionsBitField.Flags.ManageGuild) || !message.member.permissions.has(PermissionsBitField.Flags.ManageGuild)) {

      return message.reply('You do not have the authority to block links.');

    }

    // Link engelleme durumunu kaldır

    delete linkEngeller[message.guild.id];

    fs.writeFileSync(linkEngellerDosyasi, JSON.stringify(linkEngeller, null, 2));

    await message.reply('<:kapali2:1186974339334160384> Link blocking system has been disabled.');

  }

});

// Küfür filtresini açıp kapatan değişken

let isSwearFilterActive = true;

client.once('ready', () => {

  console.log('Küfür Engel Açık');

});

client.on('messageCreate', async message => {

  // Bot mesajlarına veya DM'ye cevap vermemeli

  if (!message.guild || message.author.bot) return;

  // Küfür filtresini kontrol et

  if (isSwearFilterActive && containsSwearWord(message.content)) {

    // Eğer kullanıcı küfür ettiyse ve mesajı silme yetkisine sahipse

    if (message.member.permissions.has(PermissionsBitField.Flags.ManageMessages)) {

      try {

        // Mesajı sil

        await message.delete();

        // Kullanıcıyı uyar

        const warningMsg = await message.channel.send(`${message.author}, küfür etmek yasak!`);

        // Uyarı mesajını 5 saniye sonra sil

        setTimeout(() => warningMsg.delete(), 5000);

      } catch (error) {

        console.error('Mesaj silinirken bir hata oluştu:', error);

      }

    }

  }

  // Küfür filtresini açma ve kapama komutları

  if (message.content === '!küfürengelaç') {

    // Komutu kullanan kişinin yetkisini kontrol et

    if (message.member.permissions.has(PermissionsBitField.Flags.Administrator)) {

      isSwearFilterActive = true;

      message.channel.send('Küfür filtresi aktif edildi.');

    } else {

      message.channel.send('Bu komutu kullanmak için yeterli yetkiniz yok.');

    }

  } else if (message.content === '!küfürengelkapat') {

    // Komutu kullanan kişinin yetkisini kontrol et

    if (message.member.permissions.has(PermissionsBitField.Flags.Administrator)) {

      isSwearFilterActive = false;

      message.channel.send('Küfür filtresi devre dışı bırakıldı.');

    } else {

      message.channel.send('Bu komutu kullanmak için yeterli yetkiniz yok.');

    }

  }

});

// Küfür içerip içermediğini kontrol eden fonksiyon

function containsSwearWord(messageContent) {

  // Küfür kelimelerinin listesi (örnek olarak sadece birkaç kelime eklendi)

  const swearWords = ['küfür1', 'küfür2', 'küfür3'];

  return swearWords.some(swearWord => messageContent.includes(swearWord));

}

client.on('messageCreate', async message => {

  if (!message.guild || message.author.bot) return;

  if (message.content === '.bot') {

    const totalMembers = client.guilds.cache.reduce((acc, guild) => acc + guild.memberCount, 0);

    const totalChannels = client.guilds.cache.reduce((acc, guild) => acc + guild.channels.cache.size, 0);

    const totalGuilds = client.guilds.cache.size;

    const uptime = process.uptime();

    const days = Math.floor(uptime / (3600 * 24));

    const hours = Math.floor(uptime % (3600 * 24) / 3600);

    const minutes = Math.floor(uptime % 3600 / 60);

    const seconds = Math.floor(uptime % 60);

    const uptimeString = `${days}d ${hours}h ${minutes}m ${seconds}s`;

    const embed = new EmbedBuilder()

      .setColor(0x0099FF)

      .setTitle(`${client.user.username} Statistics`)

      .setThumbnail(client.user.displayAvatarURL())

      .addFields(

        { name: '<:servers:1192543873818435665>Servers', value: `${totalGuilds}`, inline: true },

        { name: '<:servers_user:1192543875135443098>Users', value: `${totalMembers}`, inline: true },

        { name: '<:icon_channels:1192543581072793673>Channels', value: `${totalChannels}`, inline: true },

        { name: '<:icons_uptime:1192544614041784370>Uptime', value: uptimeString, inline: true },

{ name: '<:besir_yazilim:1192545434623811636>Software', value: 'Discord.js v14.0.1', inline: true },

        { name: '<:ping100:1192546120199569479>Ping', value: `${Math.round(client.ws.ping)}ms`, inline: true }

      )

      .setTimestamp()

      .setFooter({ text: 'Bot Stats', iconURL: client.user.displayAvatarURL() });

    await message.reply({ embeds: [embed] });

  }

});
  







client.on('interactionCreate', async interaction => {

  if (!interaction.isButton()) return;

  const { customId, message } = interaction;

  

  if (customId === 'refresh_ping') {

    await interaction.deferUpdate();

    const newPing = Date.now() - interaction.createdTimestamp;

    const newEmbed = new EmbedBuilder(message.embeds[0])

      .setDescription(`🏓 Pong! ${newPing}ms`);

    await message.edit({ embeds: [newEmbed] });

  }

});

client.on('messageCreate', async message => {

  if (message.content === '.ping') {

    const sent = await message.channel.send('<a:loading2:1184847443192463391>Ping is measured...');

    const ping = Date.now() - sent.createdTimestamp;

    const pingEmbed = new EmbedBuilder()

      .setColor('#0099ff')

      .setTitle('Ping')

      .setDescription(`🏓 Pong! ${ping}ms`)

      .setTimestamp();

    const row = new ActionRowBuilder()

      .addComponents(

        new ButtonBuilder()

          .setCustomId('refresh_ping')

          .setLabel('Refresh')

          .setStyle(ButtonStyle.Primary)

          .setEmoji('<:ayenile:1195369414057545799>')

      );

    await sent.delete();

    const messageWithButton = await message.channel.send({ embeds: [pingEmbed], components: [row] });

    // Butonun 10 dakika sonra devre dışı bırakılması için zamanlayıcı

    setTimeout(() => {

      const disabledRow = new ActionRowBuilder()

        .addComponents(

          ButtonBuilder.from(row.components[0])

            .setDisabled(true)

        );

      messageWithButton.edit({ components: [disabledRow] });

    }, 600000); // 600000ms = 10 dakika

  }

});









const { Collection } = require('discord.js');


// AFK verilerini oku veya oluştur
const afkFilePath = './afks.json';
let afkData = {};
if (fs.existsSync(afkFilePath)) {
  afkData = JSON.parse(fs.readFileSync(afkFilePath, 'utf-8'));
} else {
  fs.writeFileSync(afkFilePath, JSON.stringify(afkData));
}

// AFK verilerini güncelle ve kaydet
function updateAfkData(userId, data = null) {
  if (data) {
    afkData[userId] = data;
  } else {
    delete afkData[userId];
  }
  fs.writeFileSync(afkFilePath, JSON.stringify(afkData, null, 2));
}

// Random renk üretme fonksiyonu
function randomColor() {
  return Math.floor(Math.random() * 16777215).toString(16);
}

client.once('ready', () => {
  console.log(`${client.user.tag} olarak giriş yapıldı!`);
});

client.on('messageCreate', message => {
  if (message.author.bot) return;

  // Kullanıcı AFK ise ve mesaj gönderirse AFK durumunu kaldır
  if (afkData[message.author.id]) {
    const afkTime = afkData[message.author.id].time;
    updateAfkData(message.author.id);

    const timeAgo = Date.now() - afkTime;
    const minutesAgo = Math.floor(timeAgo / 60000);

    const backEmbed = new EmbedBuilder()
      .setColor(`#${randomColor()}`)
      .setTitle('Tekrar hoş geldin!')
      .setDescription(`${message.author.username}, AFK modundan çıktın. AFK süren: ${minutesAgo} dakika.`);
      
    message.reply({ embeds: [backEmbed] });
  }

  // Eğer mesaj bir kullanıcıyı etiketliyorsa ve o kullanıcı AFK ise, AFK bilgisini göster
  const mentionedUsers = message.mentions.users;
  mentionedUsers.forEach(user => {
    if (afkData[user.id]) {
      const afkReason = afkData[user.id].reason;
      const afkTime = afkData[user.id].time;

      const timeAgo = Date.now() - afkTime;
      const minutesAgo = Math.floor(timeAgo / 60000);

      const afkEmbed = new EmbedBuilder()
        .setColor(`#${randomColor()}`)
        .setTitle('AFK Bilgisi')
        .setDescription(`${user.username} şu anda AFK. Sebep: ${afkReason}\nAFK süresi: yaklaşık ${minutesAgo} dakika oldu.`);
      
      message.reply({ embeds: [afkEmbed] });
    }
  });

  // AFK komutunu kontrol et
  if (message.content.startsWith('.afk')) {
    const args = message.content.split(' ').slice(1);
    const reason = args.join(' ') || 'AFK';

    updateAfkData(message.author.id, {
      reason: reason,
      time: Date.now()
    });

    const afkEmbed = new EmbedBuilder()
      .setColor(`#${randomColor()}`)
      .setTitle('AFK Modu Aktif')
      .setDescription(`${message.author.username}, AFK moduna geçtin. Sebep: ${reason}`);

    message.reply({ embeds: [afkEmbed] });
  }
});

// Hataları işle
client.on('error', console.error);