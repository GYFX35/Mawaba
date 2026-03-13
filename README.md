# Global Learning Platform

A comprehensive learning platform for global education, featuring podcasts, shorts, and videos across multiple disciplines including Sciences, Literature, and Business.

## Features

- **Multi-disciplinary Content**: Explore content in Sciences, Literature, Business, and more.
- **Diverse Media Formats**:
  - **Educational Shorts**: Quick, bite-sized learning moments.
  - **Podcasts**: In-depth discussions and training on various topics.
  - **Videos/Courses**: Full-length educational content for comprehensive learning.
- **Mentorship Focus**: Dedicated sections for finding mentors and advanced training.
- **Responsive Design**: Modern UI built with Next.js and Tailwind CSS.

## Project Structure

This is a monorepo containing:

- `apps/frontend`: Next.js application for the user interface.
- `apps/backend`: Express.js server providing the content API.

## Getting Started

### Prerequisites

- Node.js (v18 or later)
- npm

### Installation

1. Install dependencies at the root:
   ```bash
   npm install
   ```

### Running the Application

#### Start the Backend

Navigate to the backend directory and start the development server:
```bash
cd apps/backend
npm run dev
```
The backend will be available at `http://localhost:3001`.

#### Start the Frontend

Navigate to the frontend directory and start the development server:
```bash
cd apps/frontend
npm run dev
```
The frontend will be available at `http://localhost:3000` (or `3002` if port 3000 is occupied).

## API Endpoints

- `GET /api/content`: Returns all educational content.
- `GET /api/content/:category`: Returns content filtered by category (e.g., sciences, literature, business).

## Tech Stack

- **Frontend**: Next.js, React, Tailwind CSS, Lucide Icons.
- **Backend**: Node.js, Express, TypeScript.
- **Monorepo Management**: npm Workspaces.
