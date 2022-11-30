import type { Component } from "solid-js";
import Styles from "./SCSS/Agenda.module.scss";
import { createQuery } from "@tanstack/solid-query";
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
    Subject: string;
    Content: string;
    BeginDate: Date;
    EndDate: Date;
    Priority: number;
    Status: "n" | "b" | "a";
  }[];
};
const fetchAgendaItems = async (): Promise<response> => {
  try {
    const data: response = await (
      await axios.postForm(PRIMDIR + "/api/items/getItems.php")
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

  const query = createQuery<response>(() => ["agendaItems"], fetchAgendaItems, {
    onSuccess: (data) => {
      if (data.Success == false && data.error?.title == "NOT LOGGEDIN") {
        return navigate(PRIMDIR + "/");
      }
      console.log(data);
    },
  });
  return (
    <section>
      <NavBar />
      <div class={Styles.ViewPort}>
        <div class={Styles.Content}>
          <h1 class={Styles.Title}>Uw agenda</h1>
          <Switch>
            <Match when={query.isLoading}>
              <p style="text-align: center">Data aan het laden...</p>
            </Match>
            <Match when={query.isError}>
              <p style="text-align: center">
                Er ging iets fout probeer het later opnieuw...
              </p>
            </Match>
            <Match when={query.isSuccess}>
              <Switch>
                <Match when={query.data?.Success == false}>
                  <p style="text-align: center">{query.data?.error?.message}</p>
                </Match>
                <Match when={query.data?.Success == true}>
                  <table>
                    <thead>
                      <tr>
                        <th>Onderwerp</th>
                        <th>Inhoud</th>
                      </tr>
                    </thead>
                    <tbody>
                      <For each={query.data?.data}>
                        {(Item, i) => (
                          <tr
                            onClick={() => {
                              navigate(PRIMDIR + "/agenda/item/" + Item.ID);
                            }}
                          >
                            <th>{Item.Subject}</th>
                            <th>{Item.Content}</th>
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
