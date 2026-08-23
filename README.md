# Mawaba

Global interaction, communication, and development platform integrated with AI for business, partnerships, opinion sharing, project publishing, educational tutoring, forums, and chat.

Mawaba connects global health, education, environmental protection, cultural heritage, business promotion, and world development into a unified digital ecosystem.

---

## Project Structure

This project is organized as a monorepo containing:

- **`apps/frontend`**: Next.js React frontend with Tailwind CSS (`http://localhost:3000`)
- **`apps/backend`**: Express Node.js & TypeScript REST API server (`http://localhost:3001`)
- **`apps/ai-service`**: Python AI service with LangChain & Google Gemini / OpenAI integrations
- **`packages/*`**: Shared monorepo packages

---

## Getting Started

### Prerequisites

- Node.js (v20+) and npm (v10+)
- Python (v3.12+)

### Installation & Development

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Run the Next.js Frontend:**
   ```bash
   npm run dev --workspace=frontend
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

3. **Run the Backend API:**
   ```bash
   npm run dev --workspace=backend
   ```
   The backend REST API will start on [http://localhost:3001](http://localhost:3001).

4. **Run Backend Tests:**
   ```bash
   npm test --workspace=backend
   ```

5. **Run AI Service Tests:**
   ```bash
   PYTHONPATH=apps/ai-service python3 -m unittest apps/ai-service/test_main.py
   ```

---

## Contributing & Community

We welcome contributions from developers, designers, and community members around the world!

- 📖 **[Contribution Guidelines](CONTRIBUTING.md)**: Learn how to set up your environment, write tests, and submit pull requests.
- 🤝 **[Code of Conduct](CODE_OF_CONDUCT.md)**: Standards for a welcoming and inclusive community.
- 🔒 **[Security Policy](SECURITY.md)**: Guidelines for reporting security vulnerabilities.
- 🤖 **[Dependabot](.github/dependabot.yml)**: Automated dependency management for npm, Python, and GitHub Actions.

---

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
