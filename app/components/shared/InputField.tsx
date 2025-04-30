/*
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
*/




import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput } from 'react-native';

interface InputFieldProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  keyboardType?: 'default' | 'numeric' | 'email-address' | 'phone-pad';
  fullWidth?: boolean;
  required?: boolean;
  validateType?: 'none' | 'integer' | 'float';
  minValue?: number;
  maxValue?: number;
  onValidationChange?: (isValid: boolean) => void;
  editable?: boolean;
}

const InputField = ({
  label,
  value,
  onChangeText,
  keyboardType = 'default',
  fullWidth = false,
  required = false,
  validateType = 'none',
  minValue,
  maxValue,
  onValidationChange,
  editable = true,
}: InputFieldProps) => {
  const [error, setError] = useState<string>('');
  const [touched, setTouched] = useState<boolean>(false);

  // Validation function
  const validate = (text: string): boolean => {
    if (required && text.trim() === '') {
      setError(`${label} is required`);
      return false;
    }

    // If not required and empty, it's valid
    if (!required && text.trim() === '') {
      setError('');
      return true;
    }

    switch (validateType) {
      case 'integer':
        // Check if it's a valid integer
        if (!/^-?\d+$/.test(text)) {
          setError('Please enter a valid integer');
          return false;
        }
        
        const intValue = parseInt(text, 10);
        if (minValue !== undefined && intValue < minValue) {
          setError(`Value must be at least ${minValue}`);
          return false;
        }
        if (maxValue !== undefined && intValue > maxValue) {
          setError(`Value must be at most ${maxValue}`);
          return false;
        }
        break;
      
      case 'float':
        // Check if it's a valid float
        if (!/^-?\d*\.?\d+$/.test(text)) {
          setError('Please enter a valid number');
          return false;
        }
        
        const floatValue = parseFloat(text);
        if (minValue !== undefined && floatValue < minValue) {
          setError(`Value must be at least ${minValue}`);
          return false;
        }
        if (maxValue !== undefined && floatValue > maxValue) {
          setError(`Value must be at most ${maxValue}`);
          return false;
        }
        break;
      
      default:
        // No validation for default type
        break;
    }

    setError('');
    return true;
  };

  // Handle text change with validation
  const handleChangeText = (text: string) => {
    onChangeText(text);
    
    if (touched) {
      const isValid = validate(text);
      if (onValidationChange) {
        onValidationChange(isValid);
      }
    }
  };

  // Handle blur event
  const handleBlur = () => {
    setTouched(true);
    const isValid = validate(value);
    if (onValidationChange) {
      onValidationChange(isValid);
    }
  };

  // Determine keyboard type based on validation type
  const getKeyboardType = () => {
    if (validateType === 'integer' || validateType === 'float') {
      return 'numeric';
    }
    return keyboardType;
  };

  return (
    <View style={fullWidth ? styles.fullWidthInput : styles.inputGroup}>
      <Text style={styles.inputLabel}>
        {label}{required ? <Text style={styles.requiredStar}>*</Text> : null}
      </Text>
      <TextInput
        style={[styles.input, error ? styles.inputError : null]}
        value={value}
        onChangeText={handleChangeText}
        onBlur={handleBlur}
        placeholder=""
        keyboardType={getKeyboardType()}
        editable={editable}
      />
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  inputGroup: {
    flex: 1,
    marginRight: 12,
    marginHorizontal: 4,
    marginBottom: 12,
  },
  fullWidthInput: {
    flex: 1,
    marginHorizontal: 4,
    marginBottom: 12,
  },
  inputLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  requiredStar: {
    color: '#e53935',
    marginLeft: 2,
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
  inputError: {
    borderColor: '#e53935',
    backgroundColor: '#ffebee',
  },
  errorText: {
    color: '#e53935',
    fontSize: 12,
    marginTop: 4,
  },
});

export default InputField;