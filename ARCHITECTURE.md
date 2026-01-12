# Pai Dee (ไปดี) - System Architecture

## Overview

Pai Dee is a three-tier indoor navigation system designed specifically for blind users, combining mobile app, backend API, and admin management interfaces.

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                        CLIENT LAYER                              │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌──────────────────────┐         ┌──────────────────────┐      │
│  │   Mobile App (Expo)  │         │   Admin Panel (Web)  │      │
│  │  - React Native      │         │   - HTML/CSS/JS      │      │
│  │  - TypeScript        │         │   - REST API Client  │      │
│  │  - Expo Router       │         │                      │      │
│  │  - Voice Navigation  │         │   Manage:            │      │
│  │  - BLE Scanner       │         │   - Buildings        │      │
│  │  - GPS Location      │         │   - Floors           │      │
│  └──────────────────────┘         │   - Rooms            │      │
│           │                        │   - Beacons          │      │
│           │ HTTPS/REST             └──────────────────────┘      │
│           │                                 │                    │
└───────────┼─────────────────────────────────┼────────────────────┘
            │                                 │
            └─────────────┬───────────────────┘
                          │
┌─────────────────────────▼─────────────────────────────────────┐
│                     API LAYER (Node.js)                        │
├────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌────────────────────────────────────────────────────┐        │
│  │              Express.js REST API                    │        │
│  │                                                     │        │
│  │  Routes:                                            │        │
│  │  ├─ /api/buildings     (CRUD operations)           │        │
│  │  ├─ /api/floors        (CRUD operations)           │        │
│  │  ├─ /api/rooms         (CRUD + Search)             │        │
│  │  ├─ /api/navigation    (Pathfinding)               │        │
│  │  ├─ /api/beacons       (CRUD + Localization)       │        │
│  │  └─ /api/admin         (Authentication)            │        │
│  │                                                     │        │
│  │  Services:                                          │        │
│  │  ├─ Navigation Service (A* pathfinding)            │        │
│  │  ├─ Beacon Service     (Trilateration)             │        │
│  │  └─ Auth Service       (JWT tokens)                │        │
│  └────────────────────────────────────────────────────┘        │
│                          │                                      │
└──────────────────────────┼──────────────────────────────────────┘
                           │
                           │ SQL Queries
                           │
┌──────────────────────────▼──────────────────────────────────────┐
│                   DATABASE LAYER (PostgreSQL)                    │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Tables:                                                         │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │  buildings   │  │    floors    │  │    rooms     │          │
│  ├──────────────┤  ├──────────────┤  ├──────────────┤          │
│  │ id (PK)      │  │ id (PK)      │  │ id (PK)      │          │
│  │ name         │  │ building_id  │  │ floor_id     │          │
│  │ address      │  │ floor_number │  │ room_number  │          │
│  │ lat/lng      │  │ floor_name   │  │ room_name    │          │
│  └──────────────┘  │ map_url      │  │ x, y coords  │          │
│         │          │ dimensions   │  │ node_id      │          │
│         │          └──────────────┘  └──────────────┘          │
│         │                 │                  │                  │
│         └─────────────────┴──────────────────┘                  │
│                                                                  │
│  ┌────────────────┐  ┌────────────────┐  ┌──────────────┐      │
│  │ navigation_    │  │ navigation_    │  │   beacons    │      │
│  │    nodes       │  │    paths       │  ├──────────────┤      │
│  ├────────────────┤  ├────────────────┤  │ id (PK)      │      │
│  │ id (PK)        │  │ id (PK)        │  │ uuid         │      │
│  │ floor_id       │  │ from_node_id   │  │ major/minor  │      │
│  │ x, y coords    │  │ to_node_id     │  │ floor_id     │      │
│  │ node_type      │  │ distance       │  │ x, y coords  │      │
│  │ room_id        │  │ direction      │  │ tx_power     │      │
│  └────────────────┘  │ instructions   │  └──────────────┘      │
│         │            └────────────────┘          │              │
│         └──────────────────┬─────────────────────┘              │
│                            │                                    │
│                   Navigation Graph                              │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
```

## Component Details

### Mobile App Architecture

```
mobile/
├── app/                          # Screens (Expo Router)
│   ├── index.tsx                 # Home/Landing screen
│   ├── floor-selection.tsx       # Floor selection screen
│   ├── room-selection.tsx        # Room selection screen
│   ├── navigation.tsx            # Active navigation screen
│   └── _layout.tsx               # Root layout
│
├── components/                   # Reusable UI components
│   └── AccessibleButton.tsx      # Large, accessible button
│
├── services/                     # Business logic
│   ├── api.ts                    # API client (axios)
│   ├── locationService.ts        # BLE/GPS positioning
│   └── speechService.ts          # Text-to-speech (Thai)
│
├── types/                        # TypeScript definitions
│   └── index.ts                  # Shared types
│
└── constants/                    # Configuration
    └── config.ts                 # App constants
```

### Backend API Architecture

```
backend/
├── src/
│   ├── server.ts                 # Express app entry point
│   ├── config/
│   │   └── database.ts           # PostgreSQL connection pool
│   │
│   ├── routes/                   # API endpoints
│   │   ├── buildings.ts          # Building CRUD
│   │   ├── floors.ts             # Floor CRUD
│   │   ├── rooms.ts              # Room CRUD + search
│   │   ├── navigation.ts         # Pathfinding logic
│   │   ├── beacons.ts            # Beacon management + localization
│   │   └── admin.ts              # Authentication
│   │
│   └── database/
│       ├── schema.sql            # Database structure
│       └── sample-data.sql       # Test data
│
└── admin-panel.html              # Web admin interface
```

## Data Flow

### 1. User Navigation Flow

```
User Opens App
    ↓
Select Building (Auto or Manual)
    ↓
Select Floor (+ / - buttons)
    ↓ [Voice: "ชั้น 3"]
Confirm Floor (✓ button)
    ↓
Select Room (+ / - buttons)
    ↓ [Voice: "ห้อง 301"]
Confirm Room (✓ button)
    ↓
Calculate Route
    ├─ Get user location (BLE or GPS)
    ├─ Get navigation graph from API
    ├─ Run pathfinding algorithm
    └─ Generate step-by-step instructions
    ↓
Navigate
    ├─ Announce current instruction [Voice]
    ├─ Track user position continuously
    ├─ Update progress on each step
    ├─ Vibrate on waypoint approach [Haptic]
    └─ Check arrival condition
    ↓
Arrival [Voice: "คุณมาถึงห้อง 301 แล้ว"]
```

### 2. Location Detection Flow

```
BLE Beacons Detected (Primary)
    ↓
Scan for beacons (continuous)
    ↓
Collect RSSI values from nearby beacons
    ↓
Send to API: /api/beacons/locate
    ├─ Match beacon UUIDs with database
    ├─ Convert RSSI to distance
    ├─ Apply trilateration algorithm
    └─ Return (x, y, floor_id, accuracy)
    ↓
Update user position on map

GPS Available (Fallback)
    ↓
Get GPS coordinates
    ↓
Convert to building coordinates
    ↓
Less accurate for indoor use
```

### 3. Pathfinding Algorithm

```
Input: Start Position, Destination Room
    ↓
1. Find nearest navigation node to start
    ↓
2. Get destination room's navigation node
    ↓
3. Check if same floor
    ├─ YES → Direct path calculation
    └─ NO  → Multi-floor path
        ├─ Find nearest elevator/stairs
        ├─ Path to elevator on current floor
        ├─ Floor change step
        └─ Path from elevator to destination
    ↓
4. Generate turn-by-turn instructions
    ├─ Calculate distance for each segment
    ├─ Determine direction (N/S/E/W)
    └─ Create Thai language instruction
    ↓
5. Return NavigationRoute object
```

## Technology Stack

### Frontend (Mobile)

- **React Native**: Cross-platform mobile framework
- **Expo**: Development platform and tooling
- **TypeScript**: Type-safe JavaScript
- **Expo Router**: File-based routing
- **Expo Speech**: Text-to-speech (Thai support)
- **Expo Location**: GPS positioning
- **Expo Haptics**: Vibration feedback
- **react-native-ble-plx**: Bluetooth Low Energy
- **axios**: HTTP client

### Backend

- **Node.js**: JavaScript runtime
- **Express.js**: Web framework
- **TypeScript**: Type-safe JavaScript
- **PostgreSQL**: Relational database
- **node-postgres (pg)**: Database driver
- **bcrypt**: Password hashing
- **jsonwebtoken**: JWT authentication
- **dotenv**: Environment configuration

### Database

- **PostgreSQL 14+**: Primary data store
- **UUID**: Primary keys
- **Spatial data**: X/Y coordinates
- **Triggers**: Auto-update timestamps
- **Indexes**: Optimized queries

## Security Considerations

### API Security

- JWT token authentication for admin
- CORS configuration
- Input validation
- SQL injection prevention (parameterized queries)
- Password hashing (bcrypt)

### Mobile Security

- HTTPS for all API calls
- Secure token storage
- Location permission handling
- Data encryption at rest (future)

## Scalability Considerations

### Database

- Indexed foreign keys
- Optimized spatial queries
- Connection pooling
- Read replicas (future)

### API

- Stateless design
- Horizontal scaling ready
- Caching strategy (future)
- Load balancing (future)

### Mobile

- Offline mode (future)
- Progressive data loading
- Image optimization
- Efficient BLE scanning

## Accessibility Features

### Visual

- High contrast colors (black on white)
- Large font sizes (32-64px)
- Extra-large buttons (120-150px)
- Simple 4-button layout

### Audio

- Thai language TTS
- Voice announcements for all actions
- Navigation instructions
- Arrival notifications

### Haptic

- Button press feedback
- Waypoint approach vibrations
- Success/error patterns

### Screen Reader

- Full accessibility labels
- Semantic HTML/React Native elements
- Focus management

## Future Enhancements

1. **Advanced Navigation**

   - A\* pathfinding implementation
   - Real-time obstacle detection
   - Alternative route suggestions

2. **Admin Features**

   - Visual floor plan editor
   - Drag-and-drop beacon placement
   - Navigation graph visualization

3. **User Features**

   - Voice commands
   - Favorites/history
   - Multi-language support
   - AR navigation overlay

4. **Infrastructure**
   - Offline mode
   - Cloud deployment
   - Real-time analytics
   - Building management system integration

## Performance Targets

- API response time: < 200ms
- BLE scan interval: 1 second
- Position accuracy: ± 3 meters
- Voice instruction latency: < 500ms
- Database query time: < 100ms

## Monitoring & Logging

- API endpoint metrics
- Error tracking
- User navigation paths
- Beacon signal quality
- System health checks
