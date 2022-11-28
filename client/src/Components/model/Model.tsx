import { Component } from "solid-js";
import Styles from "./model.module.scss";
type Props = {
  title: string;
  children?: any;
  close: () => void;
};

const Notification: Component<Props> = (props) => {
  //stop scrolling without hiding overflow
  return (
    <div
      class={Styles.Model}
      onClick={() => {
        //close model
        props.close();
      }}
    >
      <div
        class={Styles.ModelContent}
        onClick={(event: any) => {
          //stop event bubbling
          event.stopPropagation();
        }}
      >
        <div class={Styles.ModelHeader}>
          <h1 class={Styles.ModelTitle}>{props.title}</h1>
          <button
            class={Styles.ModelClose}
            onClick={() => {
              props.close();
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="rgb(0, 0, 0)"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="feather feather-x"
            >
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
        <div class={Styles.ModelBody}>{props.children}</div>
      </div>
    </div>
  );
};
export default Notification;
