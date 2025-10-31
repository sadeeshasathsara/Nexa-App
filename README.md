# Nexa - Educational Platform Mobile App 📚

<div align="center">

![Nexa Logo](./Frontend/assets/icon.png)

**A comprehensive mobile learning platform connecting students and tutors**

[![React Native](https://img.shields.io/badge/React%20Native-0.81.4-blue.svg)](https://reactnative.dev/)
[![Expo](https://img.shields.io/badge/Expo-~54.0.12-000020.svg)](https://expo.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-~5.9.2-3178c6.svg)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

</div>

---

## 📖 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the App](#running-the-app)
- [App Architecture](#app-architecture)
- [User Flows](#user-flows)
- [API Integration](#api-integration)
- [Real-time Features](#real-time-features)
- [Building for Production](#building-for-production)
- [Contributing](#contributing)
- [License](#license)

---

## 🎯 Overview

**Nexa** is a comprehensive educational mobile application built with React Native and Expo, designed to bridge the gap between students and tutors. The platform provides an interactive learning experience with course management, real-time chat, quizzes, and personalized learning paths.

### Key Highlights

- 🎓 **Dual Role System**: Separate interfaces for students and tutors
- 📱 **Cross-Platform**: Works on iOS, Android, and Web
- 💬 **Real-time Communication**: WebSocket-powered chat functionality
- 🧠 **AI Chatbot**: Integrated learning assistant
- 📊 **Progress Tracking**: Comprehensive analytics and progress monitoring
- 🎨 **Modern UI**: Beautiful gradient-based interface with smooth animations

---

## ✨ Features

### For Students

- ✅ **Course Discovery & Enrollment**
  - Browse available courses
  - View detailed course information
  - Track course progress
  - Access course materials and lessons

- ✅ **Interactive Learning**
  - Watch lessons with progress tracking
  - Take quizzes and assignments
  - View scores and performance analytics
  - Personalized course recommendations

- ✅ **Scheduling & Management**
  - View upcoming classes and deadlines
  - Manage study schedule
  - Track learning milestones

- ✅ **AI Assistant**
  - 24/7 chatbot support
  - Subject-specific help
  - Learning resource recommendations

### For Tutors

- ✅ **Course Management**
  - Create and edit courses
  - Upload course materials
  - Organize lessons by weeks
  - Manage course visibility

- ✅ **Assessment Creation**
  - Design quizzes and assignments
  - Set difficulty levels
  - Review and publish assessments
  - Track student performance

- ✅ **Student Interaction**
  - Real-time course chat
  - Monitor student progress
  - Provide feedback
  - Manage enrollments

- ✅ **Analytics Dashboard**
  - View course statistics
  - Track student engagement
  - Monitor completion rates

### Common Features

- 🔐 **Secure Authentication**
  - JWT-based authentication
  - Role-based access control
  - Secure token storage
  - Email/password login
  - Social login (Google, Apple)

- 🌍 **Personalization**
  - Language preferences
  - Subject interests
  - Custom learning paths
  - Tailored recommendations

- 📱 **Beautiful UI/UX**
  - Gradient-based design
  - Smooth animations
  - Intuitive navigation
  - Responsive layouts

---

## 🛠️ Tech Stack

### Frontend

| Technology       | Version  | Purpose              |
| ---------------- | -------- | -------------------- |
| **React Native** | 0.81.4   | Mobile framework     |
| **Expo**         | ~54.0.12 | Development platform |
| **TypeScript**   | ~5.9.2   | Type safety          |
| **Expo Router**  | ~6.0.10  | File-based routing   |
| **React**        | 19.1.0   | UI library           |

### Key Libraries

- **UI Components**
  - `expo-linear-gradient` - Gradient backgrounds
  - `@expo/vector-icons` - Icon library
  - `react-native-skeleton-placeholder` - Loading states
  - `react-native-markdown-display` - Markdown rendering

- **State & Storage**
  - `@react-native-async-storage/async-storage` - Local storage
  - `expo-secure-store` - Secure token storage

- **Real-time Communication**
  - `socket.io-client` - WebSocket client

- **Authentication & Security**
  - `jwt-decode` - JWT token parsing
  - `expo-secure-store` - Encrypted storage

- **Utilities**
  - `@react-native-community/datetimepicker` - Date/time selection
  - `expo-document-picker` - File uploads
  - `@vitalets/google-translate-api` - Translation services

### Backend Integration

- **API Server**: Node.js/Express (hosted on Render)
- **Base URL**: `https://nexa-mobile-express.onrender.com`
- **Real-time**: WebSocket connections via Socket.io

---

## 📂 Project Structure

```
Nexa-App/
└── Frontend/
    ├── app/                          # Application screens (Expo Router)
    │   ├── _layout.tsx              # Root layout
    │   ├── index.tsx                # Entry point
    │   ├── (auth)/                  # Authentication flow
    │   │   ├── login.tsx
    │   │   └── register/            # Multi-step registration
    │   │       ├── role-selection.tsx
    │   │       ├── account-setup.tsx
    │   │       ├── otp-verification.tsx
    │   │       ├── student/         # Student-specific signup
    │   │       └── tutor/           # Tutor-specific signup
    │   ├── (splash)/                # Onboarding screens
    │   │   ├── index.tsx
    │   │   ├── onboarding1.tsx
    │   │   ├── onboarding2.tsx
    │   │   ├── onboarding3.tsx
    │   │   └── onboarding4.tsx
    │   ├── (tabs)/                  # Main app tabs
    │   │   ├── (student_tabs)/      # Student interface
    │   │   │   ├── index.tsx        # Home/Dashboard
    │   │   │   ├── courses.tsx
    │   │   │   ├── schedule.tsx
    │   │   │   └── profile.tsx
    │   │   ├── (tutor_tabs)/        # Tutor interface
    │   │   │   ├── index.tsx        # Dashboard
    │   │   │   ├── courses/
    │   │   │   ├── quizzes.tsx
    │   │   │   └── profile.tsx
    │   │   ├── (chatbot)/           # AI Chatbot
    │   │   ├── (quiz)/              # Quiz system
    │   │   ├── course_details/      # Course detail pages
    │   │   └── lesson_details/      # Lesson viewer
    │   ├── personalize.tsx          # Personalization setup
    │   ├── preferred_language.tsx
    │   ├── recommended.tsx
    │   └── select_course.tsx
    ├── components/                  # Reusable components
    │   └── tutor.components/
    │       ├── CourseCard.tsx
    │       ├── DetailedCourseCard.tsx
    │       ├── CourseOverview.tsx
    │       ├── CourseLessons.tsx
    │       ├── CourseQuizzes.tsx
    │       ├── CourseChat.tsx
    │       └── QuizCard.tsx
    ├── config/                      # Configuration files
    │   ├── api.js                   # API base URL
    │   └── tagList.js               # Subject tags
    ├── types/                       # TypeScript types
    │   └── course.ts
    ├── utils/                       # Utility functions
    │   └── socket.js                # WebSocket setup
    ├── assets/                      # Images and static files
    ├── app.json                     # Expo configuration
    ├── eas.json                     # EAS Build configuration
    ├── package.json                 # Dependencies
    └── tsconfig.json                # TypeScript config
```

---

## 🚀 Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher)
- **npm** or **yarn**
- **Expo CLI** (`npm install -g expo-cli`)
- **Git**
- **iOS Simulator** (Mac only) or **Android Studio** (for Android emulation)
- **Expo Go app** (for testing on physical devices)

### System Requirements

- **macOS**: For iOS development
- **Windows/Linux/macOS**: For Android and web development
- **Mobile Device**: iOS 13+ or Android 5.0+

---

## 📦 Installation

### 1. Clone the Repository

```bash
git clone https://github.com/Eric-Devon/Nexa-App.git
cd Nexa-App
```

### 2. Navigate to Frontend Directory

```bash
cd Frontend
```

### 3. Install Dependencies

Using npm:
```bash
npm install
```

Or using yarn:
```bash
yarn install
```

### 4. Install Expo CLI (if not already installed)

```bash
npm install -g expo-cli
```

---

## ⚙️ Configuration

### API Configuration

Update the API base URL in `config/api.js`:

```javascript
// For production
export const API_BASE_URL = "https://nexa-mobile-express.onrender.com";

// For local development
// export const API_BASE_URL = "http://localhost:5000";
```

### Environment Setup

The app uses Expo's environment configuration. Key settings are in `app.json`:

- **App Name**: Nexa
- **Bundle Identifier (iOS)**: `com.sadeeshasathsara.Frontend`
- **Package Name (Android)**: `com.sadeeshasathsara.Frontend`
- **EAS Project ID**: `fcd3b765-f9a0-4189-9412-72b2de6982de`

---

## 🎮 Running the App

### Development Mode

Start the Expo development server:

```bash
npm start
# or
expo start
```

This will open Expo DevTools in your browser.

### Run on iOS Simulator

```bash
npm run ios
# or
expo start --ios
```

**Note**: Requires macOS with Xcode installed.

### Run on Android Emulator

```bash
npm run android
# or
expo start --android
```

**Note**: Requires Android Studio with an emulator configured.

### Run on Web

```bash
npm run web
# or
expo start --web
```

### Run on Physical Device

1. Install **Expo Go** from App Store (iOS) or Play Store (Android)
2. Start the development server: `npm start`
3. Scan the QR code with:
   - **iOS**: Camera app
   - **Android**: Expo Go app

---

## 🏗️ App Architecture

### Routing System

The app uses **Expo Router** for file-based routing. The structure is organized into route groups:

- `(splash)` - Initial onboarding experience
- `(auth)` - Authentication and registration flows
- `(tabs)` - Main app interface with nested tab navigators
  - `(student_tabs)` - Student-specific screens
  - `(tutor_tabs)` - Tutor-specific screens
  - `(chatbot)` - AI assistant interface
  - `(quiz)` - Quiz and assessment system

### State Management

- **Local State**: React hooks (`useState`, `useEffect`)
- **Persistent Storage**: AsyncStorage and SecureStore
- **Navigation State**: Expo Router built-in state

### Authentication Flow

1. User enters credentials → Login screen
2. API validates credentials → Backend authentication
3. JWT token received → Stored in SecureStore
4. Token added to headers → All subsequent API calls
5. Role-based redirect → Student or Tutor interface

### Data Flow

```
User Action → Component → API Call → Backend → Response → State Update → UI Render
                                   ↓
                            WebSocket (for real-time features)
```

---

## 👥 User Flows

### Student Journey

```
1. Onboarding → 2. Register/Login → 3. Personalization → 4. Dashboard
   ↓
5. Browse Courses → 6. Enroll → 7. View Lessons → 8. Take Quizzes → 9. Track Progress
```

### Tutor Journey

```
1. Onboarding → 2. Register/Login → 3. Qualification Setup → 4. Dashboard
   ↓
5. Create Course → 6. Add Lessons → 7. Create Quizzes → 8. Monitor Students → 9. Interact via Chat
```

---

## 🔌 API Integration

### Authentication Endpoints

```typescript
// Login
POST /api/auth/login
Body: { email: string, password: string }
Response: { success: boolean, data: { token: string, role: string } }

// Register
POST /api/auth/register
Body: { email, password, name, role, ... }
Response: { success: boolean, data: { token: string } }
```

### Course Endpoints

```typescript
// Get all courses
GET /api/courses

// Get course details
GET /api/courses/:id

// Create course (Tutor only)
POST /api/courses

// Update course
PUT /api/courses/:id

// Delete course
DELETE /api/courses/:id
```

### Quiz Endpoints

```typescript
// Get quizzes for course
GET /api/courses/:id/quizzes

// Create quiz
POST /api/quizzes

// Submit quiz answers
POST /api/quizzes/:id/submit
```

### Authentication Headers

All authenticated requests must include:

```typescript
headers: {
  'Authorization': `Bearer ${token}`,
  'Content-Type': 'application/json'
}
```

---

## ⚡ Real-time Features

### WebSocket Connection

The app uses Socket.io for real-time features:

```javascript
// Connect to WebSocket
import { connectWebSocket, getSocket } from './utils/socket';

// Establish connection
const socket = await connectWebSocket();

// Listen for events
socket.on('message', (data) => {
  console.log('New message:', data);
});

// Emit events
socket.emit('sendMessage', { courseId, message });
```

### Real-time Features

- **Course Chat**: Live messaging between students and tutors
- **Notifications**: Instant updates on course activities
- **Progress Updates**: Live progress synchronization

---

## 📱 Building for Production

### Using EAS Build

Expo Application Services (EAS) is configured for production builds.

#### iOS Build

```bash
eas build --platform ios
```

#### Android Build

```bash
eas build --platform android
```

#### Both Platforms

```bash
eas build --platform all
```

### Build Configuration

The `eas.json` file contains build profiles. Customize for your needs:

```json
{
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal"
    },
    "preview": {
      "distribution": "internal"
    },
    "production": {}
  }
}
```

### App Store Submission

#### iOS (App Store)

1. Build with `eas build --platform ios`
2. Download the `.ipa` file
3. Use Transporter app or App Store Connect to upload
4. Complete App Store metadata
5. Submit for review

#### Android (Play Store)

1. Build with `eas build --platform android`
2. Download the `.aab` file
3. Upload to Google Play Console
4. Complete store listing
5. Submit for review

---

## 🎨 UI/UX Features

### Design System

- **Color Palette**: Purple/violet gradient theme (`#667eea` to `#764ba2`)
- **Typography**: System fonts with custom weights
- **Spacing**: Consistent 8px grid system
- **Icons**: Ionicons from `@expo/vector-icons`

### Animations & Interactions

- Smooth screen transitions
- Loading skeletons
- Pull-to-refresh
- Swipe gestures
- Haptic feedback

### Accessibility

- Screen reader support
- High contrast mode
- Keyboard navigation
- Large touch targets

---

## 🧪 Testing

### Manual Testing

Run the app on various devices and test:
- Authentication flows
- Navigation between screens
- API integrations
- Real-time features
- Offline behavior

### Device Testing Checklist

- [ ] iOS (latest 2 versions)
- [ ] Android (API level 21+)
- [ ] Various screen sizes (phone, tablet)
- [ ] Different orientations
- [ ] Network conditions (3G, 4G, WiFi)

---

## 🐛 Troubleshooting

### Common Issues

#### Metro Bundler Issues

```bash
# Clear cache
expo start -c
# or
npm start -- --reset-cache
```

#### Node Modules Issues

```bash
# Remove and reinstall
rm -rf node_modules
npm install
```

#### iOS Build Issues

```bash
# Clear iOS build
cd ios && pod install && cd ..
```

#### Android Build Issues

```bash
# Clear Android build
cd android && ./gradlew clean && cd ..
```

### Getting Help

- Check [Expo Documentation](https://docs.expo.dev/)
- Review [React Native Documentation](https://reactnative.dev/)
- Search existing [GitHub Issues](https://github.com/Eric-Devon/Nexa-App/issues)
- Create a new issue with detailed information

---

## 🤝 Contributing

We welcome contributions to Nexa! Please follow these guidelines:

### How to Contribute

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/AmazingFeature`
3. **Commit your changes**: `git commit -m 'Add some AmazingFeature'`
4. **Push to the branch**: `git push origin feature/AmazingFeature`
5. **Open a Pull Request**

### Coding Standards

- Use TypeScript for new files
- Follow existing code style
- Add comments for complex logic
- Update documentation as needed
- Test on both iOS and Android

### Commit Message Convention

```
type(scope): subject

body

footer
```

**Types**: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`

**Example**:
```
feat(courses): add course filtering functionality

- Add filter by subject
- Add filter by difficulty
- Add sort by date

Closes #123
```

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👥 Team

**Project Lead**: [Sadeesha Sathsara](https://github.com/sadeeshasathsara)

### Contributors

- **Sadeesha Sathsara** - [@sadeeshasathsara](https://github.com/sadeeshasathsara) - Project Lead & Full Stack Developer
- **Eric Devon** - [@Eric-Devon](https://github.com/Eric-Devon) - Full Stack Developer
- **Ehara Perera** - [@EHARAPERERA](https://github.com/EHARAPERERA) - Full Stack Developer
- **Vageesha Udawatta** - [@vageeshau](https://github.com/vageeshau) - Full Stack Developer

---

## 🙏 Acknowledgments

- Expo team for the amazing platform
- React Native community
- Socket.io for real-time capabilities
- All contributors and testers

---

### Version History

- **v1.0.0** (Current) - Initial release with core features
  - User authentication
  - Course management
  - Quiz system
  - Real-time chat
  - AI chatbot

---

<div align="center">

**Built with ❤️ using React Native and Expo**

[⬆ Back to Top](#nexa---educational-platform-mobile-app-)

</div>
