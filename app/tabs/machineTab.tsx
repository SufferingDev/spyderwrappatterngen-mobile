// File: tabs/BurnishTab.tsx
import React from 'react';
import { StyleSheet, View } from 'react-native';
import Card from '../components/shared/Card';
import InputField from '../components/shared/InputField';

interface BurnishTabProps {
  burnishSpeed: string;
  setBurnishSpeed: (text: string) => void;
  burnishPressure: string;
  setBurnishPressure: (text: string) => void;
}

const BurnishTab = ({
  burnishSpeed,
  setBurnishSpeed,
  burnishPressure,
  setBurnishPressure
}: BurnishTabProps) => {
  return (
    <Card title="Burnish Variables">
      <View style={styles.inputRow}>
        <InputField 
          label="Burnish Speed" 
          value={burnishSpeed} 
          onChangeText={setBurnishSpeed}
          keyboardType="numeric"
        />
        <InputField 
          label="Burnish Pressure" 
          value={burnishPressure} 
          onChangeText={setBurnishPressure}
          keyboardType="numeric"
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

export default BurnishTab;