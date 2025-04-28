import React from 'react';
import { StyleSheet, View } from 'react-native';
import Card from '../components/shared/Card';
import InputField from '../components/shared/InputField';
import AreaField from '../components/shared/AreaField';

interface MachineTabProps {
  pumpOnCode: string;
  setPumpOnCode: (text: string) => void;  
  pumpOffCode: string;
  setPumpOffCode: (text: string) => void;
  cycPerShell: string,
  setCycPerShell: (text: string) => void;
  duration: string,
  setDuration: (text: string) => void;

  startupGCode: string,
  setStartupGCode: (text: string) => void;
  endOfMainWrap: string,
  setEndOfMainWrap: (text: string) => void;
  endOfCompleteWrap: string,
  setEndOfCompleteWrap: (text: string) => void;
}

const MachineTab = ({
  pumpOnCode,
  setPumpOnCode,
  pumpOffCode,
  setPumpOffCode,
  cycPerShell,
  setCycPerShell,
  duration,
  setDuration,
  startupGCode,
  setStartupGCode,
  endOfMainWrap,
  setEndOfMainWrap,
  endOfCompleteWrap,
  setEndOfCompleteWrap
}: MachineTabProps) => {
  return (
    <View>
      <Card title="Pump Variables">
        <View style={styles.inputRow}>
          <InputField
            label="Pump on Code"
            value={pumpOnCode}
            onChangeText={setPumpOnCode}
          />
          <InputField
            label="Pump off Code"
            value={pumpOffCode}
            onChangeText={setPumpOffCode}
          />
        </View>
        <View style={styles.inputRow}>
          <InputField
            label="Cycles per Shell"
            value={cycPerShell}
            onChangeText={setCycPerShell}
            validateType='float'
            minValue={0}
          />
          <InputField
            label="Duration"
            value={duration}
            onChangeText={setDuration}
            validateType='float'
            minValue={0}
          />
        </View>
      </Card>

      <Card title="Machine GCode Variables">
        <View style={styles.inputRow}>
          <AreaField
            label="Startup GCode"
            value={startupGCode}
            onChangeText={setStartupGCode}
          />
        </View>
        <View style={styles.inputRow}>
          <AreaField
            label="End of Main Wrap"
            value={endOfMainWrap}
            onChangeText={setEndOfMainWrap}
          />
        </View>
        <View style={styles.inputRow}>
          <AreaField
            label="End of Complete Wrap"
            value={endOfCompleteWrap}
            onChangeText={setEndOfCompleteWrap}
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

export default MachineTab;