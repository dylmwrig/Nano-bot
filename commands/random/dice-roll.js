const COMMANDO = require('discord.js-commando');

class DiceRollCommand extends COMMANDO.Command
{
    constructor(client)
    {
        super(client, {
            name: 'roll',
            group: 'random',
            memberName: 'roll',
            description: 'Rolls a die (taken from tutorial)'
        });
    } //end constructor

    async run(message, args)
    {
        var roll = Math.floor(Math.random() * 6) + 1;
        message.reply("You rolled a " + roll);
    } //end run
} //end DiceRollCommand

module.exports = DiceRollCommand; //makes sure this command is exported or something?? idk