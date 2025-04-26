// File: tabs/WrapTab.tsx
import React from 'react';
import { StyleSheet, View } from 'react-native';
import Card from '../components/shared/Card';
import InputField from '../components/shared/InputField';

interface WrapTabProps {
  feedrate: string;
  setFeedrate: (text: string) => void;
  overwrap: string;
  setOverwrap: (text: string) => void;
  totalLayers: string;
  setTotalLayers: (text: string) => void;
  perLayer: string;
  setPerLayer: (text: string) => void;
}

const WrapTab = ({
  feedrate,
  setFeedrate,
  overwrap,
  setOverwrap,
  totalLayers,
  setTotalLayers,
  perLayer,
  setPerLayer
}: WrapTabProps) => {
  return (
    <Card title="Wrap Speed Variables">
      <View style={styles.inputRow}>
        <InputField 
          label="Feedrate" 
          value={feedrate} 
          onChangeText={setFeedrate}
          keyboardType="numeric"
        />
        <InputField 
          label="Overwrap%" 
          value={overwrap} 
          onChangeText={setOverwrap}
          keyboardType="numeric"
        />
      </View>

      <View style={styles.inputRow}>
        <InputField 
          label="Total Layers" 
          value={totalLayers} 
          onChangeText={setTotalLayers}
          keyboardType="numeric"
        />
        <InputField 
          label="Per Layer" 
          value={perLayer} 
          onChangeText={setPerLayer}
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

export default WrapTab;