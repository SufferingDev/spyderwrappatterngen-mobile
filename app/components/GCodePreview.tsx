import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";

interface GCodePreviewProps {
  gCode: string;
  tapeFeet: string;
}

const GCodePreview = ({ gCode, tapeFeet }: GCodePreviewProps) => {
  return (
    <View style={styles.card}>
      <View style={styles.titleRow}>
        <Text style={styles.cardTitle}>G-Code Preview</Text>
        <Text style={styles.tapeFeetText}>{tapeFeet}</Text>
      </View>
      <ScrollView style={styles.codePreview}>
        <Text style={styles.codeText}>{gCode}</Text>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "white",
    borderRadius: 8,
    padding: 16,
    marginBottom: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  titleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  tapeFeetText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#666",
  },
  codePreview: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 4,
    backgroundColor: "#f5f8fa",
    color: "white",
    padding: 12,
    minHeight: 120,
    height: 150,
  },
  codeText: {
    fontFamily: "monospace",
    color: "#333",
  },
});

export default GCodePreview;
