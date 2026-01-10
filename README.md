# Scribe

Scribe is a web application for taking timestamped notes on YouTube videos. It allows you to load any YouTube video, take notes as you watch, and have those notes automatically linked to the video's timeline.

## Features

- **Load from URL**: Paste any YouTube video link to get started.
- **Timestamped Notes**: Notes are automatically associated with the current video time.
- **Playback Sync**: Click on any note to jump directly to that point in the video.
- **Chapter Navigation**: Automatically parses and displays video chapters from the description for easy navigation.
- **Playback Controls**: Includes controls for play/pause, seeking, playback speed, and looping.
- **Dual Storage**: Notes are saved locally in your browser by default. You can also log in with Google to save and access your notes from anywhere.
- **Authentication**: Secure login and note synchronization using Google OAuth2.

## Tech Stack

- **Frontend**: React, TypeScript
- Backend: Spring Boot, PostgreSQL
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Routing**: React Router
- **Local Database**: [Dexie.js](https://dexie.org/) (a wrapper for IndexedDB)
- **Authentication**: Google OAuth2

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or newer)
- [npm](https://www.npmjs.com/) (or another package manager like `bun` or `yarn`)

### Installation

1.  **Clone the repository:**
    ```sh
    git clone <repository-url>
    cd Scribe
    ```

2.  **Install dependencies:**
    ```sh
    npm install
    ```

3.  **Set up environment variables:**

    Create a file named `.env` in the root of the project and add the following variables:

    ```env
    # Required for fetching video details (like chapters) from the YouTube Data API.
    VITE_YOUTUBE_API_KEY="YOUR_YOUTUBE_API_KEY"

    # The base URL for the backend API server used for authentication and cloud storage.
    VITE_API_BASE_URL="http://localhost:8080"
    ```

### Running the Application

Once the setup is complete, you can run the development server:

```sh
npm run dev
```

The application will be available at `http://localhost:5173` (or another port if 5173 is in use).

## Available Scripts

In the project directory, you can run:

- `npm run dev`: Starts the development server.
- `npm run build`: Bundles the app for production.
- `npm run lint`: Lints the source code using ESLint.
- `npm run preview`: Serves the production build locally for previewing.
- 
- ## Deployment
- 
- The project is configured for deployment on [Vercel](https://vercel.com/). The `vercel.json` file contains the necessary rewrite rules for the React Router to work correctly with client-side routing. To deploy, simply link your repository to a new Vercel project.
