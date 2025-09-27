// eslint-disable-next-line import/no-unresolved
import AsyncStorage from "@react-native-async-storage/async-storage";
import type {
  MachinePresetData,
  NamedPreset,
  ShellWrapPresetData,
  StorageKey,
} from "./presetStorage.shared";
import {
  KEY_MACHINE_PRESETS,
  KEY_SELECTED_MACHINE,
  KEY_SELECTED_SHELL,
  KEY_SHELL_PRESETS,
  parsePresetList,
} from "./presetStorage.shared";

const getItem = async (key: StorageKey): Promise<string | null> => {
  try {
    return await AsyncStorage.getItem(key);
  } catch (error) {
    console.warn(`Failed to retrieve ${key} from storage`, error);
    return null;
  }
};

const setItem = async (key: StorageKey, value: string): Promise<void> => {
  try {
    await AsyncStorage.setItem(key, value);
  } catch (error) {
    console.warn(`Failed to persist ${key} to storage`, error);
  }
};

const removeItem = async (key: StorageKey): Promise<void> => {
  try {
    await AsyncStorage.removeItem(key);
  } catch (error) {
    console.warn(`Failed to remove ${key} from storage`, error);
  }
};

export const getShellWrapPresets = async (): Promise<
  NamedPreset<ShellWrapPresetData>[]
> => {
  const raw = await getItem(KEY_SHELL_PRESETS);
  return parsePresetList<ShellWrapPresetData>(raw);
};

export const saveShellWrapPresets = async (
  presets: NamedPreset<ShellWrapPresetData>[]
): Promise<void> => {
  await setItem(KEY_SHELL_PRESETS, JSON.stringify(presets));
};

export const removeShellWrapPresets = async (): Promise<void> => {
  await removeItem(KEY_SHELL_PRESETS);
};

export const getMachinePresets = async (): Promise<
  NamedPreset<MachinePresetData>[]
> => {
  const raw = await getItem(KEY_MACHINE_PRESETS);
  return parsePresetList<MachinePresetData>(raw);
};

export const saveMachinePresets = async (
  presets: NamedPreset<MachinePresetData>[]
): Promise<void> => {
  await setItem(KEY_MACHINE_PRESETS, JSON.stringify(presets));
};

export const removeMachinePresets = async (): Promise<void> => {
  await removeItem(KEY_MACHINE_PRESETS);
};

export const getSelectedShellWrapPreset = async (): Promise<string | null> => {
  return getItem(KEY_SELECTED_SHELL);
};

export const saveSelectedShellWrapPreset = async (
  presetName: string
): Promise<void> => {
  await setItem(KEY_SELECTED_SHELL, presetName);
};

export const removeSelectedShellWrapPreset = async (): Promise<void> => {
  await removeItem(KEY_SELECTED_SHELL);
};

export const getSelectedMachinePreset = async (): Promise<string | null> => {
  return getItem(KEY_SELECTED_MACHINE);
};

export const saveSelectedMachinePreset = async (
  presetName: string
): Promise<void> => {
  await setItem(KEY_SELECTED_MACHINE, presetName);
};

export const removeSelectedMachinePreset = async (): Promise<void> => {
  await removeItem(KEY_SELECTED_MACHINE);
};

export type {
  MachinePresetData,
  NamedPreset,
  ShellWrapPresetData,
} from "./presetStorage.shared";
