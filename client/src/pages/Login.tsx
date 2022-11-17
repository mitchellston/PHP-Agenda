import type { Component } from "solid-js";
import Styles from "./SCSS/Login.module.scss";

const App: Component = () => {
  return (
    <div class={Styles.ViewPort}>
      <div class={Styles.Form}>
        <div class={Styles.Content}>
          <h1>Login</h1>
          <hr class={Styles.Separator} />
          <div class={Styles.Input}>
            <p class={Styles.Label}>E-mailadres:</p>
            <input type="email" />
            <p class={Styles.Error}></p>
          </div>
          <div class={Styles.Input}>
            <p class={Styles.Label}>Password:</p>
            <input type="email" />
            <p class={Styles.Error}></p>
          </div>
          <hr class={Styles.Separator} />
          <div class={Styles.Login}>
            <button>Login</button>
          </div>
        </div>
      </div>
    </div>
  );
};
export default App;
