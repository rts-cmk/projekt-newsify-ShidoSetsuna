import "./toggle.scss";

function Toggle({ label, checked, onChange }) {
  return (
    <label className="toggle">
      <span className="toggle__label">{label}</span>
      <div className="toggle__switch">
        <input
          type="checkbox"
          className="toggle__input"
          checked={checked}
          onChange={onChange}
        />
        <span className="toggle__slider"></span>
      </div>
    </label>
  );
}

export default Toggle;
