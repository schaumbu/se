export default async function handler(req, res) {
    const apiUrl = `https://de.wikipedia.org/w/api.php?action=query&format=json&list=random&rnnamespace=0&rnlimit=1&utf8=1`;

    try {
        const response = await fetch(apiUrl);
        const data = await response.json();
        const randomArticle = data.query.random[0].title;
        res.status(200).json(randomArticle);
    } catch (error) {
        console.error('Fehler beim Abrufen des zufälligen Artikels:', error);
        res.status(500).json({ error: 'Fehler beim Abrufen des zufälligen Artikels.' });
    }
}
