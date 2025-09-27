import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";

export interface ShellWrapPresetData {
  patternName: string;
  shellSize: string;
  measSize: string;
  diameter: string;
  circ: string;
  yaixs: string;
  totalKick: string;
  kickRatio: string;
  tapeFeet: string;
  shellDescription: string;
  feedrate: string;
  overwrap: string;
  totalLayers: string;
  perLayer: string;
  isEnableBurnish: boolean;
  burnishPcg: string;
  rampStep: string;
  startSpeed: string;
  finalSpeed: string;
}

export interface MachinePresetData {
  isEnablePump: boolean;
  pumpOnCode: string;
  pumpOffCode: string;
  cycPerShell: string;
  duration: string;
  startupGCode: string;
  endOfMainWrap: string;
  endOfCompleteWrap: string;
}

export interface NamedPreset<T> {
  name: string;
  data: T;
}

const COOKIE_EXPIRATION_DAYS = 3650; // ~10 years

const KEY_SHELL_PRESETS = "shellWrapPresets";
const KEY_MACHINE_PRESETS = "machinePresets";
const KEY_SELECTED_SHELL = "selectedShellWrapPreset";
const KEY_SELECTED_MACHINE = "selectedMachinePreset";

type StorageKey =
  | typeof KEY_SHELL_PRESETS
  | typeof KEY_MACHINE_PRESETS
  | typeof KEY_SELECTED_SHELL
  | typeof KEY_SELECTED_MACHINE;

const getCookieValue = (name: string): string | null => {
  if (typeof document === "undefined") {
    return null;
  }

  const decodedName = decodeURIComponent(name);
  const cookies = document.cookie ? document.cookie.split("; ") : [];

  for (const cookie of cookies) {
    const [rawName, ...rest] = cookie.split("=");
    if (decodeURIComponent(rawName) === decodedName) {
      return decodeURIComponent(rest.join("="));
    }
  }

  return null;
};

const setCookieValue = (name: string, value: string): void => {
  if (typeof document === "undefined") {
    return;
  }

  const expires = new Date();
  expires.setDate(expires.getDate() + COOKIE_EXPIRATION_DAYS);

  document.cookie = `${encodeURIComponent(name)}=${encodeURIComponent(
    value
  )}; expires=${expires.toUTCString()}; path=/; SameSite=Lax`;
};

const removeCookieValue = (name: string): void => {
  if (typeof document === "undefined") {
    return;
  }

  document.cookie = `${encodeURIComponent(name)}=; expires=${new Date(0).toUTCString()}; path=/; SameSite=Lax`;
};

const getItem = async (key: StorageKey): Promise<string | null> => {
  try {
    if (Platform.OS === "web") {
      return getCookieValue(key);
    }

    return await AsyncStorage.getItem(key);
  } catch (error) {
    console.warn(`Failed to retrieve ${key} from storage`, error);
    return null;
  }
};

const setItem = async (key: StorageKey, value: string): Promise<void> => {
  try {
    if (Platform.OS === "web") {
      setCookieValue(key, value);
      return;
    }

    await AsyncStorage.setItem(key, value);
  } catch (error) {
    console.warn(`Failed to persist ${key} to storage`, error);
  }
};

const removeItem = async (key: StorageKey): Promise<void> => {
  try {
    if (Platform.OS === "web") {
      removeCookieValue(key);
      return;
    }

    await AsyncStorage.removeItem(key);
  } catch (error) {
    console.warn(`Failed to remove ${key} from storage`, error);
  }
};

const parsePresetList = <T,>(raw: string | null): NamedPreset<T>[] => {
  if (!raw) {
    return [];
  }

  try {
    const parsed = JSON.parse(raw) as NamedPreset<T>[];
    if (Array.isArray(parsed)) {
      return parsed;
    }
  } catch (error) {
    console.warn("Unable to parse presets", error);
  }

  return [];
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

export const getSelectedShellWrapPresetName = async (): Promise<string | null> => {
  const name = await getItem(KEY_SELECTED_SHELL);
  return name ?? null;
};

export const saveSelectedShellWrapPresetName = async (
  name: string | null
): Promise<void> => {
  if (!name) {
    await removeItem(KEY_SELECTED_SHELL);
    return;
  }

  await setItem(KEY_SELECTED_SHELL, name);
};

export const getSelectedMachinePresetName = async (): Promise<string | null> => {
  const name = await getItem(KEY_SELECTED_MACHINE);
  return name ?? null;
};

export const saveSelectedMachinePresetName = async (
  name: string | null
): Promise<void> => {
  if (!name) {
    await removeItem(KEY_SELECTED_MACHINE);
    return;
  }

  await setItem(KEY_SELECTED_MACHINE, name);
};
