import fetch from "node-fetch";
import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

async function runCompletion (input) {
  const completion = await openai.createCompletion({
    model: "text-davinci-003",
    prompt: input,
    max_tokens:1000,
    temperature: 1,
    top_p: 1.0,
    frequency_penalty: 0.0,
    presence_penalty: 0.0
  });
  return(completion.data.choices[0].text);
}

export default async function handler(req, res) {
    const { searchTerm } = req.query;
    const url = `https://de.wikipedia.org/w/api.php?action=query&format=json&prop=extracts&titles=${searchTerm}&exintro=1`;
    const unformatiertUrl = `https://de.wikipedia.org/w/api.php?action=query&format=json&prop=extracts&titles=${searchTerm}&exintro=1&explaintext=1`;

    try {
        // await new Promise(resolve => setTimeout(resolve, 2000)); // TODO: Das hier später entfernen

        const response = await fetch(url);
        const data = await response.json();
        const pageId = Object.keys(data.query.pages)[0];
        const formatierterText = data.query.pages[pageId].extract;
        console.log(formatierterText)
        let unformatierterText = await runCompletion('Kannst du mir diesen Text in einfacher Sprache mit wenig Fachbegriffen erklären?\n\n' + formatierterText)


        res.status(200).json({original: formatierterText, simple: unformatierterText});
    } catch (error) {
        console.error('Fehler beim Abrufen der Wikipedia-Daten:', error);
        res.status(500).json({ error: 'Fehler beim Abrufen der Wikipedia-Daten.' });
    }
}
