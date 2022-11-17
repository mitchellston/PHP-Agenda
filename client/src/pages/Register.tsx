import type { Component } from "solid-js";
import { createSignal } from "solid-js";
import { createMutation } from "@tanstack/solid-query";
import Styles from "./SCSS/Login.module.scss";
import axios from "axios";
import { useNavigate } from "@solidjs/router";
type response = {
  Success: boolean;
  error?: {
    title: string;
    message: string;
  };
};
const registerMutation = async (): Promise<response> => {
  try {
    const data: response = await (await axios.post("")).data;
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

const App: Component = () => {
  const navigate = useNavigate();
  let email!: HTMLInputElement;
  let password!: HTMLInputElement;
  let confirmPassword!: HTMLInputElement;
  const [emailError, setEmailError] = createSignal("");
  const [passwordError, setPasswordError] = createSignal("");
  const [confirmPasswordError, setConfirmPasswordError] = createSignal("");
  const [generalError, setGeneralError] = createSignal("");

  const mutation = createMutation(["register"], registerMutation, {
    onSuccess: (data) => {
      if (data.Success == false && data.error?.message != null) {
        return setGeneralError(data.error.message);
      }
      sessionStorage.setItem("firstLogin", "true");
      return (location.href = "/agenda");
    },
  });
  const register = (event: any) => {
    event.preventDefault();
    setConfirmPasswordError("");
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
    if (confirmPassword.checkValidity() == false) {
      if (confirmPassword.validity.patternMismatch == true) {
        return setConfirmPasswordError(
          "Het password moet minimaal 1 kleine letter, 1 hoofdletter, 1 cijfer en 1 speciaal teken bevatten! (minimaal 7 tekens)"
        );
      }
      return setConfirmPasswordError(confirmPassword.validationMessage);
    }

    mutation.mutate();
  };

  return (
    <div class={Styles.ViewPort}>
      <div class={Styles.Form}>
        <div class={Styles.Content}>
          <form action="">
            <h1>Register</h1>
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
            <div class={Styles.Input}>
              <p class={Styles.Label}>Herhaal Password:</p>
              <input
                ref={confirmPassword}
                pattern="^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{0,}$"
                type="Password"
                minlength={7}
                maxlength="20"
                placeholder="Herhaal uw password"
                tabindex={3}
                required
              />
              <p class={Styles.Error}>{confirmPasswordError}</p>
            </div>

            <hr class={Styles.Separator} />
            <p class={Styles.Error}>{generalError}</p>
            <div class={Styles.Login}>
              <button type="submit" tabindex={4} onClick={register}>
                Login
              </button>
            </div>
            <div class={Styles.ChangePage}>
              <a
                tabindex={5}
                onClick={() => {
                  navigate("/");
                }}
              >
                Login
              </a>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
export default App;
