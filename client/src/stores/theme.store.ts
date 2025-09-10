import { create } from "zustand";
import { PreferThemeEnum, PreferThemeType } from "../types";

interface IThemeStore {
	theme: PreferThemeType;
	setTheme: (theme: PreferThemeType) => void;
	persistTheme: () => void;
}


export const useThemeStore = create<IThemeStore>((set, get) => ({
	theme: 'system',
	setTheme: (theme) => {
		localStorage.setItem('theme', theme);
		get().persistTheme();
	},
	persistTheme: () => {
		const preferredTheme = localStorage.getItem('theme') as PreferThemeType || PreferThemeEnum.SYSTEM;

		if (preferredTheme === PreferThemeEnum.DARK) {
			document.documentElement.classList.add("dark");
		} else if (preferredTheme === PreferThemeEnum.LIGHT) {
			document.documentElement.classList.remove("dark");
		} else {
			if (window.matchMedia("(prefers-color-scheme: dark").matches) {
				document.documentElement.classList.add("dark");
			} else {
				document.documentElement.classList.remove("dark");
			}
			window.matchMedia("(prefers-color-scheme: dark").addEventListener("change", (mediaQueryEvent) => {
				if (mediaQueryEvent.matches) {
					document.documentElement.classList.add("dark");
				} else {
					document.documentElement.classList.remove("dark");
				}
			});
		}
		set({ theme: preferredTheme });
	}
}));