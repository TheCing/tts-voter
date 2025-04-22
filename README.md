# Twitch Chat Voting Board

A React application that displays Twitch chat messages and tracks votes/cheers in a stylish, Twitch-themed UI. Perfect for streamers who want to engage with their audience through polls, suggestions, or fun conversations.

## Features

- 🔄 Real-time connection to Twitch chat
- 📊 Two tracking modes:
  - **User mode**: Displays messages from a specific user
  - **Cheer mode**: Tracks bits/cheers as votes
- 🔥 Firebase integration for shared leaderboard across viewers
- 🎨 Twitch-inspired modern UI with dark theme
- 👆 Upvote system to manually add votes
- 🔧 Configurable settings (voting threshold, leaderboard size)
- 📱 Responsive design that works on all devices
- 🖥️ OBS-friendly with standalone component views

## Installation

1. Clone the repository:

   ```
   git clone https://github.com/yourusername/tts-voter.git
   cd tts-voter
   ```

2. Install dependencies:

   ```
   npm install
   ```

3. Set up Firebase (for shared leaderboard):
   - Create a Firebase project at [firebase.google.com](https://firebase.google.com)
   - Enable Realtime Database
   - Copy your Firebase config from Project Settings > Your Apps
   - Create a `.env.local` file with your Firebase credentials:

   ```
   # Firebase Configuration
   VITE_FIREBASE_API_KEY=your-api-key
   VITE_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
   VITE_FIREBASE_DATABASE_URL=https://your-project-id-default-rtdb.firebaseio.com
   VITE_FIREBASE_PROJECT_ID=your-project-id
   VITE_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=your-messaging-sender-id
   VITE_FIREBASE_APP_ID=your-app-id
   VITE_FIREBASE_MEASUREMENT_ID=your-measurement-id
   ```

4. Start the development server:

   ```
   npm run dev
   ```

5. Build for production:

   ```
   npm run build
   ```

## Configuration

Edit `src/config.json` to customize application settings:

```json
{
  "channel": "twitchdev",
  "trackingMode": "cheer",
  "defaultUsername": "twitchdev",
  "autoConnect": true,
  "votingThreshold": 300,
  "leaderboardSize": 10,
  "refreshInterval": 60000,
  "theme": {
    "primary": "#9146ff",
    "secondary": "#772ce8",
    "dark": "#0e0e10",
    "light": "#efeff1"
  }
}
```

## Usage

### Basic Configuration

1. Set up Firebase as described in the Installation section
2. Edit your channel name in `src/config.json`
3. Choose your preferred tracking mode (`"user"` or `"cheer"`)
4. Deploy to Vercel

### OBS Integration

Use URL parameters to create standalone components for OBS:

```
https://your-vercel-app.vercel.app/?component=messages&channel=yourChannel&tracking=cheer
```

Parameters:

- `component`: Which component to show (`date`, `messages`, `leaderboard`)
- `channel`: Your Twitch channel name
- `tracking`: The tracking mode (`user` or `cheer`)
- `username`: Username to track (for user mode)
- `autoconnect`: Whether to connect automatically (`true` or `false`)

## Deployment to Vercel

This project is designed to be deployed on Vercel:

1. Push your code to GitHub
2. Connect your GitHub repository in Vercel
3. Deploy with the default settings
4. Your app will be live with the shared leaderboard!

## License

MIT License

## Acknowledgements

- [Firebase](https://firebase.google.com) - Realtime Database for shared leaderboard
- [TMI.js](https://github.com/tmijs/tmi.js) - JavaScript library for connecting to Twitch chat
- [React](https://reactjs.org/) - JavaScript library for building user interfaces
- [Vite](https://vitejs.dev/) - Next-generation frontend tooling
- Twitch Interactive, Inc. - For providing the chat infrastructure

---

*This project is not affiliated with or endorsed by Twitch Interactive, Inc.*

## Tracking Modes

1. **User Tracking**: Track messages from a specific Twitch user
2. **Cheer Tracking**: Track cheers (messages with 300+ bits)
