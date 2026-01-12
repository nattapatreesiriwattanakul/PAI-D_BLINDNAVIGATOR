import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Alert,
  ScrollView,
  Dimensions,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import * as Haptics from "expo-haptics";
import { Image } from "expo-image";
import AccessibleButton from "../components/AccessibleButton";
import { COLORS, FONT_SIZES } from "../constants/config";
import speechService from "../services/speechService";
import locationService from "../services/locationService";
import { navigationApi, floorApi, roomApi } from "../services/api";
import {
  UserLocation,
  NavigationRoute,
  NavigationStep,
  Floor,
  Room,
} from "../types";

export default function NavigationScreen() {
  const router = useRouter();
  const { buildingId, floorId, floorNumber, roomId, roomNumber } =
    useLocalSearchParams<{
      buildingId: string;
      floorId: string;
      floorNumber: string;
      roomId: string;
      roomNumber: string;
    }>();

  const [loading, setLoading] = useState(true);
  const [navigating, setNavigating] = useState(false);
  const [route, setRoute] = useState<NavigationRoute | null>(null);
  const [currentLocation, setCurrentLocation] = useState<UserLocation | null>(
    null
  );
  const [currentStep, setCurrentStep] = useState(0);
  const [hasArrived, setHasArrived] = useState(false);
  const [floorData, setFloorData] = useState<Floor | null>(null);
  const [destinationRoom, setDestinationRoom] = useState<Room | null>(null);
  const [mapDimensions, setMapDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    initializeNavigation();

    return () => {
      // Cleanup: stop location tracking
      locationService.stopBeaconScanning();
      speechService.stop();
    };
  }, []);

  useEffect(() => {
    if (route && navigating && currentLocation) {
      checkProgress();
    }
  }, [currentLocation]);

  const initializeNavigation = async () => {
    try {
      speechService.speak("กำลังเริ่มการนำทาง กรุณารอสักครู่", true);

      // Load floor and room data
      const [floor, rooms] = await Promise.all([
        floorApi.getById(floorId),
        roomApi.getByFloor(floorId),
      ]);

      setFloorData(floor);

      // Find the destination room
      const targetRoom = rooms.find((r) => r.id === roomId);
      setDestinationRoom(targetRoom || null);

      // Calculate map dimensions for display
      const screenWidth = Dimensions.get("window").width - 40;
      const aspectRatio =
        floor.mapWidth && floor.mapHeight
          ? floor.mapWidth / floor.mapHeight
          : 1;
      const displayHeight = screenWidth / aspectRatio;

      setMapDimensions({
        width: screenWidth,
        height: displayHeight,
      });

      // Set the current floor ID for location tracking
      locationService.setCurrentFloor(floorId);

      // Start location tracking
      locationService.startBeaconScanning(handleLocationUpdate);

      // Wait a bit for location to be acquired
      setTimeout(() => {
        if (!currentLocation) {
          // Use a default starting position if location not available
          // Default to elevator lobby (center of building) or entrance for ground floor
          const defaultX = floorNumber === "1" ? 4.0 : 11.47; // Center X coordinate (elevator lobby)
          const defaultY = floorNumber === "1" ? 10.0 : 15.85; // Entrance for floor 1, elevator for others

          setCurrentLocation({
            x: defaultX,
            y: defaultY,
            floorId: floorId,
            accuracy: 10,
            source: "manual",
          });

          speechService.speak(
            `ไม่พบสัญญาณตำแหน่ง กำลังใช้ตำแหน่งเริ่มต้นที่${
              floorNumber === "1" ? "ทางเข้าหลัก" : "บริเวณลิฟต์"
            }`,
            false
          );
        }
        setLoading(false);
      }, 3000);
    } catch (error) {
      console.error("Error initializing navigation:", error);
      Alert.alert("ข้อผิดพลาด", "ไม่สามารถเริ่มการนำทางได้");
      setLoading(false);
    }
  };

  const handleLocationUpdate = (location: UserLocation) => {
    setCurrentLocation(location);
  };

  const startNavigation = async () => {
    if (!currentLocation) {
      Alert.alert("ไม่พบตำแหน่งปัจจุบัน", "กรุณารอให้ระบบตรวจจับตำแหน่ง");
      return;
    }

    try {
      setNavigating(true);
      speechService.speak("กำลังคำนวณเส้นทาง", true);

      const navRoute = await navigationApi.getRoute(
        currentLocation.floorId,
        roomId,
        currentLocation.x,
        currentLocation.y
      );

      setRoute(navRoute);
      setCurrentStep(0);

      if (navRoute.steps.length > 0) {
        announceCurrentStep(navRoute.steps[0]);
      }
    } catch (error) {
      console.error("Error starting navigation:", error);
      Alert.alert("ข้อผิดพลาด", "ไม่สามารถคำนวณเส้นทางได้");
      setNavigating(false);
    }
  };

  const checkProgress = () => {
    if (!route || !currentLocation || hasArrived) return;

    const step = route.steps[currentStep];
    // Simple distance check (you'd implement more sophisticated logic)
    // For now, we'll use a placeholder

    // Check if arrived at destination
    if (currentStep === route.steps.length - 1) {
      // Simplified arrival check
      setHasArrived(true);
      handleArrival();
    }
  };

  const announceCurrentStep = (step: NavigationStep) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    speechService.announceNavigation(step.instruction, step.distance);

    if (step.floorChange) {
      const floorChangeMsg = `กรุณาเปลี่ยนชั้นจากชั้น ${
        step.floorChange.fromFloor
      } ไปชั้น ${step.floorChange.toFloor} ด้วย${
        step.floorChange.method === "elevator" ? "ลิฟต์" : "บันได"
      }`;
      setTimeout(() => {
        speechService.speak(floorChangeMsg, false);
      }, 2000);
    }
  };

  const handleNextStep = () => {
    if (!route || currentStep >= route.steps.length - 1) return;

    const nextStep = currentStep + 1;
    setCurrentStep(nextStep);
    announceCurrentStep(route.steps[nextStep]);
  };

  const handlePreviousStep = () => {
    if (!route || currentStep <= 0) return;

    const prevStep = currentStep - 1;
    setCurrentStep(prevStep);
    announceCurrentStep(route.steps[prevStep]);
  };

  const handleArrival = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    speechService.announceArrival(roomNumber);

    setTimeout(() => {
      Alert.alert("มาถึงปลายทางแล้ว", `คุณมาถึงห้อง ${roomNumber}`, [
        {
          text: "กลับหน้าแรก",
          onPress: () => router.push("/"),
        },
      ]);
    }, 2000);
  };

  const handleStopNavigation = () => {
    Alert.alert("หยุดการนำทาง", "คุณต้องการหยุดการนำทางหรือไม่?", [
      { text: "ยกเลิก", style: "cancel" },
      {
        text: "หยุด",
        style: "destructive",
        onPress: () => {
          locationService.stopBeaconScanning();
          speechService.stop();
          router.push("/");
        },
      },
    ]);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.PRIMARY} />
        <Text style={styles.loadingText}>กำลังเตรียมการนำทาง...</Text>
      </View>
    );
  }

  const currentStepData = route?.steps[currentStep];

  return (
    <View style={styles.container}>
      {/* Top buttons row */}
      <View style={styles.topRow}>
        <AccessibleButton
          label="หยุด"
          icon="×"
          size="corner"
          variant="danger"
          onPress={handleStopNavigation}
          accessibilityHint="กดเพื่อหยุดการนำทางและกลับหน้าแรก"
        />
        <View style={styles.spacer} />
      </View>

      {/* Middle content area */}
      <ScrollView
        style={styles.middleContent}
        contentContainerStyle={styles.scrollContent}
      >
        <Text style={styles.destination}>ไปยัง: ห้อง {roomNumber}</Text>
        <Text style={styles.floorInfo}>ชั้น {floorNumber}</Text>

        {/* Floor Map with Destination Marker */}
        {floorData && destinationRoom && (
          <View style={styles.mapSection}>
            <Text style={styles.mapTitle}>แผนที่ชั้น {floorNumber}</Text>
            {floorData.mapImageUrl ? (
              <>
                <View style={styles.mapContainer}>
                  <Image
                    source={{ uri: floorData.mapImageUrl }}
                    style={[
                      styles.floorMap,
                      {
                        width: mapDimensions.width,
                        height: mapDimensions.height,
                      },
                    ]}
                    contentFit="contain"
                    transition={300}
                  />
                  {/* Destination Marker */}
                  <View
                    style={[
                      styles.destinationMarker,
                      {
                        left:
                          (destinationRoom.x / (floorData.mapWidth || 50)) *
                            mapDimensions.width -
                          15,
                        top:
                          (destinationRoom.y / (floorData.mapHeight || 40)) *
                            mapDimensions.height -
                          15,
                      },
                    ]}
                  >
                    <Text style={styles.markerText}>📍</Text>
                  </View>
                  {/* Current Location Marker */}
                  {currentLocation && currentLocation.floorId === floorId && (
                    <View
                      style={[
                        styles.currentLocationMarker,
                        {
                          left:
                            (currentLocation.x / (floorData.mapWidth || 50)) *
                              mapDimensions.width -
                            12,
                          top:
                            (currentLocation.y / (floorData.mapHeight || 40)) *
                              mapDimensions.height -
                            12,
                        },
                      ]}
                    >
                      <Text style={styles.currentMarkerText}>👤</Text>
                    </View>
                  )}
                </View>
                {/* Map Legend */}
                <View style={styles.legendContainer}>
                  <View style={styles.legendItem}>
                    <Text style={styles.markerText}>📍</Text>
                    <Text style={styles.legendText}>ห้องปลายทาง</Text>
                  </View>
                  {currentLocation && currentLocation.floorId === floorId && (
                    <View style={styles.legendItem}>
                      <Text style={styles.currentMarkerText}>👤</Text>
                      <Text style={styles.legendText}>ตำแหน่งคุณ</Text>
                    </View>
                  )}
                </View>
              </>
            ) : (
              <View style={styles.noMapContainer}>
                <Text style={styles.noMapText}>ไม่มีแผนที่สำหรับชั้นนี้</Text>
                <Text style={styles.roomInfoText}>
                  ห้องปลายทาง: {destinationRoom.roomNumber}
                </Text>
                <Text style={styles.coordinateText}>
                  ตำแหน่ง: ({destinationRoom.x.toFixed(1)},{" "}
                  {destinationRoom.y.toFixed(1)})
                </Text>
              </View>
            )}
          </View>
        )}

        {!navigating ? (
          <View style={styles.startContainer}>
            <Text style={styles.infoText}>
              {currentLocation
                ? "พร้อมเริ่มการนำทาง"
                : "กำลังตรวจจับตำแหน่ง..."}
            </Text>
            {currentLocation && (
              <Text style={styles.locationInfo}>
                ความแม่นยำ: {currentLocation.accuracy.toFixed(1)} เมตร
              </Text>
            )}
          </View>
        ) : (
          <>
            {route && currentStepData && (
              <View style={styles.navigationInfo}>
                <Text style={styles.stepCounter}>
                  ขั้นตอน {currentStep + 1} / {route.steps.length}
                </Text>
                <Text style={styles.instruction}>
                  {currentStepData.instruction}
                </Text>
                <Text style={styles.distance}>
                  ระยะทาง: {currentStepData.distance.toFixed(0)} เมตร
                </Text>
                {currentStepData.floorChange && (
                  <Text style={styles.floorChange}>
                    เปลี่ยนชั้น: {currentStepData.floorChange.fromFloor} →{" "}
                    {currentStepData.floorChange.toFloor}
                  </Text>
                )}
              </View>
            )}
            {hasArrived && (
              <Text style={styles.arrivedText}>🎉 มาถึงแล้ว! 🎉</Text>
            )}
          </>
        )}
      </ScrollView>

      {/* Bottom buttons row */}
      <View style={styles.bottomRow}>
        {!navigating ? (
          <AccessibleButton
            label="เริ่มนำทาง"
            icon="▶"
            size="large"
            variant="success"
            onPress={startNavigation}
            accessibilityHint="กดเพื่อเริ่มการนำทางไปยังห้องที่เลือก"
          />
        ) : (
          <>
            <AccessibleButton
              label="ก่อนหน้า"
              icon="←"
              size="large"
              variant="secondary"
              onPress={handlePreviousStep}
              accessibilityHint="กดเพื่อย้อนกลับไปขั้นตอนก่อนหน้า"
            />
            <View style={styles.buttonSpacer} />
            <AccessibleButton
              label="ถัดไป"
              icon="→"
              size="large"
              variant="primary"
              onPress={handleNextStep}
              accessibilityHint="กดเพื่อไปขั้นตอนถัดไป"
            />
          </>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND,
    padding: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.BACKGROUND,
  },
  loadingText: {
    marginTop: 20,
    fontSize: FONT_SIZES.LARGE,
    color: COLORS.TEXT,
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  spacer: {
    width: 120,
  },
  middleContent: {
    flex: 1,
  },
  scrollContent: {
    alignItems: "center",
    paddingVertical: 20,
  },
  destination: {
    fontSize: FONT_SIZES.XLARGE,
    fontWeight: "bold",
    color: COLORS.PRIMARY,
    marginBottom: 10,
  },
  floorInfo: {
    fontSize: FONT_SIZES.LARGE,
    color: COLORS.SECONDARY,
    marginBottom: 30,
  },
  startContainer: {
    alignItems: "center",
    marginTop: 40,
  },
  infoText: {
    fontSize: FONT_SIZES.LARGE,
    color: COLORS.TEXT,
    marginBottom: 10,
  },
  locationInfo: {
    fontSize: FONT_SIZES.LARGE,
    color: COLORS.TEXT,
  },
  navigationInfo: {
    alignItems: "center",
    paddingHorizontal: 20,
  },
  stepCounter: {
    fontSize: FONT_SIZES.LARGE,
    color: COLORS.TEXT,
    marginBottom: 20,
  },
  instruction: {
    fontSize: FONT_SIZES.XLARGE,
    fontWeight: "bold",
    color: COLORS.PRIMARY,
    textAlign: "center",
    marginBottom: 20,
  },
  distance: {
    fontSize: FONT_SIZES.LARGE,
    color: COLORS.TEXT,
    marginBottom: 10,
  },
  floorChange: {
    fontSize: FONT_SIZES.LARGE,
    color: COLORS.SECONDARY,
    fontWeight: "600",
    marginTop: 10,
  },
  arrivedText: {
    fontSize: FONT_SIZES.XXLARGE,
    fontWeight: "bold",
    color: COLORS.SUCCESS,
    marginTop: 30,
    textAlign: "center",
  },
  bottomRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 20,
  },
  buttonSpacer: {
    width: 40,
  },
  mapSection: {
    width: "100%",
    marginBottom: 20,
  },
  mapTitle: {
    fontSize: FONT_SIZES.LARGE,
    fontWeight: "600",
    color: COLORS.TEXT,
    marginBottom: 10,
    textAlign: "center",
  },
  mapContainer: {
    position: "relative",
    marginBottom: 20,
    borderWidth: 2,
    borderColor: COLORS.PRIMARY,
    borderRadius: 8,
    overflow: "hidden",
    backgroundColor: "#F5F5F5",
  },
  floorMap: {
    backgroundColor: "transparent",
  },
  destinationMarker: {
    position: "absolute",
    width: 30,
    height: 30,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255, 0, 0, 0.2)",
    borderRadius: 15,
    borderWidth: 3,
    borderColor: "#FF0000",
  },
  markerText: {
    fontSize: 24,
  },
  currentLocationMarker: {
    position: "absolute",
    width: 24,
    height: 24,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 102, 204, 0.2)",
    borderRadius: 12,
    borderWidth: 2,
    borderColor: COLORS.PRIMARY,
  },
  currentMarkerText: {
    fontSize: 20,
  },
  noMapContainer: {
    padding: 20,
    backgroundColor: "#F0F0F0",
    borderRadius: 8,
    borderWidth: 2,
    borderColor: COLORS.SECONDARY,
    alignItems: "center",
  },
  noMapText: {
    fontSize: FONT_SIZES.LARGE,
    color: COLORS.TEXT,
    marginBottom: 15,
  },
  roomInfoText: {
    fontSize: FONT_SIZES.LARGE,
    color: COLORS.PRIMARY,
    fontWeight: "600",
    marginBottom: 10,
  },
  coordinateText: {
    fontSize: FONT_SIZES.LARGE - 4,
    color: COLORS.SECONDARY,
  },
  legendContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
    paddingVertical: 10,
    backgroundColor: "#F9F9F9",
    borderRadius: 8,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 15,
  },
  legendText: {
    fontSize: FONT_SIZES.LARGE - 4,
    color: COLORS.TEXT,
    marginLeft: 8,
  },
});
