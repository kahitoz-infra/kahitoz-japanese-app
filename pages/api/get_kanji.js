export default async function handler(req, res) {
    const api =  process.env.NEXT_PUBLIC_BASE_API; 

    // Extract label from query parameters
    const { label } = req.query;

    if (!label) {
        return res.status(400).json({ error: "Label parameter is required" });
    }

    try {
        // Fetch data from the backend service
        const response = await fetch(`${api}/get_kanji?label=${label}`);

        if (!response.ok) {
            throw new Error(`API responded with status ${response.status}`);
        }

        const kanjiData = await response.json();
        res.status(200).json(kanjiData);

    } catch (error) {
        console.error("Error fetching kanji:", error.message);
        res.status(500).json({ error: "Failed to fetch kanji data" });
    }
}
