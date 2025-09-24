# SmartSched 🗓️

> An intelligent scheduling application that automatically creates optimal schedules from your activities and constraints.

[![Next.js](https://img.shields.io/badge/Next.js-15.5.3-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.1.0-blue?style=flat-square&logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.0-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)

## ✨ Features

### 🎯 Core Functionality
- **Intelligent Scheduling**: Advanced backtracking algorithm automatically creates conflict-free schedules
- **Activity Management**: Add, edit, and organize activities with custom time slots
- **Dependency System**: Link related activities (e.g., lecture + lab) to ensure proper scheduling
- **Multiple Time Options**: Add alternative time slots for increased scheduling flexibility
- **Real-time Validation**: Instant feedback on conflicts and scheduling constraints

### 💾 Data Persistence
- **Local Storage**: Automatic saving of all activities and schedules
- **Session Management**: Clear separation between current session and saved data
- **Data Recovery**: Restore previous work when returning to the application
- **Privacy First**: All data stored locally in your browser

### 🎨 User Experience
- **Modern UI**: Clean, responsive design with smooth animations
- **Interactive Guide**: Step-by-step tutorial for new users
- **Export Options**: Download schedules as high-quality PNG images
- **Mobile Responsive**: Works seamlessly across all devices

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm, yarn, pnpm, or bun

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/sched-smart.git
   cd sched-smart
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📖 How to Use

### 1. Add Activities
- Enter activity names (e.g., "Math Class", "Study Group")
- Use clear, descriptive names without special characters
- Each activity needs a unique identifier

### 2. Set Time Slots
- Choose available days for each activity
- Set precise start and end times
- Add multiple time options for flexibility

### 3. Connect Related Activities
- Link activities that belong together (e.g., lecture + lab)
- Set up prerequisites and dependencies
- Mark conflicting activities

### 4. Generate Schedule
- Click "Generate Schedule" to create your optimized timetable
- Review the results and make adjustments if needed
- Export as a PNG image for sharing or printing

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 15.5.3 with App Router
- **UI Library**: React 19.1.0
- **Styling**: Tailwind CSS 4.0
- **Animations**: Motion (Framer Motion)
- **Icons**: Lucide React
- **Forms**: React Hook Form with Zod validation

### Core Libraries
- **UI Components**: Radix UI (Label, Select, Separator, Slot)
- **Form Handling**: React Hook Form with Zod validation
- **Styling Utilities**: Class Variance Authority, Tailwind Merge
- **Icons**: Lucide React, React Icons

### Development
- **Language**: TypeScript 5.0
- **Linting**: ESLint with Next.js config
- **Build Tool**: Turbopack (Next.js)

## 📁 Project Structure

```
sched-smart/
├── app/                          # Next.js App Router
│   ├── __feature/               # Feature showcase components
│   ├── __hero/                  # Hero section components
│   ├── __navigation_bar/        # Navigation components
│   ├── __scheduler/             # Core scheduler components
│   │   ├── utils/               # Scheduler utilities
│   │   └── time-slots/          # Time slot components
│   ├── about/                   # About page
│   ├── guide/                   # User guide page
│   └── globals.css              # Global styles
├── algorithms/                   # Scheduling algorithms
├── components/                   # Reusable UI components
│   ├── layout/                  # Layout components
│   └── ui/                      # Base UI components
├── constants/                    # Application constants
├── hooks/                       # Custom React hooks
├── lib/                         # Utility libraries
├── types/                       # TypeScript type definitions
├── validation/                  # Form validation schemas
└── utils/                       # General utilities
```

## 🔧 Available Scripts

```bash
# Development
npm run dev          # Start development server with Turbopack
npm run build        # Build for production with Turbopack
npm run start        # Start production server
npm run lint         # Run ESLint

# Alternative package managers
yarn dev             # Using Yarn
pnpm dev             # Using pnpm
bun dev              # Using Bun
```

## 🧠 Algorithm Details

SmartSched uses a sophisticated **backtracking algorithm** to solve scheduling constraints:

- **Constraint Satisfaction**: Ensures no time conflicts between activities
- **Dependency Resolution**: Respects activity relationships and prerequisites  
- **Optimization**: Finds the most efficient schedule arrangement
- **Conflict Detection**: Identifies and reports scheduling issues

## 🎯 Use Cases

- **Academic Scheduling**: Course timetables, exam schedules, study groups
- **Event Planning**: Conference sessions, workshop scheduling
- **Resource Management**: Meeting room bookings, equipment scheduling
- **Personal Organization**: Work-life balance, hobby scheduling

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

### Development Setup
1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes and add tests
4. Commit your changes: `git commit -m 'Add amazing feature'`
5. Push to the branch: `git push origin feature/amazing-feature`
6. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- UI components from [Radix UI](https://www.radix-ui.com/)
- Icons by [Lucide](https://lucide.dev/)
- Animations by [Framer Motion](https://www.framer.com/motion/)

## 📞 Support

- 📧 Email: support@schedsmart.com
- 🐛 Issues: [GitHub Issues](https://github.com/yourusername/sched-smart/issues)
- 💬 Discussions: [GitHub Discussions](https://github.com/yourusername/sched-smart/discussions)

---

<div align="center">
  <strong>Made with ❤️ for better scheduling</strong>
</div>