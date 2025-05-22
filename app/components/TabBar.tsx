import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

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
        <Text
          style={[styles.tabText, activeTab === name && styles.activeTabText]}
        >
          {name}
        </Text>
        {activeTab === name && <View style={styles.activeIndicator} />}
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.tabContainer}>
      {renderTab("SHELL")}
      {renderTab("WRAP")}
      {renderTab("MACHINE")}
    </View>
  );
};

const styles = StyleSheet.create({
  tabContainer: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
    backgroundColor: "#fff",
  },
  activeTab: {
    backgroundColor: "#2296F3",
  },
  tabText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#666",
  },
  activeTabText: {
    color: "#fff",
    fontWeight: "600",
  },
});

export default TabBar;
