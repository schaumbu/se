export default async function handler(req, res) {
    const { searchTerm } = req.query;
    const apiUrl = `https://de.wikipedia.org/w/api.php?action=query&format=json&list=search&srsearch=${searchTerm}&utf8=1`;

    try {
        const response = await fetch(apiUrl);
        const data = await response.json();
        const suggestions = data.query.search.map(item => item.title);

        res.status(200).json(suggestions);
    } catch (error) {
        console.error('Fehler beim Abrufen der Vorschläge:', error);
        res.status(500).json({ error: 'Fehler beim Abrufen der Vorschläge.' });
    }
}
