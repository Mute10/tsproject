
import { useSettings, defaultSettings } from "./SettingsContext";



export default function SettingsPage() {
  const { settings, setSettings } = useSettings();

  return (
    <div className="p-4" style={{ padding: "20px" }}>
      <h1>Settings</h1>
      <p>Customize your workspace below:</p>

      {/* Dark Mode */}
      <div style={{ margin: "16px 0" }}>
        <label>
          <input
            type="checkbox"
            checked={settings.darkMode}
            onChange={(e) =>
              setSettings((prev) => ({ ...prev, darkMode: e.target.checked }))
            }
          />
          Enable Dark Mode
        </label>
      </div>

      {/* Debug Info */}
      <div style={{ margin: "16px 0" }}>
        <label>
          <input
            type="checkbox"
            checked={settings.debugEnabled}
            onChange={(e) =>
              setSettings((prev) => ({ ...prev, debugEnabled: e.target.checked }))
            }
          />
          Show Debug Info
        </label>
      </div>

     

      {/* Language */}
      <div style={{ margin: "16px 0" }}>
        <label>
          Language:{" "}
          <select
            value={settings.language}
            onChange={(e) =>
              setSettings((prev) => ({
                ...prev,
                language: e.target.value as "en" | "ja" | "pl",
              }))
            }
          >
            <option value="en">English</option>
            <option value="ja">日本語</option>
            <option value="pl">Polish</option>
          </select>
        </label>
      </div>

      
      {/* Restore Defaults */}
      <div style={{ margin: "16px 0" }}>
        <button className="btn" onClick={() => setSettings(defaultSettings)}>
          Restore Default
        </button>
      </div>
    </div>
  );
}
