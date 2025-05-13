import React from "react";
import { StyleSheet, View } from "react-native";
import Card from "../components/shared/Card";
import InputField from "../components/shared/InputField";

interface WrapTabProps {
  feedrate: string;
  setFeedrate: (text: string) => void;
  overwrap: string;
  setOverwrap: (text: string) => void;
  totalLayers: string;
  setTotalLayers: (text: string) => void;
  perLayer: string;
  setPerLayer: (text: string) => void;

  isEnableBurnish: boolean;
  setIsEnableBurnish: (value: boolean) => void;
  burnishPcg: string;
  setBurnishPcg: (text: string) => void;
  rampStep: string;
  setRampStep: (text: string) => void;
  startSpeed: string;
  setStartSpeed: (text: string) => void;
  finalSpeed: string;
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

  isEnableBurnish,
  setIsEnableBurnish,
  burnishPcg,
  setBurnishPcg,
  rampStep,
  setRampStep,
  startSpeed,
  setStartSpeed,
  finalSpeed,
  setFinalSpeed,
}: WrapTabProps) => {
  const handleToggleChange = (enabled: boolean) => {
    setIsEnableBurnish(enabled); // Update the parent state
  };

  return (
    <View>
      <Card title="Wrap Speed Variables">
        <View style={styles.inputRow}>
          <InputField
            label="Feedrate"
            value={feedrate}
            onChangeText={setFeedrate}
            validateType="float"
            minValue={0}
            required={true}
          />
          <InputField
            label="Overwrap%"
            value={overwrap}
            onChangeText={setOverwrap}
            validateType="float"
            minValue={0}
            required={true}
          />
        </View>

        <View style={styles.inputRow}>
          <InputField
            label="Total Layers"
            value={totalLayers}
            onChangeText={setTotalLayers}
            validateType="float"
            minValue={0}
            required={true}
          />
          <InputField
            label="Per Layer"
            value={perLayer}
            onChangeText={setPerLayer}
            validateType="float"
            minValue={0}
            required={true}
          />
        </View>
      </Card>

      <Card
        title="Burnish Variables"
        showToggle={true}
        initialEnabled={isEnableBurnish}
        onToggleChange={handleToggleChange}
      >
        {/* <Toggle
        value={isToggled}
        onPress={() => setIsToggled(!isToggled)}
        trackBar={{
          activeBackgroundColor: '#4caf50',
          inActiveBackgroundColor: '#f44336',
          width: 50,
          height: 15,
          radius: 15,
        }}
        thumbButton={{
          width: 25,
          height: 25,
          radius: 12.5,
          activeBackgroundColor: 'gray',
          inActiveBackgroundColor: 'blue',
        }}
      /> */}
        {/* <Text style={styles.status}>
        {isToggled ? 'Switch is ON' : 'Switch is OFF'}
      </Text> */}
        <View style={styles.inputRow}>
          <InputField
            label="Burnish %"
            value={burnishPcg}
            onChangeText={setBurnishPcg}
            validateType="float"
            minValue={0}
            editable={isEnableBurnish}
          />
          <InputField
            label="Ramp Steps"
            value={rampStep}
            onChangeText={setRampStep}
            validateType="float"
            minValue={0}
            editable={isEnableBurnish}
          />
        </View>

        <View style={styles.inputRow}>
          <InputField
            label="Start Speed"
            value={startSpeed}
            onChangeText={setStartSpeed}
            validateType="float"
            minValue={0}
            editable={isEnableBurnish}
          />
          <InputField
            label="Final Speed"
            value={finalSpeed}
            onChangeText={setFinalSpeed}
            validateType="float"
            minValue={0}
            editable={isEnableBurnish}
          />
        </View>
      </Card>
    </View>
  );
};

const styles = StyleSheet.create({
  inputRow: {
    flexDirection: "row",
    marginBottom: 12,
  },

  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  label: {
    fontSize: 18,
    marginBottom: 20,
  },
  status: {
    marginTop: 20,
    fontSize: 16,
    color: "#333",
  },
});

export default WrapTab;
