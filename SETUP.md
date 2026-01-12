# Pai Dee - Quick Start Guide

## System Requirements

### Development Environment

- **Node.js**: Version 18 or higher
- **PostgreSQL**: Version 14 or higher
- **Expo CLI**: Latest version
- **Git**: For version control

### Mobile Development

- **For iOS**: macOS with Xcode installed
- **For Android**: Android Studio or Android SDK
- **For Testing**: Expo Go app on physical device

## Quick Setup (Windows)

### 1. Install PostgreSQL

```bash
# Download and install PostgreSQL from:
# https://www.postgresql.org/download/windows/

# After installation, verify:
psql --version
```

### 2. Create Database

```bash
# Open Command Prompt and run:
psql -U postgres

# In psql console:
CREATE DATABASE pai_dee_db;
\q
```

### 3. Setup Backend

```bash
cd backend

# Install dependencies
npm install

# Create .env file
copy .env.example .env

# Edit .env file with your database credentials
# DB_HOST=localhost
# DB_PORT=5432
# DB_NAME=pai_dee_db
# DB_USER=postgres
# DB_PASSWORD=your_password

# Run database schema
psql -U postgres -d pai_dee_db -f src/database/schema.sql

# Insert sample data
psql -U postgres -d pai_dee_db -f src/database/sample-data.sql

# Start backend server
npm run dev
```

The backend API will start on `http://localhost:3000`

### 4. Setup Mobile App

```bash
cd mobile

# Install dependencies
npm install

# Start Expo development server
npm start
```

### 5. Run Mobile App

#### Option A: Physical Device (Recommended for testing location features)

1. Install **Expo Go** app from App Store (iOS) or Play Store (Android)
2. Scan the QR code shown in terminal with Expo Go app
3. App will load on your device

#### Option B: Emulator

```bash
# For Android
npm run android

# For iOS (macOS only)
npm run ios
```

### 6. Open Admin Panel

Open `backend/admin-panel.html` in your web browser

**Default Login:**

- Username: `admin`
- Password: `admin123`

## Testing the Application

### 1. Test API Endpoints

```bash
# Check API health
curl http://localhost:3000/api/health

# Get buildings
curl http://localhost:3000/api/buildings

# Get floors for a building (use ID from previous call)
curl http://localhost:3000/api/buildings/{building-id}/floors
```

### 2. Test Mobile App Flow

1. **Home Screen**: App opens with welcome message in Thai
2. **Select Floor**: Tap "เริ่มต้น" to go to floor selection
3. **Navigate Floors**: Use "+/-" buttons to browse floors
4. **Select Room**: Confirm floor, then select room
5. **Start Navigation**: Confirm room to start navigation

### 3. Test Location Services

**For BLE Beacons** (requires actual beacons):

- Place 3-4 BLE beacons around test area
- Register beacon positions in database
- App will automatically detect and calculate position

**For GPS Fallback**:

- App will use GPS when BLE beacons are not available
- Less accurate for indoor positioning

## Database Structure Overview

```
buildings
  └─ floors
      ├─ rooms
      ├─ navigation_nodes
      │   └─ navigation_paths
      └─ beacons
```

## Adding Your Building Data

### Via Admin Panel

1. **Add Building**

   - Name: Your building name
   - Address: Full address
   - Latitude/Longitude: GPS coordinates

2. **Add Floors**

   - Floor number: 1, 2, 3, etc.
   - Floor name: Optional descriptive name
   - Map dimensions: Width x Height in meters

3. **Add Rooms**

   - Room number: e.g., 301, 302, 301-1
   - Room name: Descriptive name
   - X, Y coordinates: Position on floor map

4. **Add Beacons**
   - UUID: Beacon identifier
   - Major/Minor: Beacon numbers
   - X, Y coordinates: Beacon position

### Via SQL

```sql
-- Add building
INSERT INTO buildings (name, address, latitude, longitude)
VALUES ('My Building', '123 Street', 13.7563, 100.5018);

-- Add floor
INSERT INTO floors (building_id, floor_number, floor_name, map_width, map_height)
VALUES ('{building-id}', 1, 'Ground Floor', 50.0, 40.0);

-- Add room
INSERT INTO rooms (floor_id, room_number, room_name, x, y)
VALUES ('{floor-id}', '101', 'Room 101', 10.0, 20.0);
```

## Troubleshooting

### Backend Issues

**Cannot connect to database:**

```bash
# Check PostgreSQL is running
sc query postgresql-x64-14

# Check connection in .env file
# Verify DB_HOST, DB_PORT, DB_USER, DB_PASSWORD
```

**Port 3000 already in use:**

```bash
# Change PORT in .env file
PORT=3001
```

### Mobile App Issues

**Cannot connect to API:**

1. Update API_BASE_URL in `mobile/constants/config.ts`
2. Use your computer's IP address instead of localhost
3. Example: `http://192.168.1.100:3000/api`

**Expo Go not loading:**

```bash
# Clear Expo cache
npm start -- --clear

# Or reset Expo
npx expo start -c
```

**Location services not working:**

- Grant location permissions when prompted
- For BLE: Enable Bluetooth
- Test on physical device (emulators have limitations)

## Development Tips

### Hot Reload

- **Mobile**: Changes auto-reload in Expo
- **Backend**: Nodemon auto-restarts on file changes
- **Admin Panel**: Refresh browser after changes

### Debugging

**Mobile App:**

```bash
# View logs
npx react-native log-android  # Android
npx react-native log-ios      # iOS
```

**Backend:**

```bash
# View detailed logs
npm run dev
```

### Database Management

```bash
# View all tables
psql -U postgres -d pai_dee_db
\dt

# View table structure
\d buildings

# Query data
SELECT * FROM buildings;
```

## Next Steps

1. **Customize for your building**:

   - Update building information
   - Add accurate floor plans
   - Configure room layout

2. **Deploy BLE beacons**:

   - Purchase BLE beacons (iBeacon compatible)
   - Configure beacon UUIDs
   - Install at strategic locations
   - Register positions in database

3. **Test navigation**:

   - Walk through building
   - Verify navigation instructions
   - Adjust beacon positions if needed

4. **Enhance features**:
   - Add more buildings
   - Improve pathfinding algorithm
   - Add admin authentication
   - Deploy to production server

## Production Deployment

### Backend (Example: Heroku, DigitalOcean, AWS)

```bash
npm run build
npm start
```

### Database (PostgreSQL Cloud)

- Heroku Postgres
- AWS RDS
- Google Cloud SQL
- Azure Database for PostgreSQL

### Mobile App

```bash
# Build for production
eas build --platform android
eas build --platform ios

# Submit to stores
eas submit -p android
eas submit -p ios
```

## Support & Resources

- **Expo Documentation**: https://docs.expo.dev/
- **React Native**: https://reactnative.dev/
- **PostgreSQL**: https://www.postgresql.org/docs/
- **Express.js**: https://expressjs.com/

## Team Contact

For questions, issues, or contributions, contact the SF333 development team at Thammasat University.
