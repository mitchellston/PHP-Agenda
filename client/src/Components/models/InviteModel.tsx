import { useNavigate } from "@solidjs/router";
import axios from "axios";
import { Component, createSignal, Show } from "solid-js";
import { PRIMDIR } from "../../../DIRECTORIES";
import Model from "./Model";
import Styles from "./InviteModel.module.scss";
type Props = {
  openModel: boolean;
  itemID: string;
  onClose: () => void;
};

const InviteModel: Component<Props> = (props) => {
  const navigate = useNavigate();
  const [error, setError] = createSignal("");
  const [success, setSuccess] = createSignal("");
  let inputEmail!: HTMLInputElement;
  let inputMessage!: HTMLTextAreaElement;
  return (
    <Show when={props.openModel}>
      <Model
        close={() => {
          props.onClose();
        }}
        title="Wie wilt u uitnodigen?"
      >
        <div class={Styles.ModelBodyInvite}>
          <p>*Het email van de ander:</p>
          <div class={Styles.center}>
            <input type="email" ref={inputEmail} required />
          </div>
          <p>Een bericht voor de ander:</p>
          <div class={Styles.center}>
            <textarea
              ref={inputMessage}
              maxLength={100}
              cols="30"
              rows="10"
            ></textarea>
          </div>

          <p style="text-align: center; color: red;">{error}</p>
          <p style="text-align: center; color: green;">{success}</p>
          <div class={Styles.center}>
            <button
              onclick={async () => {
                try {
                  setError("");
                  setSuccess("");
                  if (inputEmail.checkValidity() == false) {
                    return setError(inputEmail.validationMessage);
                  }
                  if (inputMessage.checkValidity() == false) {
                    return setError(inputMessage.validationMessage);
                  }
                  const data = await (
                    await axios.postForm(
                      PRIMDIR + "/api/notification/inviteToItem.php",
                      {
                        email: inputEmail.value,
                        item: props.itemID,
                        message: inputMessage.value,
                      }
                    )
                  ).data;
                  if (data.error?.title == "NOT LOGGEDIN") {
                    return navigate(PRIMDIR + "/");
                  }
                  if (data.Success == false) {
                    return setError(data.error?.message);
                  }
                  setSuccess(
                    "Een uitnodiging is gestuurd naar " + inputEmail.value + "!"
                  );
                } catch (err) {
                  return setError(
                    "Geen antwoord van de server probeer het later opnieuw!"
                  );
                }
              }}
            >
              Verzenden
            </button>
          </div>
        </div>
      </Model>
    </Show>
  );
};
export default InviteModel;
