import fetch from "node-fetch";
export default async function handler(req, res) {
    const { searchTerm } = req.query;
    const url = `https://de.wikipedia.org/w/api.php?action=query&format=json&prop=extracts&titles=${searchTerm}&exintro=1`;
    const unformatiertUrl = `https://de.wikipedia.org/w/api.php?action=query&format=json&prop=extracts&titles=${searchTerm}&exintro=1&explaintext=1`;

    try {
        await new Promise(resolve => setTimeout(resolve, 2000)); // TODO: Das hier später entfernen

        const response = await fetch(url);
        const data = await response.json();
        const pageId = Object.keys(data.query.pages)[0];
        const formatierterText = data.query.pages[pageId].extract;

        const ufReponse = await fetch(unformatiertUrl)
        const ufData = await ufReponse.json();
        const ufPages = ufData.query.pages;
        const ufPageId = Object.keys(ufPages)[0];
        const unformatierterText = ufPages[ufPageId].extract; // TODO: Entweder den unformatierten text oder den


        res.status(200).json({original: formatierterText, simple: unformatierterText});
    } catch (error) {
        console.error('Fehler beim Abrufen der Wikipedia-Daten:', error);
        res.status(500).json({ error: 'Fehler beim Abrufen der Wikipedia-Daten.' });
    }
}
