# FitLog Workout Library

A dark, high-intensity gym companion built with Next.js App Router, React 19, and Tailwind CSS. FitLog allows lifters to explore a curated workout library, filter and sort by muscle groups or metrics, lock exercises into a 5-lift daily plan, and track training volume in real-time.


## 🛠️ Technologies Used

- **Framework**: [Next.js 16 (App Router)](https://nextjs.org/)
- **UI Library & Language**: [React 19](https://react.dev/) & [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) & [DaisyUI 5](https://daisyui.com/)
- **State Management**: React Context API (`FitLogContext`)
- **Persistence**: Web Storage API (`localStorage`)
- **Notifications**: [Sonner](https://sonner.emilkowal.ski/) Toast Engine
- **Typography**: Google Fonts via `next/font` (Oswald & Geist Sans)



## ✨ 5 Key Features

1. **Interactive Exercise Catalog with Search & Tag Filtering**:
   Browse 12+ compound and isolation lifts covering all major muscle groups. Real-time search allows instantaneous filtering by workout name, equipment, and muscle group tags (Chest, Back, Legs, Shoulders, Arms, Core).

2. **Multi-Metric Sorting**:
   Instantly re-sort exercise lists across the Library and My Plan dashboards by **Duration** (shortest), **Calories Burned** (highest), or **Rating** (highest) with responsive chevron-driven dropdown controls.

3. **In-Depth Workout Detail Pages**:
   Dynamic server-rendered and statically generated routes (`/workout/[id]`) delivering full exercise breakdowns, muscle targets, equipment checklists, difficulty indicators, and numbered step-by-step instructions.

4. **Daily Plan Dashboard with 5-Lift Cap**:
   Dedicated planning dashboard (`/my-plan`) tracking total workout duration (minutes) and estimated calories burned in real-time. Automatically enforces a 5-lift daily cap with disabled state feedback to encourage focused training sessions.

5. **Local Persistence & Action Feedback**:
   All planned workouts, saved favorites, and completion checkoffs (`Mark as Done`) are automatically synchronized with browser `localStorage`, ensuring complete data persistence across page reloads with interactive toast notifications.

---

## 🚀 How to Run Locally

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


## Live URL: 