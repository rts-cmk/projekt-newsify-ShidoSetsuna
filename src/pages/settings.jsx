import "../styles/pages/settings.scss";
import ThemeToggle from "../components/theme_toggle/theme_toggle";

function Settings() {
  return (
    <main className="settings">
      <h1 className="settings__title">Settings</h1>
      <section className="settings__categories">
        <h2 className="settings__category-title">Categories</h2>
      </section>
      <section className="settings__general">
        <h2 className="settings__general-title">General</h2>
        <div className="settings__option">
          <ThemeToggle />
        </div>
      </section>
    </main>
  );
}

export default Settings;
