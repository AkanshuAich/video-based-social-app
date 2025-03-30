# Video-Based Social App

A modern, frontend-only social platform for hosting and participating in audio/video rooms, inspired by platforms like Clubhouse and Twitter Spaces. Built for a hackathon demonstration with mock data.

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
- Mock data for demonstration purposes

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
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to:
```
http://localhost:3002
```

## Usage

1. **Creating a Room**:
   - Click "Create Room"
   - Select room type (Audio/Video/Text)
   - Set room name and description
   - Start the room

2. **Joining a Room**:
   - Browse available rooms on the home page
   - Click on a room to join
   - Grant necessary permissions (audio/video if prompted)

3. **Room Controls**:
   - Toggle audio with the microphone button
   - Raise/lower hand to request speaking privileges
   - Toggle between speaker and listener modes
   - Access chat via the chat button
   - Leave room using the exit button

## Deployment

This application is configured for easy deployment to Vercel:

1. Fork or clone this repository to your GitHub account
2. Create a new project on Vercel
3. Import your GitHub repository
4. Vercel will automatically detect the configuration in `vercel.json`
5. Deploy the project

No additional configuration is required as this is a frontend-only application using mock data.

## Hackathon Implementation Notes

This application was built as a hackathon submission with the following design decisions:

- **Frontend-only implementation**: All data is mocked locally without requiring a backend
- **WebRTC simulation**: Video and audio functionality uses browser WebRTC APIs
- **Error handling**: Graceful fallbacks when permissions are denied
- **Performance optimization**: Minimized dependencies and asset sizes

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Inspired by modern social audio platforms
- Built with React and TypeScript
- Styled with TailwindCSS
- Animated with Framer Motion