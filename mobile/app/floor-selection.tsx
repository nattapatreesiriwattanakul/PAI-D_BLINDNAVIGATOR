import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { MaterialIcons, AntDesign } from "@expo/vector-icons";
import { COLORS, FONT_SIZES } from "../constants/config";
import speechService from "../services/speechService";
import { floorApi } from "../services/api";
import { Floor } from "../types";

export default function FloorSelectionScreen() {
  const router = useRouter();
  const { buildingId } = useLocalSearchParams<{ buildingId: string }>();
  const [loading, setLoading] = useState(true);
  const [floors, setFloors] = useState<Floor[]>([]);
  const [selectedFloorIndex, setSelectedFloorIndex] = useState(0);

  useEffect(() => {
    loadFloors();
    speechService.speak(
      "กรุณาเลือกชั้นที่ต้องการไป ใช้ปุ่มซ้ายขวาด้านล่างหน้าจอเพื่อเลือกชั้น",
      true
    );
  }, []);

  useEffect(() => {
    if (floors.length > 0) {
      const floor = floors[selectedFloorIndex];
      speechService.announceFloor(floor.floorNumber);
    }
  }, [selectedFloorIndex]);

  const loadFloors = async () => {
    try {
      const data = await floorApi.getByBuilding(buildingId);
      // Sort floors by floor number
      const sortedFloors = data.sort((a, b) => a.floorNumber - b.floorNumber);
      setFloors(sortedFloors);
    } catch (error) {
      console.error("Error loading floors:", error);
      Alert.alert("ข้อผิดพลาด", "ไม่สามารถโหลดข้อมูลชั้นได้");
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    router.back();
  };

  const handleConfirm = () => {
    if (floors.length === 0) return;

    const selectedFloor = floors[selectedFloorIndex];
    speechService.speak("ยืนยันเลือกชั้น เลือกห้องต่อไป", true);

    router.push({
      pathname: "/room-selection",
      params: {
        buildingId,
        floorId: selectedFloor.id,
        floorNumber: selectedFloor.floorNumber.toString(),
      },
    });
  };

  const handleDecrease = () => {
    if (selectedFloorIndex > 0) {
      setSelectedFloorIndex(selectedFloorIndex - 1);
    } else {
      speechService.speak("นี่คือชั้นต่ำสุดแล้ว", true);
    }
  };

  const handleIncrease = () => {
    if (selectedFloorIndex < floors.length - 1) {
      setSelectedFloorIndex(selectedFloorIndex + 1);
    } else {
      speechService.speak("นี่คือชั้นสูงสุดแล้ว", true);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.PRIMARY} />
        <Text style={styles.loadingText}>กำลังโหลด...</Text>
      </View>
    );
  }

  const currentFloor = floors[selectedFloorIndex];

  return (
    <View style={styles.container}>
      {/* ปุ่มยืนยัน */}
      <TouchableOpacity
        style={styles.confirmButton}
        onPress={handleConfirm}
        accessible={true}
        accessibilityLabel="ยืนยัน"
        accessibilityHint="กดเพื่อยืนยันการเลือกชั้นและไปเลือกห้อง"
      >
        <AntDesign name="check" size={60} color={COLORS.SECONDARY} />
      </TouchableOpacity>

      {/* เนื้อหา */}
      <View style={styles.content}>
        <MaterialIcons name="elevator" size={200} color={COLORS.SECONDARY} />
        <Text style={styles.floorLabel}>ชั้น</Text>
        {currentFloor && (
          <Text style={styles.floorNumber}>{currentFloor.floorNumber}</Text>
        )}
        <Text style={styles.desc}>
          กรุณาใส่เลขชั้นที่ท่านต้องการ{"\n"}
          เพิ่มเลขชั้นแตะฝั่งขวา ลดเลขชั้นแตะฝั่งซ้าย
        </Text>
      </View>

      {/* ปุ่มเพิ่ม/ลด */}
      <View style={styles.bottomRow}>
        <TouchableOpacity
          style={styles.arrowButton}
          onPress={handleDecrease}
          accessible={true}
          accessibilityLabel="ลดชั้น"
          accessibilityHint="กดเพื่อเลือกชั้นที่ต่ำลง"
        >
          <Text style={styles.arrowText}>▼</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.arrowButton}
          onPress={handleIncrease}
          accessible={true}
          accessibilityLabel="เพิ่มชั้น"
          accessibilityHint="กดเพื่อเลือกชั้นที่สูงขึ้น"
        >
          <Text style={styles.arrowText}>▲</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND,
    alignItems: "center",
    justifyContent: "center",
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
  content: {
    marginBottom: 150,
    alignItems: "center",
  },
  confirmButton: {
    position: "absolute",
    top: 20,
    right: 20,
    backgroundColor: COLORS.PRIMARY,
    paddingVertical: 18,
    paddingHorizontal: 28,
    borderRadius: 12,
    zIndex: 10,
  },
  floorLabel: {
    fontSize: 22,
    color: COLORS.TEXT,
    marginTop: 10,
  },
  floorNumber: {
    fontSize: 40,
    fontWeight: "bold",
    color: COLORS.SECONDARY,
    marginVertical: 8,
  },
  desc: {
    textAlign: "center",
    color: COLORS.TEXT,
    fontSize: 14,
    marginTop: 10,
  },
  bottomRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    position: "absolute",
    bottom: 1,
  },
  arrowButton: {
    backgroundColor: COLORS.PRIMARY,
    width: 205,
    height: 220,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  arrowText: {
    fontSize: 50,
    color: COLORS.SECONDARY,
    fontWeight: "bold",
  },
});
