import { Ionicons } from "@expo/vector-icons";
import * as DocumentPicker from "expo-document-picker";
import * as FileSystem from "expo-file-system";
import React, { useCallback, useState } from "react";
import {
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import Toast from "./components/NotificationToast";
import TitleEditorModal from "./components/shared/TitleEditorModal";

// Component imports
import ActionButtons from "./components/ActionButtons";
import GCodePreview from "./components/GCodePreview";
import Header from "./components/Header";
import TabBar from "./components/TabBar";

// Tab content components
import ShellTabContent from "./tabs/ShellTab";
import WrapTabContent from "./tabs/WrapTab";
import MachineTapContent from "./tabs/machineTab";

import genMainGCode from "./utils/genGCode";
import * as utils from "./utils/utils";

export default function Index() {
  const [activeTab, setActiveTab] = useState("SHELL");

  const [tmpPatternName, setTmpPatternName] = useState("");
  const [patternName, setPatternName] = useState("");
  const [showTitleEditor, setShowTitleEditor] = useState(false);

  // Shell tab state
  const [shellSize, setShellSize] = useState("");
  const [measSize, setMeasSize] = useState("");
  const [diameter, setDiameter] = useState("");
  const [circ, setCirc] = useState("");
  const [yaixs, setYaixs] = useState("");
  const [totalKick, setTotalKick] = useState("");
  const [kickRatio, setKickRatio] = useState("");
  const [tapeFeet, setTapeFeet] = useState("");
  const [shellDescription, setShellDescription] = useState("");

  // Wrap tab state
  const [feedrate, setFeedrate] = useState("");
  const [overwrap, setOverwrap] = useState("");
  const [totalLayers, setTotalLayers] = useState("");
  const [perLayer, setPerLayer] = useState("");

  // Burnish state
  const [isEnableBurnish, setIsEnableBurnish] = useState(false);
  const [burnishPcg, setBurnishPcg] = useState("");
  const [rampStep, setRampStep] = useState("");
  const [startSpeed, setStartSpeed] = useState("");
  const [finalSpeed, setFinalSpeed] = useState("");

  // Pump State
  const [isEnablePump, setIsEnablePump] = useState(false);
  const [pumpOnCode, setPumpOnCode] = useState("");
  const [pumpOffCode, setPumpOffCode] = useState("");
  const [cycPerShell, setCycPerShell] = useState("");
  const [duration, setDuration] = useState("");

  // G-Code state
  const [startupGCode, setStartupGCode] = useState("");
  const [endOfMainWrap, setEndOfMainWrap] = useState("");
  const [endOfCompleteWrap, setEndOfCompleteWrap] = useState("");
  const [gCode, setGCode] = useState("(G-Code will appear here)");

  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState(
    "Please enter all the dependencies"
  );

  // Add these state variables
  const [selectedExtension, setSelectedExtension] = useState(".mum");
  const fileExtensions = [".mum", ".gcode"]; // Add your extensions here

  const handleLoad = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: "*/*", // Allow all file types
        multiple: false,
      });

      console.log("DocumentPicker result:", result);

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const selectedFile = result.assets[0];

        const fileName = selectedFile.name || selectedFile.uri.split("/").pop();

        // Enforce .mum file extension
        if (!fileName?.endsWith(".mum")) {
          alert("Only .mum files are allowed.");
          return;
        }

        // iOS specific check
        if (Platform.OS === "ios" && !selectedFile.uri.startsWith("file://")) {
          alert("Cannot access this file on iOS.");
          return;
        }

        // Read and parse JSON
        const fileContent = await FileSystem.readAsStringAsync(
          selectedFile.uri
        );
        const jsonData = JSON.parse(fileContent);

        // Set state values here...
        setPatternName(jsonData.Pattern_Name ?? "");
        setShellSize(jsonData.Shell_Size ?? "");
        setMeasSize(jsonData.Measured_Size ?? "");
        setDiameter(jsonData.Diameter_Percentage ?? "");
        setCirc(jsonData.Circ_Plus ?? "");
        setYaixs(jsonData.YAixs_Percentage ?? "");
        setTotalKick(jsonData.Total_Kick ?? "");
        setKickRatio(jsonData.Kick_Ratio ?? "");
        setShellDescription(jsonData.Shell_Description ?? "");
        setFeedrate(jsonData.Wrap_Feedrate ?? "");
        setOverwrap(jsonData.Overwrap_Percentage ?? "");
        setTotalLayers(jsonData.Total_Layers ?? "");
        setPerLayer(jsonData.Wraps_Per_Layer ?? "");
        setBurnishPcg(jsonData.Burnish_Layer_Percentage ?? "");
        setRampStep(jsonData.Burnish_Ramp_Steps ?? "");
        setStartSpeed(jsonData.Burnish_Start_Speed ?? "");
        setFinalSpeed(jsonData.Burnish_Final_Steps ?? "");
        setStartupGCode(jsonData.Startup_Gcode ?? "");
        setEndOfMainWrap(jsonData.End_Of_Main_Wrap ?? "");
        setEndOfCompleteWrap(jsonData.End_Of_Complete_Wrap ?? "");
        setIsEnablePump(jsonData.Pump_Enable ?? false);
        setPumpOnCode(jsonData.Pump_On_Code ?? "");
        setPumpOffCode(jsonData.Pump_Off_Code ?? "");
        setCycPerShell(jsonData.Pump_Cycles ?? "");
        setDuration(jsonData.Pump_Duration ?? "");
        setTapeFeet(jsonData.Total_Estimated_Feet ?? "");

        setToastMessage("File loaded successfully");
        setShowToast(true);
      } else {
        console.log("Document picking was canceled or returned no data");
      }
    } catch (error) {
      console.error("Error loading file:", error);
      setToastMessage("Failed to load file");
      setShowToast(true);
    }
  };

  const pickFolderAndSave = async (
    content: string,
    fileName: string
  ): Promise<void> => {
    try {
      if (Platform.OS !== "android" && Platform.OS !== "ios") {
        alert("File saving is only supported on mobile platforms");
        return;
      }

      // For Android, we'll use the Storage Access Framework
      if (Platform.OS === "android") {
        try {
          const permissions =
            await FileSystem.StorageAccessFramework.requestDirectoryPermissionsAsync();

          // User cancelled the folder picker
          if (!permissions.granted || !permissions.directoryUri) {
            // Don't show error, just return silently
            return;
          }

          const fileUri =
            await FileSystem.StorageAccessFramework.createFileAsync(
              permissions.directoryUri,
              fileName + ".mum",
              "application/json"
            );

          await FileSystem.writeAsStringAsync(fileUri, content);
          setToastMessage(`File saved successfully as ${fileName}.mum`);
          setShowToast(true);
        } catch (error) {
          // Only show error if it's not a user cancellation
          if (
            error instanceof Error &&
            !error.message.includes("User cancelled")
          ) {
            console.error("Error saving file:", error);
            setToastMessage("Failed to save file. Please try again.");
            setShowToast(true);
          }
        }
      }
      // For iOS, we'll use document picker to get a security-scoped URL
      else if (Platform.OS === "ios") {
        // On iOS, we can save to the app's documents directory
        const documentDirectory = FileSystem.documentDirectory;
        const fileUri = `${documentDirectory}${fileName}.mum`;

        await FileSystem.writeAsStringAsync(fileUri, content);

        // Share the file so user can save it elsewhere
        await FileSystem.shareAsync(fileUri, {
          mimeType: "application/json",
          dialogTitle: `Save ${fileName}.mum`,
          UTI: "public.json",
        });
      }
    } catch (err: unknown) {
      console.error("Error saving file:", err);

      if (err instanceof Error) {
        // Only show error message if it's not related to user cancellation
        if (!err.message.includes("cancelled")) {
          setToastMessage(`Failed to save file: ${err.message}`);
          setShowToast(true);
        }
      }
    }
  };

  const handleSave = () => {
    if (tmpPatternName.trim() === "") {
      setPatternName(tmpPatternName);
      setShowTitleEditor(true);
      return;
    }

    const data = {
      Pattern_Name: patternName, // string

      Shell_Description: shellDescription, // string
      Shell_Size: shellSize, // string or number
      Measured_Size: measSize,
      Diameter_Percentage: diameter,
      Circ_Plus: circ,
      YAixs_Percentage: yaixs,
      Total_Kick: totalKick,
      Kick_Ratio: kickRatio,

      Wrap_Feedrate: feedrate,
      Overwrap_Percentage: overwrap,
      Total_Layers: totalLayers,
      Wraps_Per_Layer: perLayer,

      Burnish_Layer_Percentage: burnishPcg,
      Burnish_Start_Speed: rampStep,
      Burnish_Ramp_Steps: startSpeed,
      Burnish_Final_Steps: finalSpeed,

      Startup_Gcode: startupGCode,
      End_Of_Main_Wrap: endOfMainWrap,
      End_Of_Complete_Wrap: endOfCompleteWrap,

      Total_Estimated_Feet: tapeFeet, // number or string

      Pump_Enable: isEnablePump, // boolean
      Pump_On_Code: pumpOnCode,
      Pump_Off_Code: pumpOffCode,
      Pump_Cycles: cycPerShell,
      Pump_Duration: duration,
    };

    // Convert to JSON string with indentation
    const formData = JSON.stringify(data, null, 2);

    pickFolderAndSave(formData, patternName);
  };

  const handleExport = useCallback(() => {
    if (gCode.trim() === "" || gCode === "(G-Code will appear here)") {
      setToastMessage("Please generate G-Code first");
      setShowToast(true);
      return;
    }

    if (patternName.trim() === "") {
      setTmpPatternName(""); // Reset temp name before showing modal
      setShowTitleEditor(true);
      return;
    }

    pickFolderAndSave(gCode, patternName + "_gcode");
  }, [
    gCode,
    patternName,
    setToastMessage,
    setShowToast,
    setTmpPatternName,
    setShowTitleEditor,
  ]);

  const handleGenerate = () => {
    // Check shell tab fields
    const shellFields = [
      { value: shellSize, name: "Shell Size" },
      { value: measSize, name: "Measured Size" },
      { value: diameter, name: "Diameter" },
      { value: circ, name: "Circ Plus" },
      { value: yaixs, name: "Y-Axis" },
      { value: totalKick, name: "Total Kick" },
      { value: kickRatio, name: "Kick Ratio" },
      { value: feedrate, name: "Feedrate" },
      { value: overwrap, name: "Overwrap" },
      { value: totalLayers, name: "Total Layers" },
      { value: perLayer, name: "Wraps Per Layer" },
    ];

    // Find first empty required field
    const emptyField = shellFields.find(
      (field) => !utils.isNumeric(field.value)
    );
    if (emptyField) {
      setToastMessage(`Please enter ${emptyField.name}`);
      setShowToast(true);
      return;
    }

    // Check shell description
    if (shellDescription.trim() === "") {
      setToastMessage("Please enter Shell Description");
      setShowToast(true);
      return;
    }

    // Check burnish fields if enabled
    if (isEnableBurnish) {
      const burnishFields = [
        { value: burnishPcg, name: "Burnish Percentage" },
        { value: rampStep, name: "Ramp Steps" },
        { value: startSpeed, name: "Start Speed" },
        { value: finalSpeed, name: "Final Speed" },
      ];

      const emptyBurnishField = burnishFields.find(
        (field) => !utils.isNumeric(field.value)
      );
      if (emptyBurnishField) {
        setToastMessage(`Please enter ${emptyBurnishField.name}`);
        setShowToast(true);
        return;
      }
    }

    // Check pump fields if enabled
    if (isEnablePump) {
      if (!utils.isNumeric(cycPerShell) || !utils.isNumeric(duration)) {
        setToastMessage("Please enter Pump Cycles and Duration");
        setShowToast(true);
        return;
      }

      if (utils.isEmpty(pumpOnCode) || utils.isEmpty(pumpOffCode)) {
        setToastMessage("Please enter Pump On/Off codes");
        setShowToast(true);
        return;
      }
    }

    // Shell Size variables
    const numMeasSize = parseFloat(measSize);
    const numDiameter = parseFloat(diameter) / 100;
    const numCirc = parseFloat(circ);
    const numYaixs = parseFloat(yaixs); // Adjust if division by 100 is needed

    const numTotalKick = parseFloat(totalKick) / 100;
    const numKickRatio = parseFloat(kickRatio) / 100;

    // Wrap Speed variables
    const numFeedrate = parseFloat(feedrate);
    const numOverWrap = parseFloat(overwrap) / 100;
    const numTotalLayers = parseInt(totalLayers, 10);
    const numPerLayer = parseInt(perLayer, 10);

    // Burnish variable
    const numBurnishPcg = parseFloat(burnishPcg) / 100;
    const numRampStep = parseInt(rampStep, 10);
    const numStartSpeed = parseFloat(startSpeed);
    const numFinalSpeed = parseFloat(finalSpeed);

    // Pump variables
    const numCycPerShell = parseInt(cycPerShell, 10);
    const numDuration = parseFloat(duration);

    const mainGCode = genMainGCode(
      numMeasSize,
      numDiameter,
      numCirc,
      numTotalKick,
      numYaixs,
      numKickRatio,
      numFeedrate,
      numOverWrap,
      numPerLayer,
      numTotalLayers,
      isEnableBurnish,
      numBurnishPcg,
      numRampStep,
      numStartSpeed,
      numFinalSpeed,
      isEnablePump,
      pumpOnCode,
      pumpOffCode,
      numCycPerShell,
      numDuration,
      startupGCode,
      endOfMainWrap,
      endOfCompleteWrap,
      patternName
    );

    setTapeFeet(mainGCode.estTapeFeet.toString());
    setGCode(mainGCode.entireGCode);
    // Success message after generation
    setToastMessage("G-Code generated successfully");
    setShowToast(true);
  };

  // Render active tab content
  const renderActiveTabContent = () => {
    switch (activeTab) {
      case "SHELL":
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
            TapeFeet={tapeFeet}
            setTapeFeet={setTapeFeet}
            shellDescription={shellDescription}
            setShellDescription={setShellDescription}
          />
        );
      case "WRAP":
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
            isEnableBurnish={isEnableBurnish}
            setIsEnableBurnish={setIsEnableBurnish}
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
      case "BURNISH":
        return (
          <MachineTapContent
            isEnablePump={isEnablePump}
            setIsEnablePump={setIsEnablePump}
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

  const handleTitleSave = useCallback(() => {
    if (tmpPatternName.trim() !== "") {
      setPatternName(tmpPatternName);
    }
    setShowTitleEditor(false);
  }, [tmpPatternName]);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#003366" />
      {/* Header */}
      <Header />

      {/* Pattern Name Display */}
      <View style={styles.patternNameContainer}>
        <Text style={styles.patternNameLabel}>Pattern Name:</Text>
        <Text style={styles.patternNameValue}>{patternName || "Untitled"}</Text>
        <TouchableOpacity
          style={styles.editButton}
          onPress={() => setShowTitleEditor(true)}
        >
          <Ionicons name="pencil" size={18} color="#2980b9" />
        </TouchableOpacity>
      </View>

      {/* Tabs */}
      <TabBar activeTab={activeTab} setActiveTab={setActiveTab} />
      <ScrollView style={styles.contentContainer}>
        {/* Render content based on active tab */}
        {renderActiveTabContent()}
      </ScrollView>
      <Toast
        message={toastMessage}
        visible={showToast}
        onHide={() => setShowToast(false)}
      />
      {/* G-Code Preview - shown on all tabs */}
      <GCodePreview gCode={gCode} />

      <TitleEditorModal
        visible={showTitleEditor}
        value={tmpPatternName}
        // extensions={fileExtensions}
        // selectedExtension={selectedExtension}
        onChangeText={setTmpPatternName}
        // onExtensionChange={setSelectedExtension}
        onSave={handleTitleSave}
        onCancel={() => {
          setTmpPatternName(patternName);
          setShowTitleEditor(false);
        }}
      />

      {/* Bottom Buttons */}
      <ActionButtons
        onLoad={handleLoad}
        onSave={handleSave}
        onExport={handleExport}
      />
      {/* Floating Action Button */}
      <TouchableOpacity style={styles.fab} onPress={handleGenerate}>
        <Ionicons name="logo-google" size={24} color="white" />
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f4f8",
  },
  contentContainer: {
    flex: 1,
    padding: 16,
  },
  patternNameContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  patternNameLabel: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#333",
    marginRight: 8,
  },
  patternNameValue: {
    fontSize: 14,
    color: "#2980b9",
    flex: 1,
  },
  editButton: {
    padding: 4,
  },
  fab: {
    position: "absolute",
    right: 24,
    bottom: 104,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#2980b9",
    justifyContent: "center",
    alignItems: "center",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
});
