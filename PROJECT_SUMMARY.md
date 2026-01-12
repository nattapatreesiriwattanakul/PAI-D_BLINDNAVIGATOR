# Pai Dee (ไปดี) - Project Summary

## Project Overview

**Pai Dee** is an indoor navigation mobile application specifically designed for visually impaired users, featuring voice-guided navigation in Thai language, large accessible buttons, and BLE beacon-based positioning.

### Key Innovation

Unlike traditional GPS-based navigation apps which struggle indoors, Pai Dee uses:

- **BLE Beacon Triangulation** for accurate indoor positioning (±3m accuracy)
- **Voice-First Interface** with continuous Thai language feedback
- **Accessibility-Optimized UI** with extra-large touch targets and haptic feedback
- **Multi-Floor Navigation** with automatic elevator routing

## Project Structure

```
Pai-nai/
├── mobile/                    # React Native Expo App
│   ├── app/                   # Screens (Expo Router)
│   ├── components/            # Reusable UI components
│   ├── services/              # API & Location services
│   ├── types/                 # TypeScript definitions
│   └── constants/             # Configuration
│
├── backend/                   # Express.js API Server
│   ├── src/
│   │   ├── routes/            # API endpoints
│   │   ├── config/            # Database config
│   │   └── database/          # SQL schemas
│   └── admin-panel.html       # Web admin interface
│
├── README.md                  # Main documentation
├── SETUP.md                   # Setup instructions
├── ARCHITECTURE.md            # System architecture
├── setup.bat / setup.sh       # Installation scripts
└── .gitignore                 # Git ignore rules
```

## Core Features

### Mobile App Features

1. **Home Screen**: Welcome and building selection
2. **Floor Selection**: Browse floors using +/- buttons
3. **Room Selection**: Choose destination room
4. **Navigation**: Step-by-step voice-guided navigation
5. **Location Tracking**: Real-time position via BLE/GPS
6. **Voice Feedback**: All interactions announced in Thai
7. **Haptic Feedback**: Vibration on button press and waypoints

### Backend Features

1. **Building Management**: CRUD for buildings, floors, rooms
2. **Navigation Engine**: Pathfinding algorithm
3. **Beacon Management**: BLE beacon positioning system
4. **Admin Authentication**: JWT-based login
5. **RESTful API**: JSON responses for all endpoints

### Admin Panel Features

1. **Building Management**: Add/edit/delete buildings
2. **Floor Management**: Configure floor layouts
3. **Room Management**: Place rooms with coordinates
4. **Beacon Configuration**: Deploy and manage BLE beacons
5. **Visual Interface**: Easy-to-use web interface

## Technology Stack

### Mobile App

- **Framework**: React Native with Expo
- **Language**: TypeScript
- **Navigation**: Expo Router (file-based)
- **Voice**: Expo Speech (Thai TTS)
- **Location**: Expo Location + react-native-ble-plx
- **UI**: React Native core components
- **HTTP**: Axios

### Backend

- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: PostgreSQL 14+
- **Authentication**: JWT + bcrypt
- **ORM**: node-postgres (raw SQL)

### Database

- **System**: PostgreSQL
- **Schema**: Relational (buildings → floors → rooms)
- **Spatial Data**: X/Y coordinates for positioning
- **Graph**: Navigation nodes and paths

## Database Schema

### Core Tables

1. **buildings**: Building information with GPS
2. **floors**: Floor layouts with dimensions
3. **rooms**: Individual rooms with coordinates
4. **navigation_nodes**: Graph nodes for pathfinding
5. **navigation_paths**: Graph edges with directions
6. **beacons**: BLE beacon positions
7. **admin_users**: Admin authentication

### Relationships

```
buildings (1) ─→ (N) floors (1) ─→ (N) rooms
                     └─→ (N) navigation_nodes (1) ─→ (N) navigation_paths
                     └─→ (N) beacons
```

## User Flow

### Navigation Flow

1. User opens app → Thai welcome message
2. Select floor → Voice announces floor number
3. Increase/decrease floor → Voice feedback on each change
4. Confirm floor → Proceed to room selection
5. Select room → Voice announces room number
6. Confirm room → Calculate navigation route
7. Start navigation → Voice instructions begin
8. User walks → Position tracked via BLE beacons
9. Approach waypoint → Haptic feedback + new instruction
10. Reach destination → "คุณมาถึงห้อง XXX แล้ว"

### Admin Flow

1. Login to admin panel
2. Add building with GPS coordinates
3. Add floors with dimensions
4. Add rooms with X/Y positions
5. Deploy physical BLE beacons
6. Register beacons in system
7. Test navigation on mobile app

## Accessibility Features

### For Blind Users

- **Extra-Large Buttons**: 120-150px touch targets
- **Voice Announcements**: Every action spoken in Thai
- **Simple Layout**: 4-button interface (back, confirm, decrease, increase)
- **Haptic Feedback**: Vibration confirms actions
- **Screen Reader Support**: Full accessibility labels
- **High Contrast**: Black text on white background

### Design Principles

- **Voice-First**: Audio feedback is primary interface
- **Touch-Friendly**: Large, well-spaced buttons
- **Forgiving**: Easy to navigate without seeing
- **Consistent**: Same 4-button layout throughout
- **Informative**: Clear status and position announcements

## Room Number Format

Standard format: **XYZ** (3 digits)

- **X**: Floor number (e.g., 3 for 3rd floor)
- **YZ**: Room number (01-99)
- **Examples**:
  - 301 = Floor 3, Room 01
  - 205 = Floor 2, Room 05
  - 101 = Floor 1, Room 01

Extended format: **XYZ-N**

- Sub-rooms: 301-1, 301-2 (multiple rooms in same area)

## Indoor Positioning

### BLE Beacon System

- **Technology**: Bluetooth Low Energy (iBeacon protocol)
- **Method**: Trilateration using 3+ beacons
- **Accuracy**: ±3 meters in optimal conditions
- **Update Rate**: 1 second
- **Coverage**: 4-6 beacons per floor recommended

### GPS Fallback

- **Use Case**: When BLE beacons unavailable
- **Accuracy**: ±10-20 meters (poor indoors)
- **Method**: Standard GPS positioning
- **Limitation**: Limited usefulness inside buildings

## API Endpoints

### Public Endpoints

- `GET /api/buildings` - List all buildings
- `GET /api/buildings/:id/floors` - Get building floors
- `GET /api/floors/:id/rooms` - Get floor rooms
- `POST /api/navigation/route` - Calculate navigation route
- `POST /api/beacons/locate` - Locate user by beacons

### Admin Endpoints (Requires Auth)

- `POST /api/admin/login` - Admin login
- `POST /api/buildings` - Create building
- `POST /api/floors` - Create floor
- `POST /api/rooms` - Create room
- `POST /api/beacons` - Create beacon
- `DELETE /api/*` - Delete operations

## Installation

### Quick Start (Windows)

```bash
# Run setup script
setup.bat

# Follow on-screen instructions
```

### Quick Start (Linux/Mac)

```bash
# Make script executable
chmod +x setup.sh

# Run setup script
./setup.sh
```

### Manual Setup

See `SETUP.md` for detailed instructions.

## Development

### Start Backend

```bash
cd backend
npm run dev
# Server runs on http://localhost:3000
```

### Start Mobile App

```bash
cd mobile
npm start
# Scan QR code with Expo Go app
```

### Open Admin Panel

Open `backend/admin-panel.html` in web browser

## Testing

### Test Backend API

```bash
# Health check
curl http://localhost:3000/api/health

# Get buildings
curl http://localhost:3000/api/buildings
```

### Test Mobile App

1. Open in Expo Go
2. Grant location and Bluetooth permissions
3. Test navigation through interface
4. Verify voice announcements work

### Test BLE Positioning

1. Deploy 3+ physical BLE beacons
2. Configure beacon positions in database
3. Walk around with app open
4. Verify position accuracy

## Deployment

### Backend Deployment

- **Hosting**: Heroku, AWS, DigitalOcean, Azure
- **Database**: PostgreSQL cloud (RDS, Heroku Postgres)
- **Build**: `npm run build && npm start`

### Mobile App Deployment

- **Android**: Build APK with `eas build --platform android`
- **iOS**: Build IPA with `eas build --platform ios`
- **Store**: Submit via `eas submit`

## Future Enhancements

### Short Term

- [ ] Implement proper A\* pathfinding
- [ ] Add voice commands (hands-free)
- [ ] Offline mode with cached maps
- [ ] Visual map for sighted companions

### Medium Term

- [ ] Multi-building support
- [ ] User accounts and preferences
- [ ] Navigation history
- [ ] Favorite destinations
- [ ] QR code room identification

### Long Term

- [ ] AR navigation overlay
- [ ] Real-time obstacle detection
- [ ] Integration with building systems
- [ ] Multi-language support
- [ ] Community-contributed maps

## Performance Targets

- API Response: < 200ms
- BLE Scan Rate: 1 Hz
- Position Accuracy: ±3m with beacons
- Voice Latency: < 500ms
- Database Queries: < 100ms

## Security

- HTTPS for API communication
- JWT token authentication
- Password hashing (bcrypt)
- SQL injection prevention
- CORS configuration
- Input validation

## Known Limitations

1. **BLE Beacon Dependency**: Requires physical beacon deployment
2. **Indoor GPS**: Poor accuracy without beacons
3. **Building Data**: Requires manual input of building layouts
4. **Single Building**: Current focus on one building at a time
5. **Thai Language**: Primary support for Thai only

## Contributing

This is an academic project for SF333 at Thammasat University. For contributions:

1. Fork the repository
2. Create a feature branch
3. Make changes with proper documentation
4. Submit pull request with description

## Team

Developed by students at Thammasat University for SF333 course.

## Support

For issues, questions, or suggestions:

- Check documentation: README.md, SETUP.md, ARCHITECTURE.md
- Review sample data: backend/src/database/sample-data.sql
- Test with provided examples

## Acknowledgments

Special thanks to:

- Visually impaired users who provided feedback
- Open source community for excellent tools and libraries

---

**Version**: 1.0.0  
**Last Updated**: November 2025  
**Status**: Production Ready (Single Building)
