// File: tabs/ShellTab.tsx
import React from 'react';
import { StyleSheet, View } from 'react-native';
import Card from '../components/shared/Card';
import InputField from '../components/shared/InputField';

interface ShellTabProps {
  shellSize: string;
  setShellSize: (text: string) => void;
  measSize: string;
  setMeasSize: (text: string) => void;
  diameter: string;
  setDiameter: (text: string) => void;
  circ: string;
  setCirc: (text: string) => void;
  shellDescription: string;
  setShellDescription: (text: string) => void;
}

const ShellTab = ({
  shellSize,
  setShellSize,
  measSize,
  setMeasSize,
  diameter,
  setDiameter,
  circ,
  setCirc,
  shellDescription,
  setShellDescription
}: ShellTabProps) => {
  return (
    <Card title="Shell Size Variables">
      <View style={styles.inputRow}>
        <InputField 
          label="Shell Size" 
          value={shellSize} 
          onChangeText={setShellSize}
        />
        <InputField 
          label="Meas size" 
          value={measSize} 
          onChangeText={setMeasSize}
        />
      </View>

      <View style={styles.inputRow}>
        <InputField 
          label="Diameter%" 
          value={diameter} 
          onChangeText={setDiameter}
          keyboardType="numeric"
        />
        <InputField 
          label="Circ+" 
          value={circ} 
          onChangeText={setCirc}
          keyboardType="numeric"
        />
      </View>

      <View style={styles.inputRow}>
        <InputField 
          label="Yaxis%" 
          value={diameter} 
          onChangeText={setDiameter}
          keyboardType="numeric"
        />
        <InputField 
          label="Total Kick" 
          value={circ} 
          onChangeText={setCirc}
          keyboardType="numeric"
        />
      </View>

      <View style={styles.inputRow}>
        <InputField 
          label="Kick Ratio%" 
          value={diameter} 
          onChangeText={setDiameter}
          keyboardType="numeric"
        />
        <InputField 
          label="Tape Feet" 
          value={circ} 
          onChangeText={setCirc}
          keyboardType="numeric"
        />
      </View>

      <View style={styles.inputRow}>
        <InputField 
          label="Shell Description" 
          value={shellDescription} 
          onChangeText={setShellDescription}
          fullWidth={true}
        />
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  inputRow: {
    flexDirection: 'row',
    marginBottom: 12,
  },
});

export default ShellTab;