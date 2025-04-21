# Twitch Chat Voting Board

A React application that displays Twitch chat messages and tracks votes/cheers in a stylish, Twitch-themed UI. Perfect for streamers who want to engage with their audience through polls, suggestions, or just fun conversations.

## Features

- 🔄 Real-time connection to Twitch chat
- 📊 Two tracking modes:
  - **User mode**: Displays messages from a specific user
  - **Cheer mode**: Tracks bits/cheers as votes
- 🎨 Twitch-inspired modern UI with dark theme
- 👆 Upvote system to manually add votes
- 🔧 Configurable settings (transparency, debug tools)
- 📱 Responsive design that works on all devices
- 🖥️ OBS-friendly with standalone component views

## Installation

1. Clone the repository:

   ```
   git clone https://github.com/yourusername/twitch-chat-voting-board.git
   cd twitch-chat-voting-board
   ```

2. Install dependencies:

   ```
   npm install
   ```

3. Start the development server:

   ```
   npm run dev
   ```

4. Build for production:

   ```
   npm run build
   ```

## Usage

### Basic Configuration

1. Enter your Twitch channel name
2. Select tracking mode:
   - **User Mode**: Enter the username whose messages to track
   - **Cheer Mode**: Track bits/cheers (300+ bits)
3. Click "Connect to Chat"

### OBS Integration

Use URL parameters to create standalone components for OBS:

```
http://localhost:5173/?component=messages&channel=yourChannel&tracking=cheer&autoconnect=true
```

Parameters:

- `component`: Which component to show (`messages`, `header`, `config`, `status`, `debug`, `left`)
- `channel`: Your Twitch channel name
- `tracking`: The tracking mode (`user` or `cheer`)
- `username`: Username to track (for user mode)
- `autoconnect`: Whether to connect automatically (`true` or `false`)
- `debug`: Show debug panel (`true` or `false`)

## Development

Debug mode is available only in development environment. It shows detailed logs of the chat connection and message processing.

## License

MIT License

## Acknowledgements

- [TMI.js](https://github.com/tmijs/tmi.js) - JavaScript library for connecting to Twitch chat
- [React](https://reactjs.org/) - JavaScript library for building user interfaces
- [Vite](https://vitejs.dev/) - Next-generation frontend tooling
- Twitch Interactive, Inc. - For providing the chat infrastructure

---

*This project is not affiliated with or endorsed by Twitch Interactive, Inc.*

## Tracking Modes

1. **User Tracking**: Track messages from a specific Twitch user
2. **Cheer Tracking**: Track cheers (messages with 300+ bits)
