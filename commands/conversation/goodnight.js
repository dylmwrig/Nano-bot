const COMMANDO = require('discord.js-commando');

//TODO
//I want to make this command logout nano
//aka I want to call .destroy() on client
//but I have no idea how to access the client calling it from a command
class GoodnightCommand extends COMMANDO.Command
{
    constructor(client)
    {
       super(client, {
          name: 'goodnight',
          aliases: ['bye', 'goodbye'],
          group: 'conversation',
          memberName: 'goodnight',
          description: 'Goodnight world!'
       });
    } //end constructor

    async run(message, args)
    {
        message.reply("https://vignette1.wikia.nocookie.net/nichijou/images/4/4d/Borscht.png/revision/latest?cb=20160618180947");
        //console.log("Client name: " + client.)
        client.destroy();
        console.log("Nano should be sleeping");
       /*client.logOut((err) => {
               console.log(err);
    });
       */
    } //end run
} //end GoodnightCommand

module.exports = GoodnightCommand;