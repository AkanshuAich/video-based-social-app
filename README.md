# Video-Based Social App

A modern, real-time social platform for hosting and participating in audio/video rooms, inspired by platforms like Clubhouse and Twitter Spaces.

## Features

### Room Types
- **Audio Rooms**: Audio-only communication with chat
- **Video Rooms**: Full video and audio support with chat
- **Text Rooms**: Text-based chat rooms

### Room Controls
- **Audio Controls**:
  - Mute/Unmute with visual audio level indicator
  - Speaker/Listener role switching
  - Real-time audio visualization
- **Hand Raise**:
  - Participants can signal their intent to speak
  - Visual indicator for raised hands
- **Video Controls**:
  - Toggle video on/off
  - Compact, theatre-style video panel
  - Expandable/minimizable video view

### Chat Features
- Real-time messaging
- Emoji support
- Persistent chat history
- Optional chat panel for audio/video rooms

### User Experience
- Modern, responsive UI with smooth animations
- Role-based participation (Host, Speaker, Listener)
- Visual feedback for all interactions
- Toast notifications for important events

## Tech Stack

### Frontend
- React with TypeScript
- TailwindCSS for styling
- Framer Motion for animations
- React Query for state management
- WebRTC for video/audio streaming

### Backend
- Node.js API server
- WebSocket for real-time communication
- RESTful API endpoints

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/video-based-social-app.git
cd video-based-social-app
```

2. Install dependencies:
```bash
# Install client dependencies
cd client
npm install

# Install server dependencies (if applicable)
cd ../server
npm install
```

3. Set up environment variables:
```bash
# In client directory
cp .env.example .env.local
```

4. Start the development servers:
```bash
# Start client (from client directory)
npm run dev

# Start server (from server directory)
npm run dev
```

## Usage

1. **Creating a Room**:
   - Click "Create Room"
   - Select room type (Audio/Video/Text)
   - Set room name and description
   - Start the room

2. **Joining a Room**:
   - Browse available rooms
   - Click on a room to join
   - Grant necessary permissions (audio/video)

3. **Room Controls**:
   - Toggle audio with the microphone button
   - Raise/lower hand to request speaking privileges
   - Toggle between speaker and listener modes
   - Access chat via the chat button
   - Leave room using the exit button

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Inspired by modern social audio platforms
- Built with React and TypeScript
- Styled with TailwindCSS
- Animated with Framer Motion