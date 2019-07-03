/* eslint-disable prefer-destructuring */
/* eslint-disable guard-for-in */

const Discord = require('discord.js');
const wait = require('util').promisify(setTimeout);

const config = require('./config.json');

const client = new Discord.Client();

// global invites object
const invites = {};
// global trials object
const trials = {};

// Load all invites for all guilds and save them to the cache.
const updateInvites = () => {
  client.guilds.forEach((g) => {
    g.fetchInvites().then((guildInvites) => {
      invites[g.id] = guildInvites;
    });
  });
};
client.on('ready', () => {
  // 'ready' isn't really ready sooo yeah
  wait(1000);
  // load the initial invites from our guilds
  updateInvites();
});
const toCodeBlock = msg => `\`\`\`${msg}\`\`\``;
const trialMessage = (trial) => {
  let response = '';
  response += `Trial ID: ${trial.id}\n`;
  response += `Trial Role: ${trial.role}\n`;
  response += `Invite link: ${trial.invite}\n`;
  response += `Created at ${trial.createdAt}\n\n`;
  return response;
};
client.on('message', async (message) => {
  if (!config.allowedChannels.includes(message.channel.id)) return;
  if (message.author.bot) return;
  if (message.content.match('\\$showTrials')) {
    let response = '';
    Object.keys(trials).forEach((id) => {
      response += trialMessage(trials[id]);
    });
    message.reply(toCodeBlock(response));
  }
  if (message.content.match('\\$stopTrial (.*)')) {
    const id = message.content.match('\\$stopTrial (.*)')[1];
    if (trials[id] !== undefined) {
      message.reply(`Stopping Trial ${id}\nRemoving role ${trials[id].role} from ${trials[id].uses} users`);
      const role = message.guild.roles.find(x => x.name === trials[id].role);
      if (role === null || undefined) {
        message.reply(`${trials[id].role} doesn't exist`);
        return;
      }
      role.delete().then(() => {
        message.reply('Successfully removed role!');
      }).catch((err) => {
        message.reply(err);
      });
      trials[id] = undefined;
    } else {
      message.reply('I don\'t think this Trial exists');
    }
  }
  if (message.content.match('\\$createTrial (.*)')) {
    const newTrial = {};
    // Create new invite link

    const roleName = message.content.match('\\$createTrial (.*)')[1];

    const role = message.guild.roles.find(x => x.name === roleName);
    if (role === null) {
      message.reply(`Role ${roleName} does not exist. Aborting`);
      return;
    }

    message.channel.createInvite({ maxAge: 0, unique: true }).then((invite) => {
      // set trial properties
      newTrial.role = roleName;
      newTrial.id = message.id;
      newTrial.invite = invite.toString();
      newTrial.inviteCode = invite.code;
      newTrial.uses = 0;
      newTrial.createdAt = new Date().toString();
      // set newTrial in global trials object
      trials[newTrial.id] = newTrial;
      // create response
      let response = trialMessage(newTrial);
      response += `Trial is valid until you use the command: $stopTrial ${newTrial.id}\n`;
      // load new invite
      updateInvites();
      // save new trial object to file in case of a crash
      message.reply(toCodeBlock(response));
    }).catch((err) => {
      console.log(err);
    });
  }
});
client.on('guildMemberAdd', (member) => {
  // To compare, we need to load the current invite list.
  member.guild.fetchInvites().then((guildInvites) => {
    // This is the *existing* invites for the guild.
    const ei = invites[member.guild.id];
    // Update the cached invites for the guild.
    invites[member.guild.id] = guildInvites;
    // Look through the invites, find the one for which the uses went up.
    const invite = guildInvites.find(i => ei.get(i.code).uses < i.uses);

    // eslint-disable-next-line no-restricted-syntax
    for (const id in trials) {
      if (trials[id].inviteCode === invite.code) {
        const role = member.guild.roles.find(x => x.name === trials[id].role);
        trials[id].uses += 1;
        client.guilds.get(member.guild.id).members.get(member.user.id).addRole(role).catch((err) => {
          // role/user/guild error. Handle how ever you want, but handle it pls
          console.error(err);
        });
      }
    }
  });
});
client.login(config.token);
