import type {
  MachinePresetData,
  NamedPreset,
  ShellWrapPresetData,
  StorageKey,
} from "./presetStorage.shared";
import {
  COOKIE_EXPIRATION_DAYS,
  KEY_MACHINE_PRESETS,
  KEY_SELECTED_MACHINE,
  KEY_SELECTED_SHELL,
  KEY_SHELL_PRESETS,
  parsePresetList,
} from "./presetStorage.shared";

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
    return getCookieValue(key);
  } catch (error) {
    console.warn(`Failed to retrieve ${key} from storage`, error);
    return null;
  }
};

const setItem = async (key: StorageKey, value: string): Promise<void> => {
  try {
    setCookieValue(key, value);
  } catch (error) {
    console.warn(`Failed to persist ${key} to storage`, error);
  }
};

const removeItem = async (key: StorageKey): Promise<void> => {
  try {
    removeCookieValue(key);
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
