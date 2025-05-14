import { Ionicons } from "@expo/vector-icons";
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
    <View style={styles.container}>
      <TouchableOpacity style={styles.button} onPress={onLoad}>
        <Ionicons name="arrow-down" size={20} color="#333" />
        <Text style={styles.buttonText}>LOAD</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, styles.saveButton]}
        onPress={onSave}
      >
        <Ionicons name="save" size={20} color="#fff" />
        <Text style={[styles.buttonText, styles.saveButtonText]}>SAVE</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={onSaveAsNew}>
        <Ionicons name="add" size={20} color="#333" />
        <Text style={styles.buttonText}>NEW SAVE</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={onExport}>
        <Ionicons name="arrow-up" size={20} color="#333" />
        <Text style={styles.buttonText}>EXPORT</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
  },
  button: {
    alignItems: "center",
    justifyContent: "center",
    padding: 8,
  },
  saveButton: {
    backgroundColor: "#2196F3",
    borderRadius: 4,
    paddingHorizontal: 16,
  },
  buttonText: {
    fontSize: 12,
    color: "#333",
    marginTop: 4,
  },
  saveButtonText: {
    color: "#fff",
  },
});

export default ActionButtons;
