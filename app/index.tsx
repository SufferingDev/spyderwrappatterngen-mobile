import { Ionicons } from "@expo/vector-icons";
import * as DocumentPicker from "expo-document-picker";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import Toast from "./components/NotificationToast";
import TitleEditorModal from "./components/shared/TitleEditorModal";

// Component imports
import ActionButtons from "./components/ActionButtons";
import TabBar from "./components/TabBar";

// Tab content components
import GCodePreview from "./components/GCodePreview";
import ShellTabContent from "./tabs/ShellTab";
import WrapTabContent from "./tabs/WrapTab";
import MachineTapContent from "./tabs/machineTab";

import genMainGCode from "./utils/genGCode";
import * as utils from "./utils/utils";
import {
  MachinePresetData,
  NamedPreset,
  ShellWrapPresetData,
  getMachinePresets,
  getSelectedMachinePresetName,
  getSelectedShellWrapPresetName,
  getShellWrapPresets,
  saveMachinePresets,
  saveSelectedMachinePresetName,
  saveSelectedShellWrapPresetName,
  saveShellWrapPresets,
} from "./utils/presetStorage";

const sortPresets = <T,>(presets: NamedPreset<T>[]) =>
  [...presets].sort((a, b) =>
    a.name.localeCompare(b.name, undefined, { sensitivity: "base" })
  );

export default function Index() {
  const [activeTab, setActiveTab] = useState("SHELL");

  const [openFilePath, setOpenFilePath] = useState("");
  const [openFileName, setOpenFileName] = useState("");

  const [tmpOpenFileName, setTmpOpenFileName] = useState("");
  const [tmpExportFileName, setTmpExportFileName] = useState("");

  const [patternName, setPatternName] = useState("");

  const [showSaveFileTitleEditorModal, setShowSaveFileTitleEditorModal] =
    useState(false);
  const [showExportFileTitleEditorModal, setShowExportFileTitleEditorModal] =
    useState(false);

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

  const [shellWrapPresets, setShellWrapPresets] = useState<
    NamedPreset<ShellWrapPresetData>[]
  >([]);
  const [selectedShellWrapPreset, setSelectedShellWrapPreset] = useState<
    string | null
  >(null);
  const [machinePresets, setMachinePresets] = useState<
    NamedPreset<MachinePresetData>[]
  >([]);
  const [selectedMachinePreset, setSelectedMachinePreset] = useState<
    string | null
  >(null);
  const [showShellPresetModal, setShowShellPresetModal] = useState(false);
  const [shellPresetNameInput, setShellPresetNameInput] = useState("");
  const [showMachinePresetModal, setShowMachinePresetModal] = useState(false);
  const [machinePresetNameInput, setMachinePresetNameInput] = useState("");

  // Add these state variables
  const [selectedExtension, setSelectedExtension] = useState(".mum");
  const fileExtensions = [".mum", ".gcode"]; // Add your extensions here

  const displayToast = useCallback(
    (message: string) => {
      setToastMessage(message);
      setShowToast(true);
    },
    [setShowToast, setToastMessage]
  );

  const applyShellWrapPreset = useCallback(
    (preset: ShellWrapPresetData) => {
      setPatternName(preset.patternName);
      setShellSize(preset.shellSize);
      setMeasSize(preset.measSize);
      setDiameter(preset.diameter);
      setCirc(preset.circ);
      setYaixs(preset.yaixs);
      setTotalKick(preset.totalKick);
      setKickRatio(preset.kickRatio);
      setTapeFeet(preset.tapeFeet);
      setShellDescription(preset.shellDescription);
      setFeedrate(preset.feedrate);
      setOverwrap(preset.overwrap);
      setTotalLayers(preset.totalLayers);
      setPerLayer(preset.perLayer);
      setIsEnableBurnish(preset.isEnableBurnish);
      setBurnishPcg(preset.burnishPcg);
      setRampStep(preset.rampStep);
      setStartSpeed(preset.startSpeed);
      setFinalSpeed(preset.finalSpeed);
    },
    [
      setPatternName,
      setShellSize,
      setMeasSize,
      setDiameter,
      setCirc,
      setYaixs,
      setTotalKick,
      setKickRatio,
      setTapeFeet,
      setShellDescription,
      setFeedrate,
      setOverwrap,
      setTotalLayers,
      setPerLayer,
      setIsEnableBurnish,
      setBurnishPcg,
      setRampStep,
      setStartSpeed,
      setFinalSpeed,
    ]
  );

  const applyMachinePreset = useCallback(
    (preset: MachinePresetData) => {
      setIsEnablePump(preset.isEnablePump);
      setPumpOnCode(preset.pumpOnCode);
      setPumpOffCode(preset.pumpOffCode);
      setCycPerShell(preset.cycPerShell);
      setDuration(preset.duration);
      setStartupGCode(preset.startupGCode);
      setEndOfMainWrap(preset.endOfMainWrap);
      setEndOfCompleteWrap(preset.endOfCompleteWrap);
    },
    [
      setIsEnablePump,
      setPumpOnCode,
      setPumpOffCode,
      setCycPerShell,
      setDuration,
      setStartupGCode,
      setEndOfMainWrap,
      setEndOfCompleteWrap,
    ]
  );

  useEffect(() => {
    const loadPresetsFromStorage = async () => {
      try {
        const [
          storedShellPresets,
          storedMachinePresets,
          storedShellSelection,
          storedMachineSelection,
        ] = await Promise.all([
          getShellWrapPresets(),
          getMachinePresets(),
          getSelectedShellWrapPresetName(),
          getSelectedMachinePresetName(),
        ]);

        const sortedShellPresets = sortPresets(storedShellPresets);
        const sortedMachinePresets = sortPresets(storedMachinePresets);

        setShellWrapPresets(sortedShellPresets);
        setMachinePresets(sortedMachinePresets);

        if (storedShellSelection) {
          const preset = sortedShellPresets.find(
            (item) => item.name === storedShellSelection
          );
          if (preset) {
            applyShellWrapPreset(preset.data);
            setSelectedShellWrapPreset(storedShellSelection);
          }
        }

        if (storedMachineSelection) {
          const preset = sortedMachinePresets.find(
            (item) => item.name === storedMachineSelection
          );
          if (preset) {
            applyMachinePreset(preset.data);
            setSelectedMachinePreset(storedMachineSelection);
          }
        }
      } catch (error) {
        console.warn("Failed to load presets", error);
      }
    };

    loadPresetsFromStorage();
  }, [applyMachinePreset, applyShellWrapPreset]);

  const shellPresetNames = useMemo(
    () => shellWrapPresets.map((preset) => preset.name),
    [shellWrapPresets]
  );

  const machinePresetNames = useMemo(
    () => machinePresets.map((preset) => preset.name),
    [machinePresets]
  );

  const handleSelectShellPreset = useCallback(
    (name: string | null) => {
      if (!name) {
        setSelectedShellWrapPreset(null);
        void saveSelectedShellWrapPresetName(null);
        return;
      }

      const preset = shellWrapPresets.find((item) => item.name === name);
      if (!preset) {
        return;
      }

      applyShellWrapPreset(preset.data);
      setSelectedShellWrapPreset(name);
      void saveSelectedShellWrapPresetName(name);
      displayToast(`Preset "${name}" loaded`);
    },
    [
      applyShellWrapPreset,
      displayToast,
      shellWrapPresets,
    ]
  );

  const handleSaveShellPresetPrompt = useCallback(() => {
    const defaultName =
      patternName.trim() ||
      selectedShellWrapPreset ||
      `Preset ${shellWrapPresets.length + 1}`;
    setShellPresetNameInput(defaultName);
    setShowShellPresetModal(true);
  }, [patternName, selectedShellWrapPreset, shellWrapPresets.length]);

  const handleConfirmSaveShellPreset = useCallback(() => {
    const trimmedName = shellPresetNameInput.trim();
    if (!trimmedName) {
      displayToast("Preset name cannot be empty");
      return;
    }

    const presetPayload: ShellWrapPresetData = {
      patternName,
      shellSize,
      measSize,
      diameter,
      circ,
      yaixs,
      totalKick,
      kickRatio,
      tapeFeet,
      shellDescription,
      feedrate,
      overwrap,
      totalLayers,
      perLayer,
      isEnableBurnish,
      burnishPcg,
      rampStep,
      startSpeed,
      finalSpeed,
    };

    setShellWrapPresets((prev) => {
      const existingIndex = prev.findIndex(
        (preset) => preset.name === trimmedName
      );
      const next = existingIndex >= 0 ? [...prev] : [...prev, { name: trimmedName, data: presetPayload }];
      if (existingIndex >= 0) {
        next[existingIndex] = { name: trimmedName, data: presetPayload };
      }
      const sorted = sortPresets(next);
      void saveShellWrapPresets(sorted);
      return sorted;
    });

    setSelectedShellWrapPreset(trimmedName);
    void saveSelectedShellWrapPresetName(trimmedName);
    setShowShellPresetModal(false);
    displayToast(`Preset "${trimmedName}" saved`);
  }, [
    shellPresetNameInput,
    displayToast,
    patternName,
    shellSize,
    measSize,
    diameter,
    circ,
    yaixs,
    totalKick,
    kickRatio,
    tapeFeet,
    shellDescription,
    feedrate,
    overwrap,
    totalLayers,
    perLayer,
    isEnableBurnish,
    burnishPcg,
    rampStep,
    startSpeed,
    finalSpeed,
  ]);

  const handleDeleteShellPreset = useCallback(() => {
    if (!selectedShellWrapPreset) {
      displayToast("Select a preset to delete");
      return;
    }

    const filtered = shellWrapPresets.filter(
      (preset) => preset.name !== selectedShellWrapPreset
    );

    if (filtered.length === shellWrapPresets.length) {
      displayToast("Preset not found");
      return;
    }

    const sorted = sortPresets(filtered);
    setShellWrapPresets(sorted);
    setSelectedShellWrapPreset(null);
    void saveShellWrapPresets(sorted);
    void saveSelectedShellWrapPresetName(null);
    displayToast(`Preset "${selectedShellWrapPreset}" deleted`);
  }, [
    displayToast,
    selectedShellWrapPreset,
    shellWrapPresets,
  ]);

  const handleSelectMachinePreset = useCallback(
    (name: string | null) => {
      if (!name) {
        setSelectedMachinePreset(null);
        void saveSelectedMachinePresetName(null);
        return;
      }

      const preset = machinePresets.find((item) => item.name === name);
      if (!preset) {
        return;
      }

      applyMachinePreset(preset.data);
      setSelectedMachinePreset(name);
      void saveSelectedMachinePresetName(name);
      displayToast(`Preset "${name}" loaded`);
    },
    [applyMachinePreset, displayToast, machinePresets]
  );

  const handleSaveMachinePresetPrompt = useCallback(() => {
    const defaultName =
      selectedMachinePreset || `Machine Preset ${machinePresets.length + 1}`;
    setMachinePresetNameInput(defaultName);
    setShowMachinePresetModal(true);
  }, [machinePresets.length, selectedMachinePreset]);

  const handleConfirmSaveMachinePreset = useCallback(() => {
    const trimmedName = machinePresetNameInput.trim();
    if (!trimmedName) {
      displayToast("Preset name cannot be empty");
      return;
    }

    const presetPayload: MachinePresetData = {
      isEnablePump,
      pumpOnCode,
      pumpOffCode,
      cycPerShell,
      duration,
      startupGCode,
      endOfMainWrap,
      endOfCompleteWrap,
    };

    setMachinePresets((prev) => {
      const existingIndex = prev.findIndex(
        (preset) => preset.name === trimmedName
      );
      const next = existingIndex >= 0 ? [...prev] : [...prev, { name: trimmedName, data: presetPayload }];
      if (existingIndex >= 0) {
        next[existingIndex] = { name: trimmedName, data: presetPayload };
      }
      const sorted = sortPresets(next);
      void saveMachinePresets(sorted);
      return sorted;
    });

    setSelectedMachinePreset(trimmedName);
    void saveSelectedMachinePresetName(trimmedName);
    setShowMachinePresetModal(false);
    displayToast(`Preset "${trimmedName}" saved`);
  }, [
    machinePresetNameInput,
    displayToast,
    isEnablePump,
    pumpOnCode,
    pumpOffCode,
    cycPerShell,
    duration,
    startupGCode,
    endOfMainWrap,
    endOfCompleteWrap,
  ]);

  const handleDeleteMachinePreset = useCallback(() => {
    if (!selectedMachinePreset) {
      displayToast("Select a preset to delete");
      return;
    }

    const filtered = machinePresets.filter(
      (preset) => preset.name !== selectedMachinePreset
    );

    if (filtered.length === machinePresets.length) {
      displayToast("Preset not found");
      return;
    }

    const sorted = sortPresets(filtered);
    setMachinePresets(sorted);
    setSelectedMachinePreset(null);
    void saveMachinePresets(sorted);
    void saveSelectedMachinePresetName(null);
    displayToast(`Preset "${selectedMachinePreset}" deleted`);
  }, [
    displayToast,
    machinePresets,
    selectedMachinePreset,
  ]);

  const handleLoad = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: "*/*", // Allow all file types
        multiple: false,
      });

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
        let fileContent: string;
        if (Platform.OS === "web") {
          const webFile = (
            selectedFile as unknown as {
              file?: { text: () => Promise<string> };
            }
          ).file;
          if (webFile) {
            fileContent = await webFile.text();
          } else {
            const response = await fetch(selectedFile.uri);
            if (!response.ok) {
              throw new Error("Unable to read selected file");
            }
            fileContent = await response.text();
          }
        } else {
          fileContent = await FileSystem.readAsStringAsync(selectedFile.uri);
        }

        setOpenFilePath(selectedFile.uri);
        setOpenFileName(selectedFile.name);
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

        setGCode("(G-Code will appear here)"); // Reset G-Code preview
        displayToast("File loaded successfully");
      } else {
        console.log("Document picking was canceled or returned no data");
      }
    } catch (error) {
      console.error("Error loading file:", error);
      displayToast("Failed to load file");
    }
  };

  const collectFormData = useCallback(() => {
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
    return formData;
  }, [
    burnishPcg,
    circ,
    cycPerShell,
    diameter,
    duration,
    endOfCompleteWrap,
    endOfMainWrap,
    feedrate,
    finalSpeed,
    isEnablePump,
    kickRatio,
    measSize,
    patternName,
    perLayer,
    pumpOffCode,
    pumpOnCode,
    rampStep,
    shellDescription,
    shellSize,
    startSpeed,
    startupGCode,
    tapeFeet,
    totalKick,
    totalLayers,
    overwrap,
    yaixs,
  ]);

  const pickFolderAndSave = useCallback(
    async (
      content: string,
      fileName: string,
      updateOpenFile: boolean = true
    ): Promise<void> => {
      try {
        if (Platform.OS === "web") {
          const targetFileName = updateOpenFile
            ? `${fileName}.mum`
            : fileName;

          const doc = globalThis.document;
          const urlApi = globalThis.URL;
          if (!doc || !urlApi) {
            throw new Error("Web saving is not supported in this environment");
          }

          const blob = new Blob([content], {
            type: updateOpenFile ? "application/json" : "text/plain",
          });
          const url = urlApi.createObjectURL(blob);

          const anchor = doc.createElement("a");
          anchor.href = url;
          anchor.download = targetFileName;
          doc.body.appendChild(anchor);
          anchor.click();
          doc.body.removeChild(anchor);
          urlApi.revokeObjectURL(url);

          if (updateOpenFile) {
            setOpenFileName(targetFileName);
            setOpenFilePath("");
          }
          displayToast(`File downloaded as ${targetFileName}`);
          return;
        }

        if (Platform.OS !== "android" && Platform.OS !== "ios") {
          alert("File saving is only supported on this platform");
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

            if (updateOpenFile === true) {
              const fileUri =
                await FileSystem.StorageAccessFramework.createFileAsync(
                  permissions.directoryUri,
                  fileName + ".mum",
                  "application/json"
                );

              setOpenFilePath(fileUri);
              setOpenFileName(fileName + ".mum");
              await FileSystem.writeAsStringAsync(fileUri, content);
              displayToast(`File saved successfully as ${fileName}.mum`);
            } else {
              const fileUri =
                await FileSystem.StorageAccessFramework.createFileAsync(
                  permissions.directoryUri,
                  fileName,
                  "application/octet-stream"
                );
              console.log("File URI:", fileUri);
              await FileSystem.writeAsStringAsync(fileUri, content);
              displayToast(`File saved successfully as ${fileName}`);
            }

            // await FileSystem.writeAsStringAsync(fileUri, content);
            // displayToast(`File saved successfully as ${fileName}.mum`);
          } catch (error) {
            // Only show error if it's not a user cancellation
            if (
              error instanceof Error &&
              !error.message.includes("User cancelled")
            ) {
              console.error("Error saving file:", error);
              displayToast("Failed to save file. Please try again.");
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
          await Sharing.shareAsync(fileUri, {
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
            displayToast(`Failed to save file: ${err.message}`);
          }
        }
      }
    },
    [displayToast, setOpenFileName, setOpenFilePath]
  );

  const handleSave = async () => {
    if (validateInputValues() === false) {
      return;
    }
    try {
      if (Platform.OS === "web") {
        if (!openFileName) {
          handleSaveAsNew();
          return;
        }

        const formData = collectFormData();
        pickFolderAndSave(formData, openFileName.replace(/\.mum$/, ""), true);
        return;
      }

      // If Save As New
      if (openFilePath.trim() === "") {
        handleSaveAsNew();
      } else {
        const formData = collectFormData();
        console.log("Saving to existing file path:", formData);

        // Check if file exists
        const fileInfo = await FileSystem.getInfoAsync(openFilePath);
        if (!fileInfo.exists) {
          console.log("File does not exist:", openFilePath);
          return false;
        }

        await FileSystem.writeAsStringAsync(openFilePath, formData, {
          encoding: FileSystem.EncodingType.UTF8,
        });

        // Verify the write was successful by reading back the file
        const verifyContent = await FileSystem.readAsStringAsync(openFilePath, {
          encoding: FileSystem.EncodingType.UTF8,
        });

        if (verifyContent === formData) {
          displayToast("File saved successfully");
        } else {
          throw new Error("File verification failed");
        }
      }
    } catch (error) {
      console.error("Error saving file:", error);
      displayToast("Failed to save file");
    }
  };

  const handleSaveAsNew = async () => {
    if (validateInputValues() === false) {
      return;
    }
    // setOpenFileName(tmpPatternName);
    setShowSaveFileTitleEditorModal(true);
    return;
  };
  const handleExport = useCallback(() => {
    if (gCode.trim() === "" || gCode === "(G-Code will appear here)") {
      displayToast("Please generate G-Code first");
      return;
    }

    setShowExportFileTitleEditorModal(true);
    // if (patternName.trim() === "") {
    //   setTmpPatternName(""); // Reset temp name before showing modal
    //   return;
    // }

    // pickFolderAndSave(gCode, patternName + "_gcode");
  }, [displayToast, gCode]);

  const validateInputValues = () => {
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
      displayToast(`Please enter a positive numeric ${emptyField.name}`);
      return false;
    }

    // Check shell description
    if (shellDescription.trim() === "") {
      displayToast("Please enter Shell Description");
      return false;
    }

    // Check pattern name
    if (patternName.trim() === "") {
      displayToast("Please enter Pattern Name");
      return false;
    }

    // Check burnish fields if enabled
    if (isEnableBurnish) {
      const burnishFields = [
        // { value: burnishPcg, name: "Burnish Percentage" },
        { value: rampStep, name: "Ramp Steps" },
        { value: startSpeed, name: "Start Speed" },
        { value: finalSpeed, name: "Final Speed" },
      ];

      const emptyBurnishField = burnishFields.find(
        (field) => !utils.isNumeric(field.value)
      );
      if (emptyBurnishField) {
        displayToast(`Please enter ${emptyBurnishField.name}`);
        return false;
      }
    }

    // Check pump fields if enabled
    if (isEnablePump) {
      if (!utils.isNumeric(cycPerShell) || !utils.isNumeric(duration)) {
        displayToast("Please enter Pump Cycles and Duration");
        return false;
      }

      if (utils.isEmpty(pumpOnCode) || utils.isEmpty(pumpOffCode)) {
        displayToast("Please enter Pump On/Off codes");
        return false;
      }
    }
    return true;
  };

  const handleGenerate = () => {
    // Check shell tab fields
    if (validateInputValues() === false) {
      return;
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
    displayToast("G-Code generated successfully");
  };

  // Render active tab content
  const renderActiveTabContent = () => {
    switch (activeTab) {
      case "SHELL":
        return (
          <ShellTabContent
            patternName={patternName}
            setPatternName={setPatternName}
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
            presetNames={shellPresetNames}
            selectedPreset={selectedShellWrapPreset}
            onSelectPreset={handleSelectShellPreset}
            onSavePreset={handleSaveShellPresetPrompt}
            onDeletePreset={handleDeleteShellPreset}
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
            presetNames={shellPresetNames}
            selectedPreset={selectedShellWrapPreset}
            onSelectPreset={handleSelectShellPreset}
            onSavePreset={handleSaveShellPresetPrompt}
            onDeletePreset={handleDeleteShellPreset}
          />
        );
      case "MACHINE":
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
            presetNames={machinePresetNames}
            selectedPreset={selectedMachinePreset}
            onSelectPreset={handleSelectMachinePreset}
            onSavePreset={handleSaveMachinePresetPrompt}
            onDeletePreset={handleDeleteMachinePreset}
          />
        );
      default:
        return null;
    }
  };

  const handleSavingTitle = useCallback(() => {
    if (tmpOpenFileName.trim() !== "") {
      setOpenFileName(tmpOpenFileName + ".mum");
    }

    // if (utils.getFileExtension(tmpOpenFileName) !== "mum") {
    //   displayToast("Please use .mum file extension");
    //   return;
    // }
    setShowSaveFileTitleEditorModal(false);
    const formData = collectFormData();
    pickFolderAndSave(formData, tmpOpenFileName, true);
  }, [collectFormData, pickFolderAndSave, tmpOpenFileName]);

  const handleExportTitleSave = () => {
    const ext = utils.getFileExtension(tmpExportFileName);
    const validExtensions = ["tap", "gcode", "gco"];

    if (!validExtensions.includes(ext)) {
      displayToast("Please use .tap, .gcode or .gco file extension");
      return;
    }
    setShowExportFileTitleEditorModal(false);
    pickFolderAndSave(gCode, tmpExportFileName, false);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* <StatusBar barStyle="light-content" backgroundColor="#003366" /> */}
      {/* Header */}
      {/* <Header /> */}

      {/* Pattern Name Display */}
      <View style={styles.patternNameContainer}>
        {/* <Text style={styles.patternNameLabel}>Pattern Name:</Text> */}
        <Text style={styles.patternNameValue}>
          {openFileName || "Untitled"}
        </Text>
        {/* <TouchableOpacity
          style={styles.editButton}
          onPress={() => setShowTitleEditor(true)}
        >
          <Ionicons name="pencil" size={18} color="#2980b9" />
        </TouchableOpacity> */}
      </View>

      {/* Tabs */}
      <TabBar activeTab={activeTab} setActiveTab={setActiveTab} />
      <ScrollView style={styles.contentContainer}>
        {/* Render content based on active tab */}
        {renderActiveTabContent()}
      </ScrollView>
      {/* G-Code Preview - shown on all tabs */}
      <GCodePreview gCode={gCode} tapeFeet={tapeFeet} />

      <TitleEditorModal
        visible={showShellPresetModal}
        value={shellPresetNameInput}
        extensions={[]}
        onChangeText={setShellPresetNameInput}
        onSave={handleConfirmSaveShellPreset}
        onCancel={() => setShowShellPresetModal(false)}
        title="Save shell & wrap preset"
        placeholder="Enter preset name"
        confirmLabel="Save preset"
      />

      <TitleEditorModal
        visible={showMachinePresetModal}
        value={machinePresetNameInput}
        extensions={[]}
        onChangeText={setMachinePresetNameInput}
        onSave={handleConfirmSaveMachinePreset}
        onCancel={() => setShowMachinePresetModal(false)}
        title="Save machine preset"
        placeholder="Enter preset name"
        confirmLabel="Save preset"
      />

      <TitleEditorModal
        visible={showSaveFileTitleEditorModal}
        value={tmpOpenFileName}
        onChangeText={setTmpOpenFileName}
        title="Enter Saving File Name"
        onSave={handleSavingTitle}
        onCancel={() => {
          setTmpOpenFileName(openFileName);
          setShowSaveFileTitleEditorModal(false);
        }}
      />

      <TitleEditorModal
        visible={showExportFileTitleEditorModal}
        value={tmpExportFileName}
        onChangeText={setTmpExportFileName}
        title="Enter Export File Name(*.gcode, *.gco, *.tap)"
        onSave={handleExportTitleSave}
        onCancel={() => {
          setTmpExportFileName("");
          setShowExportFileTitleEditorModal(false);
        }}
      />

      <Toast
        message={toastMessage}
        visible={showToast}
        onHide={() => setShowToast(false)}
      />

      {/* Bottom Buttons */}
      <ActionButtons
        onLoad={handleLoad}
        onSave={handleSave}
        onSaveAsNew={handleSaveAsNew}
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
