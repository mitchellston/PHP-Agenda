import { useNavigate, useParams } from "@solidjs/router";
import { createQuery } from "@tanstack/solid-query";
import axios from "axios";
import { Component, Match, Switch } from "solid-js";
import BackPage from "../icons/Calander.svg";
import Bin from "../icons/Bin.svg";
import ChangeItem from "../icons/Change.svg";
import NavBar from "../Components/navbar/NavBar";
import Styles from "./SCSS/Detail.module.scss";
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
  };
};

const App: Component = () => {
  const navigate = useNavigate();
  const params = useParams();
  const id = params.id;
  const fetchAgendaItem = async (): Promise<response> => {
    try {
      const data: response = await (
        await axios.post("", {
          id,
        })
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
  const query = createQuery<response>(() => ["getItem"], fetchAgendaItem, {
    onSuccess: (data) => {
      if (data.Success == false && data.error?.title == "NOT LOGGEDIN") {
        navigate("/");
      }
    },
  });

  return (
    <section>
      <NavBar />
      <div class={Styles.ViewPort}>
        <div class={Styles.Content}>
          <div
            title="Terug"
            onClick={() => {
              navigate("/agenda");
            }}
            class={Styles.BackPage}
          >
            <img src={BackPage} alt="Terug" />
          </div>
          <div
            title="Verwijderen"
            onClick={() => {
              navigate("/agenda");
            }}
            class={Styles.Bin}
          >
            <img src={Bin} alt="Verwijder" />
          </div>
          <div
            title="Aanpassen"
            onClick={() => {
              navigate("/agenda/item/" + params.id + "/aanpassen");
            }}
            class={Styles.Change}
          >
            <img src={ChangeItem} alt="Aanpassen" />
          </div>
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
                <Match when={query.data?.Success == false && false}>
                  <p style="text-align: center">{query.data?.error?.message}</p>
                </Match>
                <Match when={query.data?.Success == true || true}>
                  <h1 class={Styles.Title}>
                    {query.data?.data?.Subject} -{" "}
                    <Switch>
                      <Match when={query.data?.data?.Status == "n"}>
                        Niet begonnen
                      </Match>
                      <Match when={query.data?.data?.Status == "b"}>
                        Bezig
                      </Match>
                      <Match when={query.data?.data?.Status == "a"}>
                        Afgerond
                      </Match>
                    </Switch>
                  </h1>
                  <hr />
                  <div class={Styles.Date}>
                    <h3 class={Styles.FancyText}>
                      {query.data?.data?.BeginDate.toDateString()}
                    </h3>
                    <h3 class={Styles.FancyText} style="text-align: right">
                      {query.data?.data?.EndDate.toDateString()}
                    </h3>
                  </div>
                  <p class={Styles.Priority}>
                    Prioriteit: {query.data?.data?.Priority}
                  </p>
                  <p>{query.data?.data?.Content}</p>
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
