# Violet Dash Mobile 📱

A beautiful React Native mobile app built with Expo, inspired by the violet-dash-app design system. This app features a stunning violet color palette and modern dashboard components adapted for mobile devices.

## ✨ Features

- **Beautiful Violet Theme**: Consistent color scheme with violet accents
- **Responsive Design**: Optimized for mobile devices with proper spacing and typography
- **Component Library**: Reusable UI components (Button, Card, Input, etc.)
- **Navigation**: Bottom tab navigation with 4 main screens
- **Modern UI**: Clean, card-based design with shadows and proper spacing

## 🎨 Screens

### 1. Home Screen
- Welcome header with personalized greeting
- Statistics grid showing key metrics
- Quick action buttons
- Recent activity feed

### 2. Login Screen
- Beautiful login form with email/password
- Social login options
- Form validation and error handling
- Responsive keyboard handling

### 3. Form Screen
- Multi-section contact form
- Personal and professional information
- Message input with character count
- Newsletter subscription toggle
- Form validation and submission

### 4. Dashboard Screen
- Business metrics overview
- Period selector (day/week/month)
- Top products performance
- Recent orders with status indicators
- Quick action buttons

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Expo CLI
- iOS Simulator or Android Emulator (optional)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd violet-dash-mobile
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

4. **Run on device/simulator**
   ```bash
   # iOS
   npm run ios
   
   # Android
   npm run android
   
   # Web
   npm run web
   ```

## 🏗️ Project Structure

```
violet-dash-mobile/
├── src/
│   ├── components/
│   │   └── ui/
│   │       ├── Button.tsx
│   │       ├── Card.tsx
│   │       └── Input.tsx
│   ├── screens/
│   │   ├── HomeScreen.tsx
│   │   ├── LoginScreen.tsx
│   │   ├── FormScreen.tsx
│   │   └── DashboardScreen.tsx
│   └── theme/
│       └── colors.ts
├── App.tsx
├── package.json
└── README.md
```

## 🎨 Design System

### Color Palette
- **Primary**: Violet (#8B5CF6)
- **Secondary**: Gray (#F3F4F6)
- **Success**: Emerald (#10B981)
- **Warning**: Amber (#F59E0B)
- **Error**: Red (#EF4444)
- **Info**: Blue (#3B82F6)

### Typography
- **Headers**: 24-28px, bold
- **Body**: 14-16px, regular
- **Captions**: 12px, medium

### Spacing
- **xs**: 4px
- **sm**: 8px
- **md**: 16px
- **lg**: 24px
- **xl**: 32px
- **xxl**: 48px

## 🧩 Components

### Button
- Multiple variants: default, outline, secondary, ghost, link
- Different sizes: sm, default, lg, icon
- Loading states and disabled states
- Icon support

### Card
- Header, content, and footer sections
- Title and description support
- Consistent spacing and shadows

### Input
- Label and error support
- Left and right icon support
- Validation states
- Keyboard type optimization

## 📱 Navigation

The app uses React Navigation with bottom tabs:
- **Home**: Dashboard overview and quick actions
- **Login**: Authentication and user management
- **Form**: Data collection and submission
- **Dashboard**: Business metrics and analytics

## 🔧 Customization

### Theme Colors
Edit `src/theme/colors.ts` to customize the color scheme:

```typescript
export const violetTheme = {
  colors: {
    primary: '#8B5CF6', // Change this to your brand color
    // ... other colors
  }
};
```

### Component Styling
All components use the theme system and can be customized by:
- Modifying the theme file
- Passing custom styles via the `style` prop
- Extending component interfaces

## 📦 Dependencies

### Core
- React Native
- Expo
- TypeScript

### Navigation
- @react-navigation/native
- @react-navigation/bottom-tabs

### UI & Icons
- @expo/vector-icons (Ionicons)
- react-native-safe-area-context

### Styling
- React Native StyleSheet
- Custom theme system

## 🚀 Deployment

### Building for Production
```bash
# Build for iOS
expo build:ios

# Build for Android
expo build:android
```

### Publishing Updates
```bash
expo publish
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- Inspired by the violet-dash-app design system
- Built with React Native and Expo
- Uses Ionicons for beautiful icons
- Modern mobile UI/UX patterns

---

**Built with ❤️ and ☕ by the development team**
