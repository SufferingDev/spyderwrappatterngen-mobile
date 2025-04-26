// File: components/ActionButtons.tsx
import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';

interface ActionButtonsProps {
  onGenerate: () => void;
}

const ActionButtons = ({ onGenerate }: ActionButtonsProps) => {
  return (
    <View style={styles.buttonRow}>
      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>LOAD</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>SAVE</Text>
      </TouchableOpacity>
      <TouchableOpacity style={[styles.button, styles.generateButton]} onPress={onGenerate}>
        <Text style={[styles.buttonText, styles.generateButtonText]}>GENERATE</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>EXPORT</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 4,
    backgroundColor: '#f0f4f8',
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 4,
  },
  buttonText: {
    color: '#666',
    fontWeight: '500',
  },
  generateButton: {
    backgroundColor: '#2980b9',
  },
  generateButtonText: {
    color: 'white',
  },
});

export default ActionButtons;