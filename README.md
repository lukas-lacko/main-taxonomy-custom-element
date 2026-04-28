# Taxonomy Custom Element + Secure Proxy

This solution has two deployable parts:

- `index.html` = the **Custom Element frontend** (host as a static file).
- `proxy-server.js` = the **backend proxy** (run as Node service).

The frontend never stores the Preview API token. The proxy keeps the token server-side and calls Kontent Preview Delivery API.

## What to deploy where

### A) Custom element frontend (static hosting)

Deploy:

- `index.html`

Use the hosted URL in your Kontent.ai Custom Element field.

### B) Proxy backend (Node hosting, e.g. Render)

Deploy:

- `proxy-server.js`
- `package.json`
- `package-lock.json`
- `.env.example` (optional but recommended for documentation)

Set environment variable on the server:

- `KONTENT_PREVIEW_API_TOKEN=<your_preview_token>`
- optional: `PORT=3001`

Run:

- `npm install`
- `npm start`

Proxy endpoint:

- `POST /api/taxonomy-options`

Health endpoint:

- `GET /health`

## Kontent.ai Custom Element configuration

Set JSON parameters in the Custom Element field configuration:

```json
{
  "proxyUrl": "https://your-proxy-domain/api/taxonomy-options",
  "taxonomyElementCodename": "taxonomy_element"
}
```

Local testing example:

```json
{
  "proxyUrl": "http://localhost:3001/api/taxonomy-options",
  "taxonomyElementCodename": "taxonomy_element"
}
```

## Optional config fields

- `observeAllElementChanges` (boolean, default `false`)
  - `true` = observe all content element changes
- `observedElementCodenames` (string array)
  - explicit list of codenames to observe
- `changeFollowupDelaysMs` (number array, default `[500, 1200, 3000]`)
  - staged refresh delays after a relevant change event

Example with more options:

```json
{
  "proxyUrl": "https://your-proxy-domain/api/taxonomy-options",
  "taxonomyElementCodename": "taxonomy_element",
  "changeFollowupDelaysMs": [500, 1500, 3000]
}
```

## Security notes

- Never put real token values into Git.
- Keep `KONTENT_PREVIEW_API_TOKEN` only in server environment variables.
- Frontend sends only contextual identifiers (`projectId`, `itemCodename`, `variantCodename`, taxonomy element codename) to proxy.
