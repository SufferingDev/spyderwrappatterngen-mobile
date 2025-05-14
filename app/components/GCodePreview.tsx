import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";

interface GCodePreviewProps {
  gCode: string;
}

const GCodePreview = ({ gCode }: GCodePreviewProps) => {
  return (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>G-Code Preview</Text>
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
  cardTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 16,
  },
  codePreview: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 4,
    backgroundColor: "#f5f8fa",
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
