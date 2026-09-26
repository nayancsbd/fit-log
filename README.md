# FitLog — Workout Library

## 📝 Description
FitLog is a dark, no-nonsense gym companion designed for serious lifters. It allows users to browse a comprehensive library of exercises covering every major muscle group, view detailed execution instructions, and lock them into a daily training plan. The application tracks total workout duration and calories in real-time, helping you train with intent and log every set.

## 🚀 Live Demo
- **Live URL:** []

## 🛠️ Technologies Used
- **Framework:** Next.js (App Router)
- **UI Library:** React.js
- **Styling:** Tailwind CSS & DaisyUI
- **State Management:** React Context API
- **Local Storage:** Browser `localStorage` for data persistence
- **Notifications:** Sonner (Toast Notifications)
- **Deployment:** Vercel

## ✨ 5 Key Features
1. **Dynamic Workout Library & Sorting:** Browse a responsive grid of exercises fetched directly from an external API, with a client-side sorting feature to order workouts by Duration, Calories, or Rating.
2. **Comprehensive Details Pages:** Dynamic routes for each workout providing step-by-step instructions, equipment needs, and difficulty levels. 
3. **Live 'My Plan' Dashboard:** A dedicated dashboard featuring a tabbed interface (Today's Plan vs. Saved) that calculates total workout time and calories burned in real-time based on your selected exercises.
4. **Persistent Session State:** Utilizes the browser's local storage to ensure your planned and saved workouts survive page reloads, providing a seamless user experience.
5. **Interactive UI with Feedback:** Features active route highlighting in the navbar, live counter badges for planned/saved items, and toast notifications whenever an action (add, remove, or mark as done) is triggered.

## 💻 How to Run Locally

1. **Clone the repository:**
   ```bash
   git clone https://github.com/nayancsbd/fit-log.git
   cd fit-log
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

4. **Open the application:**
   Visit [http://localhost:3000](http://localhost:3000) in your browser.