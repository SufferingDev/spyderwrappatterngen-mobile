import { Picker } from "@react-native-picker/picker";
import React from "react";
import {
  StyleProp,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";

interface PresetSelectorProps {
  title: string;
  presets: string[];
  selectedPreset: string | null;
  onSelectPreset: (name: string | null) => void;
  onSavePreset: () => void;
  onDeletePreset: () => void;
  style?: StyleProp<ViewStyle>;
}

const PresetSelector = ({
  title,
  presets,
  selectedPreset,
  onSelectPreset,
  onSavePreset,
  onDeletePreset,
  style,
}: PresetSelectorProps) => {
  const pickerValue = selectedPreset ?? "";
  const hasPresets = presets.length > 0;
  const deleteDisabled = !selectedPreset;

  return (
    <View style={[styles.container, style]}>
      <Text style={styles.title}>{title}</Text>
      <View style={styles.row}>
        <View
          style={[styles.pickerWrapper, !hasPresets && styles.disabledPicker]}
        >
          <Picker
            selectedValue={pickerValue}
            onValueChange={(value) => {
              onSelectPreset(value === "" ? null : (value as string));
            }}
            enabled={hasPresets}
            style={styles.picker}
          >
            <Picker.Item label={hasPresets ? "Select a preset" : "No presets saved"} value="" />
            {presets.map((presetName) => (
              <Picker.Item key={presetName} label={presetName} value={presetName} />
            ))}
          </Picker>
        </View>
        <TouchableOpacity style={styles.saveButton} onPress={onSavePreset}>
          <Text style={styles.buttonText}>Save</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.deleteButton, deleteDisabled && styles.disabledButton]}
          onPress={onDeletePreset}
          disabled={deleteDisabled}
        >
          <Text style={styles.buttonText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 12,
    padding: 12,
    backgroundColor: "#f5f6fa",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#dfe4ea",
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    color: "#2f3542",
    marginBottom: 8,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  pickerWrapper: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#dcdde1",
    borderRadius: 6,
    overflow: "hidden",
    marginRight: 8,
  },
  disabledPicker: {
    opacity: 0.6,
  },
  picker: {
    height: 44,
  },
  saveButton: {
    backgroundColor: "#2ed573",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 6,
    marginRight: 8,
  },
  deleteButton: {
    backgroundColor: "#ff6b6b",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 6,
  },
  disabledButton: {
    opacity: 0.5,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
  },
});

export default PresetSelector;
