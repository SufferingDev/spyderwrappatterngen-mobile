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

export const COOKIE_EXPIRATION_DAYS = 3650; // ~10 years

export const KEY_SHELL_PRESETS = "shellWrapPresets";
export const KEY_MACHINE_PRESETS = "machinePresets";
export const KEY_SELECTED_SHELL = "selectedShellWrapPreset";
export const KEY_SELECTED_MACHINE = "selectedMachinePreset";

export type StorageKey =
  | typeof KEY_SHELL_PRESETS
  | typeof KEY_MACHINE_PRESETS
  | typeof KEY_SELECTED_SHELL
  | typeof KEY_SELECTED_MACHINE;

export const parsePresetList = <T,>(raw: string | null): NamedPreset<T>[] => {
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
