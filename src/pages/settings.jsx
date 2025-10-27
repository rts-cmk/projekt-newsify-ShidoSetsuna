import "../styles/pages/settings.scss";
import ThemeToggle from "../components/theme_toggle/theme_toggle";
import Toggle from "../components/toggle/toggle";
import { useSettingsStore } from "../store/settings_store";
import { NYT_SECTIONS } from "../constants/sections";

function Settings() {
  const { enabledCategories, toggleCategory } = useSettingsStore();

  const popularCategories = [
    { id: "popular-today", label: "Today" },
    { id: "popular-week", label: "This Week" },
    { id: "popular-month", label: "This Month" },
  ];

  return (
    <main className="settings">
      <h1 className="settings__title">Settings</h1>

      <section className="settings__section">
        <h2 className="settings__section-title">Home Categories</h2>
        <div className="settings__toggles">
          {NYT_SECTIONS.map(({ section, title }) => (
            <Toggle
              key={section}
              label={title}
              checked={enabledCategories[section] ?? true}
              onChange={() => toggleCategory(section)}
            />
          ))}
        </div>
      </section>

      <section className="settings__section">
        <h2 className="settings__section-title">Popular Categories</h2>
        <div className="settings__toggles">
          {popularCategories.map(({ id, label }) => (
            <Toggle
              key={id}
              label={label}
              checked={enabledCategories[id] ?? true}
              onChange={() => toggleCategory(id)}
            />
          ))}
        </div>
      </section>

      <section className="settings__section">
        <h2 className="settings__section-title">General</h2>
        <div className="settings__option">
          <ThemeToggle />
        </div>
      </section>
    </main>
  );
}

export default Settings;
