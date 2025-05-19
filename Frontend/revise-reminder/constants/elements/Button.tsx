import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import React from "react";

const Button = ({
  label = "Button",
  onPress = () => {},
  containerStyle = {},
  textStyle = {},
  disabled = false,
  ...props
}) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.button, containerStyle, disabled && styles.disabled]}
        onPress={onPress}
        disabled={disabled}
        activeOpacity={0.7}
        {...props}
      >
        <Text style={[styles.label, textStyle]}>{label}</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Button;

const styles = StyleSheet.create({
  container: {
    width:"100%",
    justifyContent:"center",
    alignItems:"center",
  },
  button: {
    width: 200,
    backgroundColor: "#007bff",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  label: {
    color: "#ffffff",
    fontWeight: "600",
    fontSize: 16,
  },
  disabled: {
    opacity: 0.5,
  },
});
