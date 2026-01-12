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
import { FontAwesome5, Feather, AntDesign } from "@expo/vector-icons";
import { COLORS, FONT_SIZES } from "../constants/config";
import speechService from "../services/speechService";
import { roomApi } from "../services/api";
import { Room } from "../types";

export default function RoomSelectionScreen() {
  const router = useRouter();
  const { buildingId, floorId, floorNumber } = useLocalSearchParams<{
    buildingId: string;
    floorId: string;
    floorNumber: string;
  }>();

  const [loading, setLoading] = useState(true);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [selectedRoomIndex, setSelectedRoomIndex] = useState(0);

  useEffect(() => {
    loadRooms();
    speechService.speak(
      "กรุณาเลือกห้องที่ต้องการไป ใช้ปุ่มซ้ายขวาด้านล่างหน้าจอเพื่อเลือกห้อง",
      true
    );
  }, []);

  useEffect(() => {
    if (rooms.length > 0) {
      const room = rooms[selectedRoomIndex];
      speechService.announceRoom(room.roomNumber);
    }
  }, [selectedRoomIndex]);

  const loadRooms = async () => {
    try {
      const data = await roomApi.getByFloor(floorId);
      // Sort rooms by room number
      const sortedRooms = data.sort((a, b) =>
        a.roomNumber.localeCompare(b.roomNumber, undefined, { numeric: true })
      );
      setRooms(sortedRooms);
    } catch (error) {
      console.error("Error loading rooms:", error);
      Alert.alert("ข้อผิดพลาด", "ไม่สามารถโหลดข้อมูลห้องได้");
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    router.back();
  };

  const handleConfirm = () => {
    if (rooms.length === 0) return;

    const selectedRoom = rooms[selectedRoomIndex];
    speechService.speak("ยืนยันเลือกห้อง เริ่มการนำทาง", true);

    router.push({
      pathname: "/navigation",
      params: {
        buildingId,
        floorId,
        floorNumber,
        roomId: selectedRoom.id,
        roomNumber: selectedRoom.roomNumber,
      },
    });
  };

  const handleDecrease = () => {
    if (selectedRoomIndex > 0) {
      setSelectedRoomIndex(selectedRoomIndex - 1);
    } else {
      speechService.speak("นี่คือห้องแรกแล้ว", true);
    }
  };

  const handleIncrease = () => {
    if (selectedRoomIndex < rooms.length - 1) {
      setSelectedRoomIndex(selectedRoomIndex + 1);
    } else {
      speechService.speak("นี่คือห้องสุดท้ายแล้ว", true);
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

  const currentRoom = rooms[selectedRoomIndex];

  return (
    <View style={styles.container}>
      {/* ปุ่มยกเลิก */}
      <TouchableOpacity
        style={styles.cancelButton}
        onPress={handleBack}
        accessible={true}
        accessibilityLabel="ย้อนกลับ"
        accessibilityHint="กดเพื่อย้อนกลับไปเลือกชั้น"
      >
        <Feather name="delete" size={60} color={COLORS.SECONDARY} />
      </TouchableOpacity>

      {/* ปุ่มยืนยัน */}
      <TouchableOpacity
        style={styles.confirmButton}
        onPress={handleConfirm}
        accessible={true}
        accessibilityLabel="ยืนยัน"
        accessibilityHint="กดเพื่อยืนยันการเลือกห้องและเริ่มนำทาง"
      >
        <AntDesign name="check" size={50} color={COLORS.SECONDARY} />
      </TouchableOpacity>

      {/* เนื้อหา */}
      <View style={styles.content}>
        <FontAwesome5 name="door-open" size={200} color={COLORS.SECONDARY} />
        <Text style={styles.title}>ห้อง</Text>
        {currentRoom && (
          <Text style={styles.number}>{currentRoom.roomNumber}</Text>
        )}
        <Text style={styles.subtitle}>
          กรุณาใส่หมายเลขห้องที่ท่านต้องการ{"\n"}
          เพิ่มเลขห้องแตะฝั่งขวา ลดเลขห้องแตะฝั่งซ้าย
        </Text>
      </View>

      {/* ปุ่มเพิ่ม/ลด */}
      <View style={styles.bottomRow}>
        <TouchableOpacity
          style={styles.bottomButton}
          onPress={handleDecrease}
          accessible={true}
          accessibilityLabel="ลดห้อง"
          accessibilityHint="กดเพื่อเลือกห้องก่อนหน้า"
        >
          <Text style={styles.arrow}>▼</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.bottomButton}
          onPress={handleIncrease}
          accessible={true}
          accessibilityLabel="เพิ่มห้อง"
          accessibilityHint="กดเพื่อเลือกห้องถัดไป"
        >
          <Text style={styles.arrow}>▲</Text>
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
  cancelButton: {
    position: "absolute",
    top: 40,
    left: 20,
    backgroundColor: COLORS.PRIMARY,
    paddingVertical: 18,
    paddingHorizontal: 28,
    borderRadius: 12,
    zIndex: 10,
  },
  confirmButton: {
    position: "absolute",
    top: 40,
    right: 20,
    backgroundColor: COLORS.PRIMARY,
    paddingVertical: 18,
    paddingHorizontal: 28,
    borderRadius: 12,
    zIndex: 10,
  },
  content: {
    marginTop: 150,
    alignItems: "center",
  },
  title: {
    fontSize: 26,
    color: COLORS.TEXT,
    fontWeight: "bold",
  },
  number: {
    fontSize: 40,
    color: COLORS.SECONDARY,
    marginVertical: 10,
  },
  subtitle: {
    fontSize: 14,
    color: "#555",
    textAlign: "center",
  },
  bottomRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    position: "absolute",
    bottom: 1,
  },
  bottomButton: {
    backgroundColor: COLORS.PRIMARY,
    width: 205,
    height: 220,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  arrow: {
    fontSize: 50,
    color: COLORS.SECONDARY,
    fontWeight: "bold",
  },
});
