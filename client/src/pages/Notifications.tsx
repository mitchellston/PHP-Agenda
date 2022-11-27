import { Component, createSignal } from "solid-js";
import Styles from "./SCSS/Notifications.module.scss";
import { createMutation, createQuery } from "@tanstack/solid-query";
import { Switch, Match, For } from "solid-js";
import { useNavigate } from "@solidjs/router";
import axios from "axios";
import NavBar from "../Components/navbar/NavBar";
import { PRIMDIR } from "../../DIRECTORIES";
type response = {
  Success: boolean;
  error?: {
    title: string;
    message: string;
  };
  data?: {
    ID: number;
    Email: string;
    Seen: boolean;
    Message: string;
    Subject: string | null;
    BeginDate: string | null;
    EndDate: string | null;
    SendDate: string | null;
  }[];
};
type acceptInviteResponse = {
  Success: boolean;
  error?: {
    title: string;
    message: string;
  };
};
const fetchAgendaItems = async (): Promise<response> => {
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
  const [acceptError, setAcceptError] = createSignal("");
  const query = createQuery<response>(
    () => ["notifications"],
    fetchAgendaItems,
    {
      onSuccess: (data) => {
        if (data.Success == false && data.error?.title == "NOT LOGGEDIN") {
          navigate(PRIMDIR + "/");
        }
      },
    }
  );
  const acceptInvite = async (id: number) => {
    try {
      const data: acceptInviteResponse = await (
        await axios.post("", {
          ID: id,
        })
      ).data;
      if (data.Success == true) {
        return query.refetch();
      }
      if (data.error != null) {
        return setAcceptError(data.error?.message);
      }
      return query.refetch();
    } catch (err) {
      setAcceptError("Er is iets mis gegaan probeer het later opnieuw!");
    }
  };
  return (
    <section>
      <NavBar />
      <div class={Styles.ViewPort}>
        <div class={Styles.Content}>
          <h1 class={Styles.Title}>Uw notificaties</h1>
          <p style="text-align: center; color: red;">{acceptError}</p>
          <Switch>
            <Match when={query.isLoading}>
              <p style="text-align: center">Data aan het laden...</p>
            </Match>
            <Match when={query.isError}>
              <p style="text-align: center; color: red;">
                Er ging iets fout probeer het later opnieuw...
              </p>
            </Match>
            <Match when={query.isSuccess}>
              <Switch>
                <Match when={query.data?.Success == false && false}>
                  <p style="text-align: center; color: red;">
                    {query.data?.error?.message}
                  </p>
                </Match>
                <Match when={query.data?.Success == true || true}>
                  <table>
                    <thead>
                      <tr>
                        <th style={{ width: "75%", "max-width": "75%" }}>
                          Bericht
                        </th>
                        <th style={{ width: "5%", "max-width": "5%" }}>Van</th>
                        <th style={{ width: "15%", "max-width": "15%" }}>
                          Datum
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <For each={query.data?.data}>
                        {(Item, i) => (
                          <tr>
                            <Switch>
                              <Match when={Item.Subject != null}>
                                <th>
                                  {Item.Message} |{" "}
                                  <button
                                    onClick={async () => {
                                      acceptInvite(Item.ID);
                                    }}
                                  >
                                    accepteer
                                  </button>
                                </th>
                              </Match>
                              <Match when={Item.Subject == null}>
                                <th>{Item.Message}</th>
                              </Match>
                            </Switch>
                            <th>{Item.Email}</th>
                            <th>{Item.SendDate}</th>
                          </tr>
                        )}
                      </For>
                    </tbody>
                  </table>
                </Match>
              </Switch>
            </Match>
          </Switch>
        </div>
      </div>
    </section>
  );
};
export default App;
