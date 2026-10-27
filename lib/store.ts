'use client';
import { useSyncExternalStore } from 'react';

export type Quality = 'auto' | 'high' | 'low';

export type UIState = {
  entered: boolean;
  ready: boolean; // 3D canvas created
  sound: boolean;
  reduceMotion: boolean;
  cursor: boolean;
  quality: Quality;
  paletteOpen: boolean;
  chatOpen: boolean;
  settingsOpen: boolean;
  menuOpen: boolean;
  active: number; // active chapter index
  toast: string | null;
};

const SETTINGS_KEY = 'nr-portfolio-settings';

let state: UIState = {
  entered: false,
  ready: false,
  sound: false,
  reduceMotion: false,
  cursor: true,
  quality: 'auto',
  paletteOpen: false,
  chatOpen: false,
  settingsOpen: false,
  menuOpen: false,
  active: 0,
  toast: null,
};

const listeners = new Set<() => void>();

export function getState() {
  return state;
}

export function setState(patch: Partial<UIState>) {
  state = { ...state, ...patch };
  if ('sound' in patch || 'reduceMotion' in patch || 'cursor' in patch || 'quality' in patch) {
    try {
      localStorage.setItem(
        SETTINGS_KEY,
        JSON.stringify({ sound: state.sound, reduceMotion: state.reduceMotion, cursor: state.cursor, quality: state.quality }),
      );
    } catch {}
  }
  listeners.forEach((l) => l());
}

export function loadSettings() {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const coarse = window.matchMedia('(pointer: coarse)').matches;
    const saved = raw ? JSON.parse(raw) : {};
    state = {
      ...state,
      reduceMotion: saved.reduceMotion ?? prefersReduced,
      cursor: coarse ? false : saved.cursor ?? true,
      quality: saved.quality ?? 'auto',
    };
    listeners.forEach((l) => l());
  } catch {}
}

function subscribe(l: () => void) {
  listeners.add(l);
  return () => listeners.delete(l);
}

export function useStore<T>(selector: (s: UIState) => T): T {
  return useSyncExternalStore(subscribe, () => selector(state), () => selector(state));
}

let toastTimer: ReturnType<typeof setTimeout> | undefined;
export function toast(message: string) {
  setState({ toast: message });
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => setState({ toast: null }), 3200);
}

/** Non-reactive scroll state read every frame by the 3D world. */
export const scroll = {
  progress: 0, // 0 … chapters-1, fractional
  velocity: 0,
  local: new Map<string, number>(), // per-section 0…1 progress (for sticky chapters)
};
