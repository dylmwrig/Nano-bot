const COMMANDO = require('discord.js-commando');

class ThanksCommand extends COMMANDO.Command
{
   constructor(client)
   {
      super(client, {
         name: 'thanks',
         aliases: ['thank you', 'ty'],
         group: 'conversation',
         memberName: 'thanks',
         description: 'No problem~'
      });
   } //end constructor

   async run(message, args)
   {
      message.reply("No problem~");
   } //end run
} //end ThanksCommand

module.exports = ThanksCommand;