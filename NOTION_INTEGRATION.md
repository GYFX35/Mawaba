# Notion Integration & Publishing Guide for Mawaba 📝

Mawaba supports seamlessly publishing development ideas, platform updates, educational content, and forum insights directly into Notion workspaces.

---

## 1. Publishing Documentation to Notion Workspace

You can publish Mawaba's project release notes, architectural overview, or operational roadmaps directly to Notion in 3 steps:

### Step 1: Create a Notion Integration
1. Go to [Notion Integrations Developer Portal](https://www.notion.so/my-integrations).
2. Click **+ New integration**.
3. Name your integration (e.g., `Mawaba Publisher`) and select your associated Notion workspace.
4. Set capabilities to **Read content**, **Update content**, and **Insert content**.
5. Save and copy your **Internal Integration Secret / API Token** (`ntn_...` or `secret_...`).

### Step 2: Share Notion Target Page or Database with Integration
1. In Notion, open or create the parent page/database where Mawaba content will be published (e.g., `Mawaba Ideas & Documentation Hub`).
2. Click the `...` menu in the top-right corner -> **Connections** (or **Add connections**).
3. Search for your integration name (`Mawaba Publisher`) and click **Confirm**.
4. Copy the **Page or Database ID** from the Notion URL:
   - URL format: `https://www.notion.so/workspace/Mawaba-Hub-1234567890abcdef1234567890abcdef`
   - Target ID: `1234567890abcdef1234567890abcdef`

---

## 2. API Endpoint for Notion Direct Publishing

Mawaba provides a backend API endpoint (`/api/notion/publish`) to programmatically sync ideas, opinions, and release notes to your Notion workspace database or page.

### Endpoint Specification
- **Method**: `POST`
- **Path**: `/api/notion/publish`
- **Headers**:
  - `Content-Type: application/json`

### Request Body
```json
{
  "notionToken": "secret_your_notion_api_token",
  "parentPageId": "1234567890abcdef1234567890abcdef",
  "title": "Quantum Mechanics Peer Tutoring - Development Idea",
  "category": "Education",
  "author": "Prof. Marie Curie",
  "content": "A platform bridging physics undergraduates with high school students to simplify complex physics concepts through interactive simulations."
}
```

### Curl Example
```bash
curl -X POST http://localhost:3001/api/notion/publish \
  -H "Content-Type: application/json" \
  -d '{
    "notionToken": "secret_xxxxxx",
    "parentPageId": "1234567890abcdef1234567890abcdef",
    "title": "Mawaba Platform v1.0.0 Release Notes",
    "category": "Development",
    "author": "Mawaba Core Team",
    "content": "Published release v1.0.0 with AI Tutor, Business Integrations, AWS, and Notion features."
  }'
```

### Response Example
```json
{
  "success": true,
  "message": "Successfully published to Notion",
  "notionPageId": "9876543210fedcba9876543210fedcba",
  "notionUrl": "https://notion.so/9876543210fedcba9876543210fedcba"
}
```

---

## 3. Notion Integration Features in Mawaba UI

Mawaba users can publish development ideas and opinions straight to Notion directly from the API portal and backend service endpoints.
