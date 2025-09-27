/*
import React, { ReactNode } from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface CardProps {
  title: string;
  children: ReactNode;
}

const Card = ({ title, children }: CardProps) => {
  return (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>{title}</Text>
      {children}
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
});

export default Card;
*/

/*


import React, { ReactNode, useState, Children, cloneElement, isValidElement } from 'react';
import { StyleSheet, Text, View, Switch } from 'react-native';

interface CardProps {
  title: string;
  children: ReactNode;
  showToggle?: boolean;
  initialEnabled?: boolean;
  onToggleChange?: (enabled: boolean) => void;
}

const Card = ({ 
  title, 
  children, 
  showToggle = false, 
  initialEnabled = true,
  onToggleChange 
}: CardProps) => {
  const [enabled, setEnabled] = useState(initialEnabled);

  const handleToggleChange = (value: boolean) => {
    setEnabled(value);
    if (onToggleChange) {
      onToggleChange(value);
    }
  };

  // Function to recursively disable/enable all InputField components
  const modifyChildrenState = (children: ReactNode): ReactNode => {
    return Children.map(children, child => {
      if (!isValidElement(child)) {
        return child;
      }

      if (child.type.name === 'InputField') {
        // Clone the InputField and add disabled prop
        return cloneElement(child, { 
          ...child.props,
          editable: enabled 
        });
      }

      // If the child has children, recursively process them
      if (child.props.children) {
        const newChildren = modifyChildrenState(child.props.children);
        return cloneElement(child, { ...child.props, children: newChildren });
      }

      return child;
    });
  };

  // Apply the enabled/disabled state to all input fields
  const modifiedChildren = modifyChildrenState(children);

  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.cardTitle}>{title}</Text>
        {showToggle && (
          <Switch
            value={enabled}
            onValueChange={handleToggleChange}
            trackColor={{ false: '#D3D3D3', true: '#81b0ff' }}
            thumbColor={enabled ? '#4682B4' : '#f4f3f4'}
          />
        )}
      </View>
      {modifiedChildren}
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
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
});

export default Card;

*/

import React, { ReactNode, useEffect, useState } from "react";
import { StyleSheet, Switch, Text, View } from "react-native";

interface CardProps {
  title: string;
  children: ReactNode;
  showToggle?: boolean;
  initialEnabled?: boolean;
  onToggleChange?: (enabled: boolean) => void;
}

const Card = ({
  title,
  children,
  showToggle = false,
  initialEnabled = true,
  onToggleChange,
}: CardProps) => {
  const [enabled, setEnabled] = useState(initialEnabled);

  useEffect(() => {
    setEnabled(initialEnabled);
  }, [initialEnabled]);

  const handleToggleChange = (value: boolean) => {
    setEnabled(value);
    if (onToggleChange) {
      onToggleChange(value);
    }
  };
  /*
  // Function to recursively disable/enable all InputField components
  const modifyChildrenState = (children: ReactNode): ReactNode => {
    return Children.map(children, child => {
      if (!isValidElement(child)) {
        return child;
      }

      // Check if this is an InputField by looking for key InputField props
      // We'll look for common props that InputField has
      if (child.props && 'validateType' in child.props && 'onChangeText' in child.props) {
        console.log('-------------------------- llog ------------------------------');
        // This appears to be an InputField component
        return cloneElement(child, { 
          ...child.props,
          editable: true 
        });
      }

      // If the child has children, recursively process them
      if (child.props.children) {
        const newChildren = modifyChildrenState(child.props.children);
        return cloneElement(child, { ...child.props, children: newChildren });
      }

      return child;
    });
  };
  // Apply the enabled/disabled state to all input fields
  const modifiedChildren = modifyChildrenState(children);
  */

  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.cardTitle}>{title}</Text>
        {showToggle && (
          <Switch
            value={enabled}
            onValueChange={handleToggleChange}
            trackColor={{ false: "#D3D3D3", true: "#2296F3" }}
            thumbColor={enabled ? "#2A80B9" : "#f4f3f4"}
          />
        )}
      </View>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "white",
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  cardHeader: {
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
});

export default Card;
