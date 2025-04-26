// File: components/shared/InputField.tsx
import React from 'react';
import { StyleSheet, Text, View, TextInput } from 'react-native';

interface InputFieldProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  keyboardType?: 'default' | 'numeric' | 'email-address' | 'phone-pad';
  fullWidth?: boolean;
}

const InputField = ({ label, value, onChangeText, keyboardType = 'default', fullWidth = false }: InputFieldProps) => {
  return (
    <View style={fullWidth ? styles.fullWidthInput : styles.inputGroup}>
      <Text style={styles.inputLabel}>{label}</Text>
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        placeholder=""
        keyboardType={keyboardType}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  inputGroup: {
    flex: 1,
    marginRight: 12,
    marginHorizontal: 4,
  },
  fullWidthInput: {
    flex: 1,
    marginHorizontal: 4,
  },
  inputLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
    backgroundColor: '#f5f8fa',
    paddingHorizontal: 10,
    paddingVertical: 8,
    fontSize: 14,
  },
});

export default InputField;