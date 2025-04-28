import React, { useState } from 'react';
import { 
  StyleSheet, 
  SafeAreaView,
  StatusBar,
  ScrollView,
  TouchableOpacity
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { View } from 'react-native';

// Component imports
import Header from './components/Header';
import TabBar from './components/TabBar';
import GCodePreview from './components/GCodePreview';
import ActionButtons from './components/ActionButtons';

// Tab content components
import ShellTabContent from './tabs/ShellTab';
import WrapTabContent from './tabs/WrapTab';
import MachineTapContent from './tabs/machineTab';
import { tapGestureHandlerProps } from 'react-native-gesture-handler/lib/typescript/handlers/TapGestureHandler';

import genMainGCode from './utils/genGCode';

export default function Index() {
  const [activeTab, setActiveTab] = useState('SHELL');
  
  // Shell tab state
  const [shellSize, setShellSize] = useState('');
  const [measSize, setMeasSize] = useState('');
  const [diameter, setDiameter] = useState('');
  const [circ, setCirc] = useState('');
  const [yaixs, setYaixs] = useState('');
  const [totalKick, setTotalKick] = useState('');
  const [kickRatio, setKickRatio] = useState('');
  const [TapeFeet, setTapeFeet] = useState('');
  const [shellDescription, setShellDescription] = useState('');
  
  // Wrap tab state
  const [feedrate, setFeedrate] = useState('');
  const [overwrap, setOverwrap] = useState('');
  const [totalLayers, setTotalLayers] = useState('');
  const [perLayer, setPerLayer] = useState('');

  // Burnish state
  const [burnishPcg, setBurnishPcg] = useState('');
  const [rampStep, setRampStep] = useState('');
  const [startSpeed, setStartSpeed] = useState('');
  const [finalSpeed, setFinalSpeed] = useState('');

  // Pump State
  const [pumpOnCode, setPumpOnCode] = useState('');
  const [pumpOffCode, setPumpOffCode] = useState('');
  const [cycPerShell, setCycPerShell] = useState('');
  const [duration, setDuration] = useState('');
  
  // G-Code state
  const [startupGCode, setStartupGCode] = useState('');
  const [endOfMainWrap, setEndOfMainWrap] = useState('');
  const [endOfCompleteWrap, setEndOfCompleteWrap] = useState('');
  const [gCode, setGCode] = useState('(G-Code will appear here)');

  const handleGenerate = () => {
    // Logic to generate G-Code would go here

    // const numShellSize = parseInt(shellSize, 10); 
    // const numMeasSize = parseInt(measSize, 10); 
    // const numDiameter = parseInt(diameter, 10) / 100; 
    // const numCirc = parseInt(circ, 10); 
    // const numYaixs = parseInt(yaixs, 10); 
    // const numTotalKick = parseInt(totalKick, 10) / 100; 
    // const numKickRatio = parseInt(kickRatio, 10) / 100; 

    // const numFeedrate = parseInt(feedrate, 10); 
    // const numOverWrap = parseInt(overwrap, 10) / 100; 
    // const numTotalLayers = parseInt(totalLayers, 10); 
    // const numPerLayer = parseInt(perLayer, 10); 

    // const numBurnishPcg = parseInt(burnishPcg, 10); 
    // const numRampStep = parseInt(rampStep, 10); 
    // const numStartSpeed = parseInt(startSpeed, 10); 
    // const numFinalSpeed = parseInt(finalSpeed, 10); 

    // const numXOffSet: number = numMeasSize * Math.PI * numDiameter * numTotalKick;





    const numMeasSize = parseFloat(measSize);
    const numDiameter = parseFloat(diameter) / 100;
    const numCirc = parseFloat(circ);
  
    const numTotalKick = parseFloat(totalKick) / 100;
    const numKickRatio = parseFloat(kickRatio) / 100;
  
    const numOverWrap = parseFloat(overwrap) / 100;
    const numPerLayer = parseInt(perLayer, 10);
    const numTotalLayers = parseInt(totalLayers, 10);
  
    const numYaixs = parseFloat(yaixs); // Adjust if division by 100 is needed
  


    const ggg = genMainGCode(2,0.02,2,0.02,2,0.02,2,0.02,2,2,true,2,2,2,2,true,'On','Off',2,2,'dfkd','endm','endc','name');

    setTapeFeet(ggg.estTapeFeet);

    setGCode(ggg.entireGCode);
  };

  // Render active tab content
  const renderActiveTabContent = () => {
    switch (activeTab) {
      case 'SHELL':
        return (
          <ShellTabContent 
            shellSize={shellSize}
            setShellSize={setShellSize}
            measSize={measSize}
            setMeasSize={setMeasSize}
            diameter={diameter}
            setDiameter={setDiameter}
            circ={circ}
            setCirc={setCirc}
            yaixs={yaixs}
            setYaixs={setYaixs}
            totalKick={totalKick}
            setTotalKick={setTotalKick}
            kickRatio={kickRatio}
            setKickRatio={setKickRatio}
            TapeFeet={TapeFeet}
            setTapeFeet={setTapeFeet}
            shellDescription={shellDescription}
            setShellDescription={setShellDescription}
          />
        );
      case 'WRAP':
        return (
          <WrapTabContent
            feedrate={feedrate}
            setFeedrate={setFeedrate}
            overwrap={overwrap}
            setOverwrap={setOverwrap}
            totalLayers={totalLayers}
            setTotalLayers={setTotalLayers}
            perLayer={perLayer}
            setPerLayer={setPerLayer}

            burnishPcg={burnishPcg}
            setBurnishPcg={setBurnishPcg}
            rampStep={rampStep}
            setRampStep={setRampStep}
            startSpeed={startSpeed}
            setStartSpeed={setStartSpeed}
            finalSpeed={finalSpeed}
            setFinalSpeed={setFinalSpeed}
          />
        );
      case 'BURNISH':
        return (
          <MachineTapContent
            pumpOnCode={pumpOnCode}
            setPumpOnCode={setPumpOnCode}
            pumpOffCode={pumpOffCode}
            setPumpOffCode={setPumpOffCode}
            cycPerShell={cycPerShell}
            setCycPerShell={setCycPerShell}
            duration={duration}
            setDuration={setDuration}

            startupGCode={startupGCode}
            setStartupGCode={setStartupGCode}
            endOfMainWrap={endOfMainWrap}
            setEndOfMainWrap={setEndOfMainWrap}
            endOfCompleteWrap={endOfCompleteWrap}
            setEndOfCompleteWrap={setEndOfCompleteWrap}
          />
        );
      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#003366" />
      
      {/* Header */}
      <Header />

      {/* Tabs */}
      <TabBar activeTab={activeTab} setActiveTab={setActiveTab} />

      <ScrollView style={styles.contentContainer}>
        {/* Render content based on active tab */}
        {renderActiveTabContent()}
      </ScrollView>

      {/* G-Code Preview - shown on all tabs */}
      <GCodePreview gCode={gCode} />

      {/* Bottom Buttons */}
      <ActionButtons onGenerate={handleGenerate} />
      
      {/* Floating Action Button */}
      <TouchableOpacity style={styles.fab}>
        <Ionicons name="add" size={24} color="white" />
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f4f8',
  },
  contentContainer: {
    flex: 1,
    padding: 16,
  },
  fab: {
    position: 'absolute',
    right: 24,
    bottom: 104,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#2980b9',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
});