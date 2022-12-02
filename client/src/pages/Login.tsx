import { Component, createSignal } from "solid-js";
import { useNavigate } from "@solidjs/router";
import Styles from "./SCSS/Login.module.scss";
import { createMutation } from "@tanstack/solid-query";
import axios from "axios";
import { PRIMDIR } from "../../DIRECTORIES";
type response = {
  Success: boolean;
  error?: {
    title: string;
    message: string;
  };
};

const App: Component = () => {
  const navigate = useNavigate();
  let email!: HTMLInputElement;
  let password!: HTMLInputElement;
  const [emailError, setEmailError] = createSignal("");
  const [passwordError, setPasswordError] = createSignal("");
  const [generalError, setGeneralError] = createSignal("");
  const login = async (): Promise<response> => {
    try {
      const data: response = await (
        await axios.postForm(PRIMDIR + "/api/auth/login.php", {
          email: email.value,
          password: password.value,
        })
      ).data;
      return data;
    } catch (err) {
      return {
        Success: false,
        error: {
          title: "FETCH FAILED",
          message: "Geen antwoord van de server probeer het later opnieuw!",
        },
      };
    }
  };
  const mutation = createMutation(["Login"], login, {
    onSuccess: (data) => {
      if (data.Success == false && data.error?.message != null) {
        return setGeneralError(data.error.message);
      }
      return navigate(PRIMDIR + "/agenda");
    },
  });
  const loginButton = (event: any) => {
    event.preventDefault();

    setEmailError("");
    setPasswordError("");
    setGeneralError("");
    if (email.checkValidity() == false) {
      return setEmailError(email.validationMessage);
    }
    if (password.checkValidity() == false) {
      if (password.validity.patternMismatch == true) {
        return setPasswordError(
          "Het password moet minimaal 1 kleine letter, 1 hoofdletter, 1 cijfer en 1 speciaal teken bevatten! (minimaal 7 tekens)"
        );
      }
      return setPasswordError(password.validationMessage);
    }
    mutation.mutate();
  };
  return (
    <div class={Styles.ViewPort}>
      <div class={Styles.Form}>
        <form class={Styles.Content}>
          <h1>Login</h1>
          <hr class={Styles.Separator} />
          <div class={Styles.Input}>
            <p class={Styles.Label}>E-mailadres:</p>
            <input
              type="email"
              ref={email}
              placeholder="Uw e-mailadres"
              tabindex={1}
              required
            />
            <p class={Styles.Error}>{emailError}</p>
          </div>
          <div class={Styles.Input}>
            <p class={Styles.Label}>Password:</p>
            <input
              pattern="^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{0,}$"
              type="Password"
              minlength="7"
              maxlength="20"
              placeholder="Uw password"
              ref={password}
              tabindex={2}
              required
            />
            <p class={Styles.Error}>{passwordError}</p>
          </div>
          <hr class={Styles.Separator} />
          <p class={Styles.Error}>{generalError}</p>
          <div class={Styles.Login}>
            <button onClick={loginButton} tabIndex={3}>
              Login
            </button>
          </div>
          <div class={Styles.ChangePage}>
            <a
              tabIndex={4}
              onClick={() => {
                navigate(PRIMDIR + "/register");
              }}
            >
              Registreer
            </a>
          </div>
        </form>
      </div>
    </div>
  );
};
export default App;
