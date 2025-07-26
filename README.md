# Productivity Tracker

A modern desktop application built with Tauri, Vue.js, Bootstrap, and SQLite to help you monitor and improve your daily productivity.

## Features

### 📊 Dashboard
- Overview of daily productivity metrics
- Quick stats and progress indicators
- Recent activity feed
- Quick actions for common tasks

### ✅ Task Management
- Create, edit, and organize tasks
- Set priorities and due dates
- Filter and search tasks
- Track task completion status

### ⏱️ Time Tracking
- Start/stop time tracking sessions
- Track focus sessions with Pomodoro technique
- View detailed time entries
- Analyze time distribution across activities

### 📈 Analytics
- Visual charts and graphs
- Productivity trends over time
- Time distribution analysis
- Performance insights and recommendations

### ⚙️ Settings
- Customize app preferences
- Configure notifications
- Manage data backup and retention
- Keyboard shortcuts

## Technology Stack

- **Frontend**: Vue.js 3 + Bootstrap 5
- **Backend**: Tauri (Rust)
- **Database**: SQLite
- **Charts**: Chart.js
- **Icons**: Bootstrap Icons

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- Rust (latest stable)
- Tauri CLI

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd productivity-tracker
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run tauri dev
```

### Building for Production

```bash
npm run tauri build
```

## Project Structure

```
productivity-tracker/
├── src/
│   ├── components/
│   │   ├── Dashboard.vue
│   │   ├── Tasks.vue
│   │   ├── TimeTracking.vue
│   │   ├── Analytics.vue
│   │   └── Settings.vue
│   ├── App.vue
│   └── main.js
├── src-tauri/
│   ├── src/
│   │   ├── lib.rs
│   │   └── main.rs
│   ├── Cargo.toml
│   └── tauri.conf.json
├── package.json
└── README.md
```

## Database Schema

The app uses SQLite with the following tables:

- **tasks**: Store task information
- **time_entries**: Track time spent on activities
- **daily_goals**: Set and track daily productivity goals
- **productivity_sessions**: Record focus sessions

## Features in Detail

### Task Management
- Create tasks with titles, descriptions, and priorities
- Set due dates and track completion status
- Filter tasks by status, priority, and date
- Search functionality for quick task finding

### Time Tracking
- Start focus sessions with customizable durations
- Track time spent on specific activities
- View detailed time entries with start/end times
- Analyze time distribution across different activities

### Analytics Dashboard
- Visual charts showing productivity trends
- Time distribution analysis
- Weekly and monthly comparisons
- Productivity insights and recommendations

### Settings & Customization
- Configure default session durations
- Set up notifications and reminders
- Manage data backup and retention policies
- Customize app appearance and behavior

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Future Enhancements

- [ ] Cloud sync functionality
- [ ] Team collaboration features
- [ ] Advanced reporting and exports
- [ ] Mobile companion app
- [ ] Integration with calendar apps
- [ ] AI-powered productivity insights

## Support

For support and questions, please open an issue on GitHub.

---

Built with ❤️ for productivity enthusiasts
