import logo from "../assets/logo.png";
import "../styles/pages/login.scss";

function Login({ onLogin }) {
  const handleLogin = (provider) => {
    console.log(`Logging in with ${provider}`);
    // For demo purposes, all buttons just log the user in
    onLogin();
  };

  return (
    <main className="login">
      <img className="login__logo" src={logo} alt="Logo" />
      <h1 className="login__title">Headliner</h1>
      <p className="login__subtitle">Welcome! Let's dive into your account!</p>
      <section className="login__buttons-external">
        <button
          className="login__button-external login__button-external--google"
          onClick={() => handleLogin("Google")}>
          {/* <span className="login__button-icon"></span> */}
          Continue with Google
        </button>
        <button
          className="login__button-external login__button-external--github"
          onClick={() => handleLogin("GitHub")}>
          {/* <span className="login__button-icon"></span> */}
          Continue with GitHub
        </button>
      </section>

      <div className="login__separator">
        <span className="login__separator-text">or</span>
      </div>
      <button
        className="login__button-internal login__button-internal--email"
        onClick={() => handleLogin("Email")}>
        Sign in with email & password
      </button>
      <p className="login__signup-text">
        Don't have an account? <a href="#">Sign up</a>
      </p>
    </main>
  );
}

export default Login;
