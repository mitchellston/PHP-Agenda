import { Component, createSignal, Show } from "solid-js";
import Model from "./Model";
import Styles from "./DeleteModel.module.scss";
import axios from "axios";
import { PRIMDIR } from "../../../DIRECTORIES";
import { useNavigate } from "@solidjs/router";
type Props = {
  openModel: boolean;
  itemID: string;
  onClose: () => void;
};
const DeleteModel: Component<Props> = (props) => {
  const navigate = useNavigate();
  const [error, setError] = createSignal("");
  return (
    <Show when={props.openModel}>
      <Model
        title="Weet u zeker dat u dit agendapunt wilt verwijderen?"
        close={() => {
          props.onClose();
        }}
      >
        <p class={Styles.error}>{error}</p>
        <div class={Styles.ModelBodyRemove}>
          <button
            class={Styles.Accept}
            onclick={async () => {
              try {
                const deletedItemResult = await (
                  await axios.postForm(PRIMDIR + "/api/items/deleteItem.php", {
                    ID: props.itemID,
                  })
                ).data;
                if (deletedItemResult.Success == true) {
                  return navigate(PRIMDIR + "/agenda");
                }
                if (
                  deletedItemResult.Success == false &&
                  deletedItemResult.error?.title == "NOT LOGGEDIN"
                ) {
                  return navigate(PRIMDIR + "/");
                }
                setError(deletedItemResult.error?.message);
              } catch (err) {
                setError(
                  "Geen antwoord van de server probeer het later opnieuw!"
                );
              }
            }}
          >
            Ja
          </button>
          <button class={Styles.Decline} onclick={props.onClose}>
            Nee
          </button>
        </div>
      </Model>
    </Show>
  );
};
export default DeleteModel;
