// Ensure Next.js does not parse the request body (needed for Formidable)
export const config = {
    api: {
        bodyParser: false,
    },
};

import { IncomingForm } from "formidable";
import fs from "fs";

export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method Not Allowed" });
    }

    try {
        const api = process.env.NEXT_PUBLIC_BASE_API;
        const { file_name } = req.query;

        if (!file_name) {
            return res.status(400).json({ error: "File name is required" });
        }

        const form = new IncomingForm({ keepExtensions: true });

        form.parse(req, async (err, fields, files) => {
            if (err) {
                console.error("Error parsing form data:", err);
                return res.status(500).json({ error: "Failed to parse form data" });
            }

            const file = files.file?.[0]; // Access first file

            if (!file || !file.filepath) {
                return res.status(400).json({ error: "No valid file uploaded" });
            }



            // Prepare FormData for forwarding request
            const formData = new FormData();
            const fileBuffer = fs.readFileSync(file.filepath);
            formData.append("file", new Blob([fileBuffer]), file.originalFilename);


            const uploadUrl = `${api}/upload?file_name=${encodeURIComponent(file_name)}`;
            const response = await fetch(uploadUrl, {
                method: "POST",
                body: formData,
                headers: { Accept: "application/json" },
            });

            if (!response.ok) {
                const errorResponse = await response.text();
                console.error("Backend upload error:", errorResponse);
                return res.status(response.status).json({ error: "Failed to upload image" });
            }

            const result = await response.json();
            res.status(200).json(result);
        });
    } catch (error) {
        console.error("Upload API Error:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}
