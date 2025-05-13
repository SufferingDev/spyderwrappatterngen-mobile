import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface ActionButtonsProps {
  onLoad: () => void;
  onSave: () => void;
  onSaveAsNew: () => void;
  onGenerate: () => void;
  onExport: () => void;
}

const ActionButtons = ({
  onLoad,
  onSave,
  onSaveAsNew,
  onGenerate,
  onExport,
}: ActionButtonsProps) => {
  return (
    <View style={styles.buttonRow}>
      <TouchableOpacity style={styles.button} onPress={onLoad}>
        <Text style={styles.buttonText}>LOAD</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={onSave}>
        <Text style={styles.buttonText}>SAVE</Text>
      </TouchableOpacity>
      {/* <TouchableOpacity style={[styles.button, styles.generateButton]} onPress={onGenerate}>
        <Text style={[styles.buttonText, styles.generateButtonText]}>SAVE AS NEW</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={onExport}>
        <Text style={styles.buttonText}>EXPORT</Text>
      </TouchableOpacity> */}
      <TouchableOpacity style={styles.button} onPress={onSaveAsNew}>
        <Text style={styles.buttonText}>SAVE AS NEW</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={onExport}>
        <Text style={styles.buttonText}>EXPORT</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 4,
    backgroundColor: "#f0f4f8",
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
    marginHorizontal: 4,
  },
  buttonText: {
    color: "#666",
    fontWeight: "500",
  },
  generateButton: {
    backgroundColor: "#2980b9",
  },
  generateButtonText: {
    color: "white",
  },
});

export default ActionButtons;
