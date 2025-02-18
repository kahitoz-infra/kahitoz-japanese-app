export default async function handler(req, res) {
    let api = process.env.NEXT_PUBLIC_BASE_API
    try {
      const response = await fetch(`${api}/tags`);
      const data = await response.json();
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch tags" });
    }
  }
  