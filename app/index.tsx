// File: app/index.tsx
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
import BurnishTabContent from './tabs/machineTab';

export default function Index() {
  const [activeTab, setActiveTab] = useState('SHELL');
  
  // Shell tab state
  const [shellSize, setShellSize] = useState('');
  const [measSize, setMeasSize] = useState('');
  const [diameter, setDiameter] = useState('');
  const [circ, setCirc] = useState('');
  const [shellDescription, setShellDescription] = useState('');
  
  // Wrap tab state
  const [feedrate, setFeedrate] = useState('');
  const [overwrap, setOverwrap] = useState('');
  const [totalLayers, setTotalLayers] = useState('');
  const [perLayer, setPerLayer] = useState('');
  
  // Burnish tab state
  const [burnishSpeed, setBurnishSpeed] = useState('');
  const [burnishPressure, setBurnishPressure] = useState('');
  
  // G-Code state
  const [gCode, setGCode] = useState('(G-Code will appear here)');

  const handleGenerate = () => {
    // Logic to generate G-Code would go here
    setGCode('G1 X0 Y0 Z0\nG1 F' + feedrate + '\n// Generated G-Code based on inputs');
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
          />
        );
      case 'BURNISH':
        return (
          <BurnishTabContent
            burnishSpeed={burnishSpeed}
            setBurnishSpeed={setBurnishSpeed}
            burnishPressure={burnishPressure}
            setBurnishPressure={setBurnishPressure}
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

        {/* G-Code Preview - shown on all tabs */}
        <GCodePreview gCode={gCode} />

        {/* Bottom Buttons */}
        <ActionButtons onGenerate={handleGenerate} />
      </ScrollView>
      
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
    bottom: 24,
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