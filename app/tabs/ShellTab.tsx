import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
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
  yaixs: string;
  setYaixs: (text: string) => void;
  totalKick: string;
  setTotalKick: (text: string) => void;
  kickRatio: string;
  setKickRatio: (text: string) => void;
  TapeFeet: string;
  setTapeFeet: (text: string) => void;
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
  yaixs,
  setYaixs,
  totalKick,
  setTotalKick,
  kickRatio,
  setKickRatio,
  TapeFeet,
  setTapeFeet,
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
          validateType='float'
          minValue={0}
          keyboardType='numeric'
          required={true}
        />
        <InputField
          label="Meas size"
          value={measSize}
          onChangeText={setMeasSize}
          validateType='float'
          minValue={0}
          required={true}
        />
      </View>

      <View style={styles.inputRow}>
        <InputField
          label="Diameter%"
          value={diameter}
          onChangeText={setDiameter}
          validateType='float'
          minValue={0}
          required={true}
        />
        <InputField
          label="Circ+"
          value={circ}
          onChangeText={setCirc}
          validateType='float'
          minValue={0}
          required={true}
        />
      </View>

      <View style={styles.inputRow}>
        <InputField
          label="Yaxis%"
          value={yaixs}
          onChangeText={setYaixs}
          validateType='float'
          minValue={0}
          required={true}
        />
        <InputField
          label="Total Kick"
          value={totalKick}
          onChangeText={setTotalKick}
          validateType='float'
          minValue={0}
          required={true}
        />
      </View>

      <View style={styles.inputRow}>
        <InputField
          label="Kick Ratio%"
          value={kickRatio}
          onChangeText={setKickRatio}
          validateType='float'
          minValue={0}
          required={true}
        />
        {/* <InputField 
          label="Tape Feet" 
          value={TapeFeet} 
          onChangeText={setTapeFeet}
          keyboardType="numeric"
        /> */}

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>
            Tape Feet
          </Text>
          <Text
            style={styles.input}
          >
            {TapeFeet}
          </Text>
        </View>
      </View>

      <View style={styles.inputRow}>
        <InputField
          label="Shell Description"
          value={shellDescription}
          onChangeText={setShellDescription}
          fullWidth={true}
          required={true}
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
  inputGroup: {
    flex: 1,
    marginRight: 12,
    marginHorizontal: 4,
    marginBottom: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: 'white',
    borderRadius: 4,
    backgroundColor: 'white',
    paddingHorizontal: 10,
    paddingVertical: 8,
    fontSize: 14,
  },
  inputLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
});

export default ShellTab;