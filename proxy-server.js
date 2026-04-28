const express = require("express");
const cors = require("cors");

const app = express();
const port = process.env.PORT || 3001;
const previewApiToken = process.env.KONTENT_PREVIEW_API_TOKEN;

if (!previewApiToken) {
    // Fail fast if secret token is not configured on server side.
    throw new Error("Missing env var KONTENT_PREVIEW_API_TOKEN");
}

app.use(cors());
app.use(express.json());

app.post("/api/taxonomy-options", async (req, res) => {
    try {
        const projectId = req.body.projectId;
        const itemCodename = req.body.itemCodename;
        const variantCodename = req.body.variantCodename;
        const taxonomyElementCodename = req.body.taxonomyElementCodename || "taxonomy_element";

        if (!projectId || !itemCodename || !variantCodename) {
            return res.status(400).json({
                error: "Missing projectId, itemCodename, or variantCodename."
            });
        }

        const url =
            "https://preview-deliver.kontent.ai/" +
            encodeURIComponent(projectId) +
            "/items?system.codename=" +
            encodeURIComponent(itemCodename) +
            "&language=" +
            encodeURIComponent(variantCodename) +
            "&elements=" +
            encodeURIComponent(taxonomyElementCodename);

        const response = await fetch(url, {
            method: "GET",
            headers: {
                Accept: "application/json",
                Authorization: "Bearer " + previewApiToken,
                "X-KC-Wait-For-Loading-New-Content": "true"
            }
        });

        if (!response.ok) {
            return res.status(response.status).json({
                error: "Preview API request failed.",
                statusText: response.statusText
            });
        }

        const data = await response.json();
        return res.json(data);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Unexpected proxy error." });
    }
});

app.get("/health", (_req, res) => {
    res.json({ ok: true });
});

app.listen(port, () => {
    console.log("Taxonomy proxy listening on port " + port);
});
