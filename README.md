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
- 📡 Stream title display from Twitch API
- 🔄 Automatic token refresh for production

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

4. (Optional) Set up Twitch API for stream title display:
   - Register a new application at [Twitch Developer Console](https://dev.twitch.tv/console/apps)
   - Create an application with a name (category: website integration)
   - Get your Client ID from the console
   - Generate an access token using the [Twitch Token Generator](https://twitchapps.com/tokengen/)
     - Enter your Client ID
     - For scopes, enter: `user:read:email channel:read:stream`
     - Authorize and copy the token
   - Add these credentials to your `.env.local` file:

   ```
   # Twitch API Credentials
   VITE_TWITCH_CLIENT_ID=your-client-id
   VITE_TWITCH_ACCESS_TOKEN=your-access-token
   ```

5. Start the development server:

   ```
   npm run dev
   ```

6. Build for production:

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

- `component`: Which component to show (`date`, `messages`, `leaderboard`, `stream-title`)
- `channel`: Your Twitch channel name
- `tracking`: The tracking mode (`user` or `cheer`)
- `username`: Username to track (for user mode)
- `autoconnect`: Whether to connect automatically (`true` or `false`)
- `debug`: Enable debug mode (`true` to show debug panels)

### Debug Mode

If you're experiencing issues with Firebase or other services, you can use debug mode:

1. Press `Ctrl+Shift+D` to toggle debug panels
2. Add `?debug=true` to your URL to start with debug mode enabled
3. The debug panel shows Firebase connection status, environment variables, and troubleshooting tips
4. Check your browser console for additional error messages

### Firebase Database Rules

For proper operation in production, add these rules to your Firebase Realtime Database:

```json
{
  "rules": {
    "votes": {
      ".read": true,
      ".write": "auth != null || !data.exists()"
    },
    "messages": {
      ".read": true,
      ".write": "auth != null || !data.exists()"
    }
  }
}
```

For development/testing, you might need to use these more permissive rules:

```json
{
  "rules": {
    "votes": {
      ".read": true,
      ".write": true
    },
    "messages": {
      ".read": true,
      ".write": true
    }
  }
}
```

## Deployment to Vercel

This project is designed to be deployed on Vercel:

1. Push your code to GitHub
2. Connect your GitHub repository in Vercel
3. Deploy with the default settings
4. Set up the following environment variables in Vercel:
   - All Firebase variables from your `.env.local` file
   - `TWITCH_CLIENT_ID`: Your Twitch app client ID
   - `VERCEL_API_TOKEN`: A Vercel API token from your account settings
   - `VERCEL_PROJECT_ID`: Your project ID (found in Vercel project settings)
   - `VERCEL_TEAM_ID`: (Optional) Your team ID if using a team account
   - `REFRESH_SECRET`: A random string for securing the token refresh endpoint
   - `VITE_TWITCH_ACCESS_TOKEN`: Your Twitch access token (must be refreshed manually)
5. The automatic token refresh reminder will run every 12 hours

### Twitch Token Manual Update (For Public Apps)

Since you're using a public Twitch application, you'll need to manually refresh your token periodically:

1. Visit [Twitch Token Generator](https://twitchapps.com/tokengen/)
2. Enter your Client ID
3. For scopes, enter: `user:read:email channel:read:stream`
4. Authorize and copy the generated token
5. Update the `VITE_TWITCH_ACCESS_TOKEN` environment variable in your Vercel project settings

You'll receive a reminder when the token needs to be refreshed by visiting:

```
https://your-vercel-app.vercel.app/api/refresh-token
```

Include your refresh secret in the authorization header:

```
Authorization: Bearer your-refresh-secret
```

## License

MIT License

## Acknowledgements

- [Firebase](https://firebase.google.com) - Realtime Database for shared leaderboard
- [TMI.js](https://github.com/tmijs/tmi.js) - JavaScript library for connecting to Twitch chat
- [React](https://reactjs.org/) - JavaScript library for building user interfaces
- [Vite](https://vitejs.dev/) - Next-generation frontend tooling
- [Twitch API](https://dev.twitch.tv/) - Twitch Developer API for retrieving stream information
- Twitch Interactive, Inc. - For providing the chat infrastructure

---

*This project is not affiliated with or endorsed by Twitch Interactive, Inc.*

## Tracking Modes

1. **User Tracking**: Track messages from a specific Twitch user
2. **Cheer Tracking**: Track cheers (messages with 300+ bits)
