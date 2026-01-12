import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
} from "react-native";
import { useRouter } from "expo-router";
import { Image } from "expo-image";
import { COLORS, FONT_SIZES } from "../constants/config";
import speechService from "../services/speechService";
import { buildingApi, floorApi } from "../services/api";
import { Building, Floor } from "../types";

export default function Index() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [buildings, setBuildings] = useState<Building[]>([]);
  const [selectedBuilding, setSelectedBuilding] = useState<Building | null>(
    null
  );

  useEffect(() => {
    loadBuildings();
    // Welcome message with detailed instructions for blind users
    speechService.speak(
      "ยินดีต้อนรับสู่แอปพลิเคชัน ไปดี ระบบนำทางในอาคารสำหรับผู้พิการทางสายตา กดปุ่มเริ่มต้นด้านล่างของจอเพื่อเริ่มใช้งาน",
      true
    );
  }, []);

  const loadBuildings = async () => {
    try {
      const data = await buildingApi.getAll();
      setBuildings(data);
      if (data.length > 0) {
        setSelectedBuilding(data[0]); // Default to first building
      }
    } catch (error) {
      console.error("Error loading buildings:", error);
      Alert.alert("ข้อผิดพลาด", "ไม่สามารถโหลดข้อมูลอาคารได้");
    } finally {
      setLoading(false);
    }
  };

  const handleSelectFloor = () => {
    if (!selectedBuilding) {
      Alert.alert("กรุณาเลือกอาคาร");
      return;
    }

    router.push({
      pathname: "/floor-selection",
      params: { buildingId: selectedBuilding.id },
    });
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.PRIMARY} />
        <Text style={styles.loadingText}>กำลังโหลด...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Middle content area */}
      <View style={styles.middleContent}>
        <Image
          source={{
            uri: "https://res.cloudinary.com/dj40q9olm/image/upload/v1763283586/Logo_No_Name_lfggfb.png",
          }}
          style={styles.mainLogo}
          contentFit="contain"
        />
        <Text style={styles.subtitle}>Pai Dee</Text>
        <Text style={styles.description}>
          ระบบนำทางในอาคารสำหรับผู้พิการทางสายตา
        </Text>
        {selectedBuilding && (
          <Text style={styles.buildingName}>
            อาคาร: {selectedBuilding.name}
          </Text>
        )}
      </View>

      {/* Bottom button - full width */}
      <TouchableOpacity
        style={styles.startButton}
        onPress={handleSelectFloor}
        accessible={true}
        accessibilityLabel="ปุ่มเริ่มต้น"
        accessibilityHint="ปุ่มนี้อยู่ด้านล่างของจอ กดเพื่อเริ่มเลือกชั้นและห้องที่ต้องการไป ระบบจะนำทางคุณไปยังจุดหมายปลายทาง"
      >
        <Text style={styles.startButtonText}>เริ่มต้น</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND,
    alignItems: "center",
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
  middleContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
    marginBottom: 180,
  },
  mainLogo: {
    width: 200,
    height: 200,
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 28,
    color: COLORS.SECONDARY,
    fontWeight: "600",
    marginBottom: 15,
  },
  description: {
    fontSize: 16,
    color: COLORS.TEXT,
    textAlign: "center",
    paddingHorizontal: 20,
    lineHeight: 24,
  },
  buildingName: {
    fontSize: 18,
    color: COLORS.TEXT,
    marginTop: 20,
    fontWeight: "600",
  },
  startButton: {
    width: "100%",
    height: 180,
    backgroundColor: COLORS.PRIMARY,
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    bottom: 0,
  },
  startButtonText: {
    fontSize: 42,
    color: COLORS.SECONDARY,
    fontWeight: "bold",
  },
});
