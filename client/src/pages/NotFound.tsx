import type { Component } from "solid-js";
import Styles from "./SCSS/NotFound.module.scss";
const App: Component = () => {
  return (
    <div class={Styles.ViewPort}>
      <div class={Styles.Notification}>
        <div class={Styles.Message}>
          <h2>Deze pagina is niet beschikbaar!</h2>
        </div>
      </div>
    </div>
  );
};
export default App;
