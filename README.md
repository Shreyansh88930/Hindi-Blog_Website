# प्रेरणा - Hindi Motivational Blog

A beautiful, serene motivational blog platform focused on daily Hindi content where only selected hosts/admins can post inspirational content.

## ✨ Features

- **Admin-only Content Creation**: Secure Firebase authentication for hosts/admins
- **Multiple Content Types**: Support for Hindi text, images, and videos
- **Public Viewing**: Open access for all visitors with filtering options
- **Light/Dark Theme**: Persistent theme toggle with smooth transitions
- **Responsive Design**: Optimized for mobile, tablet, and desktop
- **Hindi Language Support**: Proper Devanagari fonts and text rendering
- **Clean UI**: Minimal, distraction-free interface accessible to all ages

## 🚀 Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS with dark mode support
- **Authentication**: Firebase Authentication
- **Database**: Firebase Firestore
- **Storage**: Firebase Storage (for images/videos)
- **Routing**: React Router v6
- **Icons**: Lucide React

## 🔧 Setup Instructions

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd hindi-motivational-blog
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Firebase Setup**
   - Create a new Firebase project at https://console.firebase.google.com/
   - Enable Authentication (Email/Password)
   - Enable Firestore Database
   - Enable Storage
   - Update `src/firebase/config.ts` with your Firebase config

4. **Database Setup**
   - Create a `posts` collection in Firestore
   - Create a `users` collection for admin user management
   - Set up Firestore security rules

5. **Run the development server**
   ```bash
   npm run dev
   ```

## 📱 Pages

- **Home (/)**: Welcome page with latest posts and filters
- **Login (/login)**: Admin authentication page
- **Dashboard (/dashboard)**: Admin panel for creating/managing posts
- **Post Detail (/post/:id)**: Full view of individual posts
- **About (/about)**: Information about the blog's mission

## 🎨 Design Features

- **Color Palette**: Soft rose, orange, and yellow gradients
- **Typography**: Noto Sans Devanagari for proper Hindi text rendering
- **Animations**: Smooth transitions and micro-interactions
- **Responsive**: Mobile-first design approach
- **Accessibility**: High contrast ratios and readable fonts

## 🔐 User Roles

- **Admin/Host**: Can create, edit, and delete posts
- **Public/Visitor**: Can view all posts and filter by creator/type

## 🎯 Post Types

1. **Text Posts**: Hindi motivational content
2. **Image Posts**: Inspirational images with optional captions
3. **Video Posts**: Short motivational videos

## 🌐 Deployment

The app can be deployed to:
- Firebase Hosting
- Vercel
- Netlify

## 📄 License

This project is licensed under the MIT License.