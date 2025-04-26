// File: components/TabBar.tsx
import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';

interface TabBarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const TabBar = ({ activeTab, setActiveTab }: TabBarProps) => {
  const renderTab = (name: string) => {
    return (
      <TouchableOpacity 
        style={[styles.tab, activeTab === name && styles.activeTab]} 
        onPress={() => setActiveTab(name)}
      >
        <Text style={[styles.tabText, activeTab === name && styles.activeTabText]}>{name}</Text>
        {activeTab === name && <View style={styles.activeIndicator} />}
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.tabContainer}>
      {renderTab('SHELL')}
      {renderTab('WRAP')}
      {renderTab('BURNISH')}
    </View>
  );
};

const styles = StyleSheet.create({
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#e5eef7',
  },
  tab: {
    flex: 1,
    paddingVertical: 16,
    alignItems: 'center',
    position: 'relative',
  },
  activeTab: {
    backgroundColor: '#e5eef7',
  },
  tabText: {
    color: '#8c9db5',
    fontWeight: '500',
  },
  activeTabText: {
    color: '#2980b9',
    fontWeight: 'bold',
  },
  activeIndicator: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 3,
    backgroundColor: '#2980b9',
  },
});

export default TabBar;