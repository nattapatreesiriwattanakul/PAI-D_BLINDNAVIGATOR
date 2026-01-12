import React from "react";
import { TouchableOpacity, Text, StyleSheet, ViewStyle } from "react-native";
import * as Haptics from "expo-haptics";
import * as Speech from "expo-speech";
import { BUTTON_SIZE, COLORS, FONT_SIZES } from "../constants/config";

interface AccessibleButtonProps {
  onPress: () => void;
  label: string;
  icon?: string;
  style?: ViewStyle;
  size?: "large" | "corner";
  variant?: "primary" | "secondary" | "success" | "danger";
  accessibilityHint?: string;
}

export default function AccessibleButton({
  onPress,
  label,
  icon,
  style,
  size = "large",
  variant = "primary",
  accessibilityHint,
}: AccessibleButtonProps) {
  const handlePress = () => {
    // Provide haptic feedback
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    // Speak the button label
    Speech.speak(label, {
      language: "th-TH", // Thai language
      rate: 0.9,
    });

    onPress();
  };

  const handleLongPress = () => {
    // On long press, speak the accessibility hint
    if (accessibilityHint) {
      Speech.speak(accessibilityHint, {
        language: "th-TH",
        rate: 0.9,
      });
    }
  };

  const buttonSize =
    size === "corner" ? BUTTON_SIZE.CORNER_SIZE : BUTTON_SIZE.WIDTH;
  const backgroundColor =
    COLORS[variant.toUpperCase() as keyof typeof COLORS] || COLORS.PRIMARY;

  return (
    <TouchableOpacity
      style={[
        styles.button,
        {
          width: buttonSize,
          height: buttonSize,
          backgroundColor,
        },
        style,
      ]}
      onPress={handlePress}
      onLongPress={handleLongPress}
      accessible={true}
      accessibilityLabel={label}
      accessibilityHint={accessibilityHint}
      accessibilityRole="button"
    >
      {icon && <Text style={styles.icon}>{icon}</Text>}
      <Text style={styles.label}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 20,
    borderWidth: 3,
    borderColor: COLORS.BORDER,
    padding: 10,
  },
  icon: {
    fontSize: FONT_SIZES.XLARGE,
    color: COLORS.BACKGROUND,
    marginBottom: 5,
  },
  label: {
    fontSize: FONT_SIZES.LARGE,
    fontWeight: "bold",
    color: COLORS.BACKGROUND,
    textAlign: "center",
  },
});
