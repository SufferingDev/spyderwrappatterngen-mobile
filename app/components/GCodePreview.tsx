import React from 'react';
import { StyleSheet, Text, View, ScrollView } from 'react-native';

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
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  codePreview: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
    backgroundColor: '#f5f8fa',
    padding: 12,
    minHeight: 120,
    height: 120,
  },
  codeText: {
    fontFamily: 'monospace',
    color: '#333',
  },
});

export default GCodePreview;