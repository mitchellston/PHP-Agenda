import { Component, createSignal } from "solid-js";
import Styles from "./SCSS/Uitloggen.module.scss";
import { createMutation } from "@tanstack/solid-query";
import { useNavigate } from "@solidjs/router";
import axios from "axios";
import { PRIMDIR } from "../../DIRECTORIES";
type response = {
  Success: boolean;
  error?: {
    title: string;
    message: string;
  };
};
const logout = async (): Promise<response> => {
  try {
    const data: response = await (
      await axios.postForm(PRIMDIR + "/api/auth/logout.php")
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
const App: Component = () => {
  const navigate = useNavigate();
  const [error, setError] = createSignal("");
  const mutation = createMutation(["Logout"], logout, {
    onSuccess: (data) => {
      if (data.Success == false && data.error?.message != null) {
        return setError(data.error?.message);
      }
      navigate(PRIMDIR + "/login");
    },
  });
  return (
    <div class={Styles.ViewPort}>
      <div class={Styles.Content}>
        <h1>Weet u zeker dat u wilt uitloggen?</h1>
        <hr />
        <p class={Styles.Error}>{error}</p>
        <div class={Styles.Buttons}>
          <button
            class={Styles.Left}
            onClick={() => {
              mutation.mutate();
            }}
          >
            Ja
          </button>
          <button
            class={Styles.Right}
            onClick={() => {
              navigate(PRIMDIR + "/agenda");
            }}
          >
            Nee
          </button>
        </div>
      </div>
    </div>
  );
};
export default App;
