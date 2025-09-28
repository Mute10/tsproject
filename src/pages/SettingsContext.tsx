
import { createContext, useContext, useState, useEffect } from "react";
import type {ReactNode} from "react";
import type {SupportedLanguage} from "../i18n";


export type Settings = {
    darkMode: boolean;
    debugEnabled: boolean;
    compactView: boolean;
    language: SupportedLanguage;
   
}

/* eslint-disable react-refresh/only-export-components */
 export const defaultSettings: Settings = {
    darkMode: false,
    debugEnabled: true,
    compactView: false,
    language: "en",
   
}

type SettingsContextType = {
    settings: Settings;
    setSettings: React.Dispatch<React.SetStateAction<Settings>>;
    resetSettings: () => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);
export function SettingsProvider({children} : {children: ReactNode}) {
    const [settings, setSettings] = useState<Settings>(() => {
        const stored = localStorage.getItem("settings")
        return stored ? JSON.parse(stored) : defaultSettings
    })
    useEffect(() => {
        localStorage.setItem("settings", JSON.stringify(settings));
    }, [settings])

    const resetSettings = () => setSettings(defaultSettings);
    

    return (
        <SettingsContext.Provider value={{settings, setSettings, resetSettings}}>
            {children}
        </SettingsContext.Provider>
    )
}

/* eslint-disable react-refresh/only-export-components */
export function useSettings(): SettingsContextType {
    const ctx = useContext(SettingsContext)
    if (!ctx) {
        throw new Error("useSettings must be within a SettingsProvider")
    }
        return ctx
} 