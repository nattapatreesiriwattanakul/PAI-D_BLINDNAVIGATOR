# Floor Map Visualization Feature

## Overview

The navigation screen now displays the floor layout with visual markers showing:

- 📍 **Red marker** - Your destination room
- 👤 **Blue marker** - Your current location (when on the same floor)

## Features

### 1. Interactive Floor Map

- Displays the uploaded floor map image from the database
- Automatically scales to fit the screen while maintaining aspect ratio
- Shows real-time position markers overlaid on the map

### 2. Visual Markers

- **Destination Marker (📍)**: Red pin with transparent red circle marking the target room
- **Current Location Marker (👤)**: Blue person icon with transparent blue circle showing your position
- Markers are positioned based on coordinate mapping from the database

### 3. Map Legend

- Clear legend below the map showing what each marker represents
- Only displays relevant markers (e.g., current location only shown when on the same floor)

### 4. Fallback Display

When no floor map is uploaded:

- Shows a placeholder with room information
- Displays room number and coordinates
- Provides context even without a visual map

### 5. Navigation Instructions

The map is displayed alongside:

- Step-by-step navigation instructions
- Distance information
- Floor change notifications
- Progress indicators (Step X of Y)

## How to Use

### For Users

1. Select your destination room
2. On the navigation screen, you'll see:
   - The floor map at the top
   - Your destination marked with 📍
   - Your current position marked with 👤 (if available)
   - Navigation instructions below the map
3. Press "เริ่มนำทาง" (Start Navigation) to begin
4. Follow the instructions and watch your progress on the map

### For Administrators

To upload floor maps:

1. Open the admin panel: `http://localhost:3000/admin-panel.html`
2. Navigate to the "Floors" section
3. Click "Edit" on the floor you want to update
4. Upload a floor map image (PNG, JPG, or SVG format recommended)
5. The image will be uploaded to Cloudinary automatically
6. Save the changes

## Technical Details

### Coordinate System

- Maps use a coordinate system in meters
- X-axis: horizontal position (0 to mapWidth)
- Y-axis: vertical position (0 to mapHeight)
- Origin (0,0) is at the top-left corner of the map

### Marker Positioning

Markers are positioned using the formula:

```
displayX = (roomX / mapWidth) * displayWidth
displayY = (roomY / mapHeight) * displayHeight
```

### Data Requirements

For proper map display, the database should have:

- `floors.map_image_url`: URL to the floor map image
- `floors.map_width`: Physical width of the floor in meters
- `floors.map_height`: Physical height of the floor in meters
- `rooms.x`: Room X coordinate in meters
- `rooms.y`: Room Y coordinate in meters

### API Endpoints Used

- `GET /api/floors/:id` - Fetch floor data including map URL
- `GET /api/floors/:id/rooms` - Fetch all rooms on the floor
- `POST /api/navigation/route` - Calculate navigation route

## Accessibility Features

- Large, clear text (minimum 28pt)
- High contrast colors for visibility
- Voice announcements for navigation steps
- Haptic feedback for step changes
- Works without map images (fallback display)

## Responsive Design

- Map automatically scales to screen size
- Maintains aspect ratio of uploaded images
- Works on various screen sizes and orientations
- Scrollable content for longer instructions

## Testing Without Floor Maps

If you haven't uploaded floor maps yet, the system will:

1. Show a placeholder message: "ไม่มีแผนที่สำหรับชั้นนี้"
2. Display room information (number and coordinates)
3. Still provide full navigation instructions
4. Function normally for voice-guided navigation

## Future Enhancements

Potential improvements for this feature:

- Real-time path visualization on the map
- Turn-by-turn arrow indicators
- 3D floor visualization
- Indoor routing path overlay
- Zoom and pan functionality
- Multiple floor view for multi-floor navigation
- Beacon visualization on the map
