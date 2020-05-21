import { Command } from '../models/command';
import { Message, MessageEmbed } from 'discord.js';
import { commands } from '../commands';
import { getCommand } from '../util/parsing';
import { getDao } from '../util/database';

const BOT_AVATAR = 'https://cdn.discordapp.com/avatars/667552258476736512/c49cb419c5d3c8beb1f3e830341c21cd.png?size=512';

function commandsToKeyList(commands: { [key: string]: Command }): string[] {
     return Object.keys(commands);
}

function commandKeyToPrimaryKey(commandKey: string, commands: { [key: string]: Command }): string {
     const keyList = commandsToKeyList(commands);
     const primaryCommandKey = keyList.find(key => {
          const command = commands[key];
          return command.aliases && command.aliases.includes(commandKey);
     });
     if (primaryCommandKey) {
          return primaryCommandKey;
     }
     return commandKey;
}

function generateSingleHelpMessage(commandKey: string, command: Command, prefix: string): MessageEmbed {
     const helpMessage = new MessageEmbed()
         .setColor('#31449E')
         .setTitle(command.name)
         .setThumbnail(BOT_AVATAR)
         .setDescription(command.description)
         .addField('Usage', prefix + commandKey);


     if (command.aliases && command.aliases.length) {
          helpMessage.addField('Aliases', command.aliases.join(', '), true);
     }

     helpMessage.addField('Example', prefix + command.example, true);

     if (command.subCommands) {
          helpMessage.addField('Sub-commands', `**${commandsToKeyList(command.subCommands).join(', ')}**`);
     }

     return helpMessage;
}

function generateHelpMessage(prefix: string): MessageEmbed {
     const keys: string[] = Object.keys(commands);
     const helpMessage = new MessageEmbed()
         .setColor('#31449E')
         .setTitle('Commands')
         .setThumbnail(BOT_AVATAR);

     keys.forEach(key => {
          helpMessage.addField('Name', `**${commands[key].name}**`, true);
          helpMessage.addField('Usage', prefix + key, true);
          helpMessage.addField('Description', commands[key].description, true);
     });

     return helpMessage;
}

export async function help(command: Command, args: string[], message: Message): Promise<void> {
     if (args.length) {
          let commandKey = args[0].toLowerCase();
          let commandForHelp = getCommand(commandKey, commands);
          if (args.length > 1 && commandForHelp && commandForHelp.subCommands) {
               commandKey = args[1].toLowerCase();
               commandForHelp = getCommand(commandKey, commandForHelp.subCommands);
          }
          if (commandForHelp) {
               await message.react('🔍');
               await message.author.send(generateSingleHelpMessage(commandKeyToPrimaryKey(commandKey, commands), commandForHelp, getDao().getPrefix(message.guild)));
               if (message.channel.type !== 'dm') {
                    const response = await message.channel.send(`I messaged you the documentation for **${commandForHelp.name}**`);
                    await response.delete({ timeout: 5000 });
               }
          } else {
               await message.channel.send('Cannot provide help for unknown command');
          }
     } else { // Help with no arguments
          await message.react('🔍');
          await message.author.send(generateHelpMessage(getDao().getPrefix(message.guild)));
          if (message.channel.type !== 'dm') {
               const response = await message.channel.send('I messaged you the help documentation');
               await response.delete({ timeout: 5000 });
          }
     }
}