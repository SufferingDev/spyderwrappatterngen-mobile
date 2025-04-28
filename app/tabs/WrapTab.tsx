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
  burnishPcg: string,
  setBurnishPcg: (text: string) => void;
  rampStep: string,
  setRampStep: (text: string) => void;
  startSpeed: string,
  setStartSpeed: (text: string) => void;
  finalSpeed: string,
  setFinalSpeed: (text: string) => void;
}

const WrapTab = ({
  feedrate,
  setFeedrate,
  overwrap,
  setOverwrap,
  totalLayers,
  setTotalLayers,
  perLayer,
  setPerLayer,
  burnishPcg,
  setBurnishPcg,
  rampStep,
  setRampStep,
  startSpeed,
  setStartSpeed,
  finalSpeed,
  setFinalSpeed
}: WrapTabProps) => {
  return (
    <View>
      <Card title="Wrap Speed Variables">
        <View style={styles.inputRow}>
          <InputField 
            label="Feedrate" 
            value={feedrate} 
            onChangeText={setFeedrate}
            validateType='float'
            minValue={0}
          />
          <InputField 
            label="Overwrap%" 
            value={overwrap} 
            onChangeText={setOverwrap}
            validateType='float'
            minValue={0}
          />
        </View>

        <View style={styles.inputRow}>
          <InputField 
            label="Total Layers" 
            value={totalLayers} 
            onChangeText={setTotalLayers}
            validateType='float'
            minValue={0}
          />
          <InputField 
            label="Per Layer" 
            value={perLayer} 
            onChangeText={setPerLayer}
            validateType='float'
            minValue={0}
          />
        </View>
      </Card>

      <Card title="Burnish Variables">
        <View style={styles.inputRow}>
          <InputField 
            label="Burnish %" 
            value={burnishPcg} 
            onChangeText={setBurnishPcg}
            validateType='float'
            minValue={0}
          />
          <InputField 
            label="Ramp Steps" 
            value={rampStep} 
            onChangeText={setRampStep}
            validateType='float'
            minValue={0}
          />
        </View>

        <View style={styles.inputRow}>
          <InputField 
            label="Start Speed" 
            value={startSpeed} 
            onChangeText={setStartSpeed}
            validateType='float'
            minValue={0}
          />
          <InputField 
            label="Final Speed" 
            value={finalSpeed} 
            onChangeText={setFinalSpeed}
            validateType='float'
            minValue={0}
          />
        </View>
      </Card>
    </View>
    
  );
};

const styles = StyleSheet.create({
  inputRow: {
    flexDirection: 'row',
    marginBottom: 12,
  },
});

export default WrapTab;