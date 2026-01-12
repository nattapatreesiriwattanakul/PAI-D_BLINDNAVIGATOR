# Pai Dee (ไปดี) - Indoor Navigation for Blind People

A comprehensive indoor navigation system designed specifically for visually impaired users, featuring:

- Voice-guided navigation with Thai language support
- Large, accessible touch buttons
- BLE beacon-based positioning with GPS fallback
- Multi-floor building navigation
- Admin panel for managing building layouts

## Project Structure

```
Pai-nai/
├── mobile/          # React Native Expo mobile app
├── backend/         # Express.js API server
└── README.md
```

## Features

### Mobile App

- **Accessibility-First Design**: Extra-large buttons, haptic feedback, screen reader support
- **Thai Language**: Full Thai language voice navigation
- **Indoor Positioning**: BLE beacon triangulation with GPS fallback
- **Step-by-Step Navigation**: Clear voice instructions for each step
- **Multi-Floor Support**: Automatic elevator routing between floors

### Backend API

- **Building Management**: CRUD operations for buildings, floors, and rooms
- **Navigation Engine**: Pathfinding algorithm for indoor routes
- **Beacon Management**: BLE beacon positioning system
- **Admin Authentication**: Secure admin panel access

## Setup Instructions

### Prerequisites

- Node.js 18+ and npm
- PostgreSQL 14+
- Expo CLI (for mobile development)
- Android/iOS device or emulator

### Backend Setup

1. **Navigate to backend directory**

   ```bash
   cd backend
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Setup PostgreSQL database**

   ```bash
   # Create database
   createdb pai_dee_db

   # Or using psql
   psql -U postgres
   CREATE DATABASE pai_dee_db;
   \q
   ```

4. **Configure environment**

   ```bash
   cp .env.example .env
   # Edit .env with your database credentials
   ```

5. **Run database migrations**

   ```bash
   # Connect to your database and run the schema
   psql -U postgres -d pai_dee_db -f src/database/schema.sql
   ```

6. **Start development server**

   ```bash
   npm run dev
   ```

   The API will be available at `http://localhost:3000`

### Mobile App Setup

1. **Navigate to mobile directory**

   ```bash
   cd mobile
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Update API configuration**
   Edit `mobile/constants/config.ts` and set your backend URL

4. **Start Expo development server**

   ```bash
   npm start
   ```

5. **Run on device**
   - Scan QR code with Expo Go app (Android/iOS)
   - Or press `a` for Android emulator
   - Or press `i` for iOS simulator

## Database Schema

### Core Tables

- **buildings**: Building information with GPS coordinates
- **floors**: Floor layouts with map images
- **rooms**: Individual rooms with coordinates
- **navigation_nodes**: Navigation graph nodes
- **navigation_paths**: Navigation graph edges
- **beacons**: BLE beacon positions
- **admin_users**: Admin authentication

## API Endpoints

### Buildings

- `GET /api/buildings` - List all buildings
- `GET /api/buildings/:id` - Get building details
- `GET /api/buildings/:id/floors` - Get building floors
- `POST /api/buildings` - Create building (admin)
- `PUT /api/buildings/:id` - Update building (admin)
- `DELETE /api/buildings/:id` - Delete building (admin)

### Floors

- `GET /api/floors/:id` - Get floor details
- `GET /api/floors/:id/rooms` - Get floor rooms
- `POST /api/floors` - Create floor (admin)
- `PUT /api/floors/:id` - Update floor (admin)
- `DELETE /api/floors/:id` - Delete floor (admin)

### Rooms

- `GET /api/rooms/:id` - Get room details
- `GET /api/rooms/search?q=...` - Search rooms
- `POST /api/rooms` - Create room (admin)
- `PUT /api/rooms/:id` - Update room (admin)
- `DELETE /api/rooms/:id` - Delete room (admin)

### Navigation

- `GET /api/navigation/nodes/:floorId` - Get navigation nodes
- `POST /api/navigation/route` - Calculate navigation route

### Beacons

- `GET /api/beacons/floor/:floorId` - Get floor beacons
- `POST /api/beacons/locate` - Locate user by beacons
- `POST /api/beacons` - Create beacon (admin)
- `PUT /api/beacons/:id` - Update beacon (admin)
- `DELETE /api/beacons/:id` - Delete beacon (admin)

### Admin

- `POST /api/admin/login` - Admin login
- `POST /api/admin/register` - Register admin user
- `POST /api/admin/upload` - Upload floor map image

## Room Number Format

Rooms use a 3-digit format `XYZ`:

- `X`: Floor number (e.g., 3 for 3rd floor)
- `YZ`: Room number on that floor (01-99)
- Example: `301` = Floor 3, Room 01

Some rooms may have suffixes like `301-1`, `301-2` for sub-rooms.

## BLE Beacon Setup

For accurate indoor positioning:

1. Deploy at least 3-4 beacons per floor
2. Place beacons at known coordinates
3. Configure beacon UUID, major, and minor values
4. Register beacon positions in the database
5. Calibrate tx_power for your environment

## Future Enhancements

- [ ] A\* pathfinding algorithm implementation
- [ ] Real-time obstacle detection
- [ ] Multi-building support
- [ ] Admin web dashboard
- [ ] Offline mode support
- [ ] AR navigation overlay
- [ ] Voice commands for hands-free operation
- [ ] Integration with building management systems

## Technology Stack

### Mobile

- React Native (Expo)
- TypeScript
- Expo Router
- Expo Speech (TTS)
- Expo Location
- Expo Haptics
- react-native-ble-plx

### Backend

- Node.js
- Express.js
- TypeScript
- PostgreSQL
- JWT Authentication
- bcrypt

## Accessibility Features

- **Voice Feedback**: All interactions announced in Thai
- **Haptic Feedback**: Vibration on button presses
- **Large Touch Targets**: 120-150px buttons
- **High Contrast**: Black text on white background
- **Screen Reader Compatible**: Full accessibility labels
- **Simple Navigation**: 4-button interface

## Contributing

This project is developed as part of SF333 coursework at Thammasat University.

## Contact

For questions or support, please contact the development team.
