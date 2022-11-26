import { Component, createSignal } from "solid-js";
import Styles from "./SCSS/Uitloggen.module.scss";
import { createMutation } from "@tanstack/solid-query";
import { useNavigate } from "@solidjs/router";
import axios from "axios";
type response = {
  Success: boolean;
  error?: {
    title: string;
    message: string;
  };
};
const logout = async (): Promise<response> => {
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
  const [error, setError] = createSignal("");
  const mutation = createMutation(["Logout"], logout, {
    onSuccess: (data) => {
      console.log(data);
      if (data.Success == false && data.error?.message != null) {
        return setError(data.error?.message);
      }
    },
  });
  const navigate = useNavigate();
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
              navigate("./agenda");
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
