# Jamaalaki - Salon Booking Platform

A modern web application for booking salon services in Saudi Arabia, built with React, Express, and TypeScript.

## Features

- 🌐 Multilingual support (with RTL)
- 💅 Modern UI with Tailwind CSS and Shadcn/ui components
- 🔐 User authentication (login/register)
- 📅 Salon and service booking system
- 🏪 Salon listings and details
- 👤 User profiles
- 📱 Responsive design

## Tech Stack

### Frontend
- React 18
- TypeScript
- Tailwind CSS
- Shadcn/ui components
- React Query for data fetching
- i18next for internationalization
- Wouter for routing
- React Hook Form for form handling
- Zod for validation

### Backend
- Express.js
- TypeScript
- Drizzle ORM
- PostgreSQL (via NeonDB)
- Session-based authentication
- WebSocket support

## Getting Started

### Prerequisites
- Node.js (Latest LTS version)
- npm or yarn
- PostgreSQL database

### Installation

1. Clone the repository
```bash
git clone [repository-url]
cd jamaalaki
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables
Create a `.env` file in the root directory with the following variables:
```env
DATABASE_URL=your_database_url
SESSION_SECRET=your_session_secret
```

4. Start the development server
```bash
npm run dev
```

### Build
```bash
npm run build
```

### Production
```bash
npm start
```

## Project Structure

```
jamaalaki/
├── client/               # Frontend React application
│   ├── src/
│   │   ├── components/   # Reusable UI components
│   │   ├── contexts/     # React contexts
│   │   ├── pages/       # Page components
│   │   └── App.tsx      # Main application component
├── server/              # Backend Express application
├── public/             # Static assets
└── package.json        # Project dependencies and scripts
```

## Features

### Salon Management
- Browse salons
- View salon details
- Filter and search functionality
- Service categories

### Booking System
- Select services
- Choose date and time
- Manage bookings
- View booking history

### User Management
- User registration
- Authentication
- Profile management
- Booking history

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
