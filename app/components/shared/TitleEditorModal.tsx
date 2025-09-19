import { Picker } from "@react-native-picker/picker";
import React, { memo, useCallback } from "react";
import {
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

interface TitleEditorModalProps {
  visible: boolean;
  value: string;
  extensions?: string[];
  selectedExtension?: string;
  onChangeText: (text: string) => void;
  onExtensionChange?: (extension: string) => void;
  onSave: () => void;
  onCancel: () => void;
  title: string;
}

const TitleEditorModal = memo(
  ({
    visible,
    value,
    extensions = [".mum"],
    selectedExtension = ".mum",
    onChangeText,
    onExtensionChange,
    onSave,
    onCancel,
    title,
  }: TitleEditorModalProps) => {
    const handleSave = useCallback(() => {
      // Perform validation before calling onSave
      if (value.trim() !== "") {
        onSave();
      }
    }, [value, onSave]);

    return (
      <Modal
        visible={visible}
        transparent={true}
        animationType="fade"
        onRequestClose={onCancel}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{title}</Text>
            <View style={styles.inputContainer}>
              <TextInput
                style={[
                  styles.modalInput,
                  extensions.length > 1
                    ? styles.modalInputWithCombo
                    : styles.modalInputFull,
                ]}
                value={value}
                onChangeText={onChangeText}
                placeholder="Enter pattern name"
                autoFocus
              />
              {extensions.length > 1 && (
                <View style={styles.extensionPicker}>
                  <Picker
                    selectedValue={selectedExtension}
                    onValueChange={onExtensionChange}
                    style={styles.picker}
                  >
                    {extensions.map((ext) => (
                      <Picker.Item key={ext} label={ext} value={ext} />
                    ))}
                  </Picker>
                </View>
              )}
            </View>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={onCancel}
              >
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.saveButton]}
                onPress={handleSave}
              >
                <Text style={styles.buttonText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    );
  }
);

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "white",
    borderRadius: 8,
    padding: 20,
    width: "80%",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
    color: "#333",
    textAlign: "center",
  },
  modalInput: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 4,
    padding: 10,
    marginBottom: 16,
    fontSize: 16,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  modalInputWithCombo: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 4,
    padding: 10,
    fontSize: 16,
    marginRight: 8,
  },
  modalInputFull: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 4,
    padding: 10,
    fontSize: 16,
  },
  extensionPicker: {
    flex: 2,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 4,
    height: 50,
    justifyContent: "center",
    overflow: "hidden",
  },
  picker: {
    height: 50,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  modalButton: {
    flex: 1,
    padding: 12,
    borderRadius: 4,
    alignItems: "center",
    marginHorizontal: 4,
  },
  cancelButton: {
    backgroundColor: "#e0e0e0",
  },
  saveButton: {
    backgroundColor: "#2980b9",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});

export default TitleEditorModal;
