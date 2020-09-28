const sendHelp = message => {
  const helpString = `
   Useable commands:
   **Rips**
   - !rip <rip message> adds a new rip to the database
   - !delrip <rip message> deletes a rip if it exists
   - ?rips reacts with the amount of rips in the database
   - rip in a message responds with a random saved rip

   **Utility**
   - ?decide <option, option, option...> chooses one of the options
   - ?roll <number, optional> rolls a random number between 0-100 (or given number)

   **Explanations**
   - !learn <term: explanation> saves a term and an explanation for the term
   - !learn <term: url> saves an url without the preview
   - !learn <term:> as a comment to an image saves the term and the image

   - ?<term> responds with the saved term's explanation
   - ?random responds with a random explanation
   - ?explanations sends a private message with a list of all the saved stuff
   - ?terms send a private message with a list of the terms saved
   - ?files sends a private message with a list of the images saved
   - ?links sends a private message with a list of the urls saved

   **Quotes**
   - !quote <name>: <quote> adds a new quote to the given person
   - ?quote <name, optional> fetches a random quote from the person, if given, random if not
   - ?quote <name>: <search phrase> fetches a random quote from the person with the given phrase
   - ?quote random: <search phrase> fetches a random quote from anyone with the given phrase
   - ?quotes reacts with the amount of quotes in the database
   - ?quotes <name> reacts with the amount of quotes from the person.


   **WoW-stuff**
   - ?affixes <region, optional> <explained, optional> gets the current affixes

   **Random fun**
   - ?ismo responds with a random Ismo Laitela quote
   - ?catfact responds with a random cat fact
   `;

  message.react('✅');
  message.author.send(helpString);
};

module.exports = { sendHelp };
