/* nano.js
 * bot for personal server
 *
 * should have following functionality:
 * 1) keep track of what episode of things we're on
 * ---tell us/possibly link us the next episode?
 */

CONFIG = require("./config.js"); //configuration file for storing sensitive info
LOGIN_KEY = CONFIG.loginID;
//IDs taken from discord
const RHYMES_ID = CONFIG.rhymesID, LOTUS_ID = CONFIG.lotusID, NANO_ID = CONFIG.nanoID;
const COMMANDO = require('discord.js-commando'); //library for commands

const ANIME_SQL = require("sqlite");
      ANIME_SQL.open("./DB/animeEps.sqlite");
const NANO = new COMMANDO.Client({
      // owner: RHYMES_ID,
      commandPrefix: 'nano',
      unknownCommandResponse: false //allow for custom unknown command response
});

//these aren't const because I need them initialized after nano is ready
//but they should be treated as such
var NANO_SPAM;
var channels = [];
var EMOJI_ITS_ME;

NANO.registry.registerGroups([['random', 'Random'],
   ['conversation', 'Conversation']]);
NANO.registry.registerDefaults(); //defaults specified in the library
NANO.registry.registerCommandsIn(__dirname + "/commands");

NANO.on('ready', () =>
{
   console.log("Hai oh-kay!");
   startup();
}); //end ready event

//basic responding to message functionality
NANO.on('message', (message) =>
{
   const MES_STRING = message.content;
   const MES_PARTS = message.content.split(" "); //array of words in the message

   const NANO_AUTHOR = message.author.username == 'nano-bot';

   //track mentions by user
   const MENTION_ARR = mentionCheck(message);
   const RHYMES_MENTIONED = MENTION_ARR[0];
   const LOTUS_MENTIONED = MENTION_ARR[1];
   const NANO_MENTIONED = MENTION_ARR[2];

   if (!NANO_AUTHOR && MES_STRING.startsWith("nano"))
   {
      if(contains(MES_STRING, 'ante up'))
      {
         message.reply('YAP THAT FOOL');
         message.channel.sendMessage('KIDNAP THAT FOOL');
      } //end if

      else if(contains(MES_STRING, 'db'))
      {
         //ignore database access requests from wrong channels
         if (message.author.bot || message.channel.type === "dm")
         {
            return;
         } //end if
         episodeDB(MES_STRING);
      } //end else if

      else if(contains(MES_STRING, 'what is my avatar'))
      {
         message.reply(message.author.avatarURL);
      } //end else if

      else if (contains(MES_STRING, "what")) //welcome to big meme
      {
         message.channel.send(' the fuck did you just fucking say about me, you little bitch? I’ll have you know I graduated top of my class in the Navy Seals, and I’ve been involved in numerous secret raids on Al-Quaeda, and I have over 300 confirmed kills. I am trained in gorilla warfare and I’m the top sniper in the entire US armed forces. You are nothing to me but just another target. I will wipe you the fuck out with precision the likes of which has never been seen before on this Earth, mark my fucking words. You think you can get away with saying that shit to me over the Internet? Think again, fucker. As we speak I am contacting my secret network of spies across the USA and your IP is being traced right now so you better prepare for the storm, maggot. The storm that wipes out the pathetic little thing you call your life. You’re fucking dead, kid. I can be anywhere, anytime, and I can kill you in over seven hundred ways, and that’s just with my bare hands. Not only am I extensively trained in unarmed combat, but I have access to the entire arsenal of the United States Marine Corps and I will use it to its full extent to wipe your miserable ass off the face of the continent, you little shit. If only you could have known what unholy retribution your little “clever” comment was about to bring down upon you, maybe you would have held your fucking tongue. But you couldn’t, you didn’t, and now you’re paying the price, you goddamn idiot. I will shit fury all over you and you will drown in it. You’re fucking dead, kiddo.', {
            "tts" : true
         })
      } //end else if

      else if (contains(MES_STRING, 'parseTest'))
      {
         message.reply("Aye aye!");
         parse = MES_PARTS.slice(1, MES_PARTS.length).join();
         message.reply("Your sliced message: " + MES_PARTS.slice(1, MES_PARTS.length).join());
         message.reply(decompose(MES_PARTS.slice(1, MES_PARTS.length).join()));
      } //end else if

      else if (contains(MES_STRING, 'mentionTest'))
      {
         message.reply("Your message at least contains the phrase 'mentionTest'");
         message.reply("Type: " + typeof(message.mentions.members.keyArray()));

         var keyArray = message.mentions.members.keyArray();
         for (key in keyArray)
         {
            message.reply("Key: " + key + " type of this bullshit: " + typeof(key) + " length: " + keyArray.length);
         }
      }

      else if (contains(MES_STRING,  "bye nano"))
      {
         NANO.destroy((err) => {
            console.log(err);
         });
      }

      else if (RHYMES_MENTIONED || LOTUS_MENTIONED || NANO_MENTIONED)
      {
         if (RHYMES_MENTIONED)
         {
            message.channel.send("professor!")
         } //end if

         if (LOTUS_MENTIONED)
         {
            message.channel.send("lotus!")
         }; //end  if

         if (NANO_MENTIONED)
         {
            message.channel.send("It's me! " + EMOJI_ITS_ME);
         } //end if
      } //end else if

      else
      {
         // message.reply("???? ");
      } //end else
   } //end if
}); //end message event

NANO.on('typingStart', (NANO_SPAM, member) =>
{
   NANO_SPAM.send(
   {
      "embed":
      {
         title: "fucking horseshit",
         "image": {"url": "http://images/swed.jpg"}
      } //end embed
   }) //end send
   // .catch(console.error);
}); //end typingStart

NANO.on('unknownCommand', (message) =>
{
   var unknownResponse = "?????\nHere is a list of commands:";
   var comList = NANO.registry.commands.array();
   unknownResponse += "size of comList " + comList.length;
   unknownResponse += "First one: " + comList[0].value.name + "\n";
   for (command in comList)
   {
      unknownResponse += "\n" + command.name + "type: " + typeof(command);
   } //end for
message.reply(unknownResponse);
}); //end unknownCommand

NANO.login(LOGIN_KEY);
NANO.on("error", (e) => console.error(e));
NANO.on("warn", (e) => console.warn(e));
NANO.on("debug", (e) => console.info(e));

//parse the input down to its basest parts
function decompose(inString)
{
   const REGEX = "/([^.: \-!,+_@#\$%^&*();\\/|<>\";])";
   // const REGEX = "\\(\+\.\-!@#\$%\^&\*\(\)'\"\s])*";
   regex = "/\\([\+\.-!@#$%^&*\(\])*\\s|";
   inString = inString.toLowerCase();
   console.log(inString.split(REGEX));
   return inString.split(REGEX).join();
} //end decompose

function episodeDB(MES_STRING)
{
   sql.get(`SELECT * FROM scores WHERE userId = "${message.author.id}"`).then(row => {

   }).catch(() => {

});
} //end episodeDB

//identify if there were any mentions in the message and go from there
//return array of booleans for if a user was MENTION_ARR
//order is {Rhymes, Lotus, Nano}
function mentionCheck(message)
{                //rhymes,  lotus, nano
   var mentioned = [false,  false, false];
   var mentionArr = message.mentions.members.keyArray();
   for (var i = 0; i < mentionArr.length; i++)
   {
      if (mentionArr[i] == RHYMES_ID)
      {
         mentioned[0] = true;
      } //end if

      else if (mentionArr[i] == LOTUS_ID)
      {
         mentioned[1] = true;
      } //end else if

      else if (mentionArr[i] == NANO_ID)
      {
         mentioned[2] = true;
      } //end else if
   } //end for

   return mentioned;
} //end mentionCheck

//initialize all emoji to be strings containing the string representation of an emoji
function initEmoji()
{
   EMOJI_ITS_ME = "<:molangItsMe:309458954101194752>";
} //end initEmoji

//quality of life check for if the second string is in the first
function contains(container, contained)
{
   return (container.indexOf(contained) >= 0);
} //end contains

//things to do when nano connects
function startup()
{
   //get myself using my id (taken from discord itself)
   NANO_SPAM = NANO.channels.find('name', 'nano-spam');
   NANO_SPAM.send("Good morning professor!");
   initEmoji();
} //end startup