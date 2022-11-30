import { useNavigate, useParams } from "@solidjs/router";
import { createMutation, createQuery } from "@tanstack/solid-query";
import axios from "axios";
import { Component, createSignal, Match, Switch } from "solid-js";
import BackPage from "../icons/CalanderStop.svg";
import CalanderConfirm from "../icons/CalanderConfirm.svg";
import NavBar from "../Components/navbar/NavBar";
import Styles from "./SCSS/Change.module.scss";
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
  };
};
type queryResponse = {
  Success: boolean;
  error?: {
    title: string;
    message: string;
  };
  data?: {
    ID: number;
    Subject: string;
    Content: string;
    BeginDate: string;
    EndDate: string;
    Priority: number;
    Status: "n" | "b" | "a";
  };
};
const getDate = (addDays?: number): string => {
  const date = new Date();
  date.setDate(date.getDate() + (addDays || 0));
  const year = date.getFullYear();
  const month: string =
    date.getMonth() + 1 < 10
      ? "0" + (date.getMonth() + 1)
      : (date.getMonth() + 1).toString();
  const day: string =
    date.getDate() + 1 < 10 ? "0" + date.getDate() : date.getDate().toString();
  return `${year}-${month}-${day}`;
};
const App: Component = () => {
  const params = useParams();
  const navigate = useNavigate();
  const fetchAgendaItem = async (): Promise<queryResponse> => {
    try {
      const data: queryResponse = await (
        await axios.postForm(PRIMDIR + "/api/items/getItems.php", {
          ID: params.id,
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
  const query = createQuery<queryResponse>(() => ["getItem"], fetchAgendaItem, {
    onSuccess: (data) => {
      if (data.Success == false && data.error?.title == "NOT LOGGEDIN") {
        navigate(PRIMDIR + "/");
      }
      console.log(data);
    },
  });
  let subject!: HTMLInputElement;
  const [subjectError, setSubjectError] = createSignal("");
  let beginDate!: HTMLInputElement;
  const [beginDateError, setBeginDateError] = createSignal("");
  let endDate!: HTMLInputElement;
  const [endDateError, setEndDateError] = createSignal("");
  let status!: HTMLSelectElement;
  const [statusError, setStatusError] = createSignal("");
  let priority!: HTMLInputElement;
  const [priorityError, setPriorityError] = createSignal("");
  let content!: HTMLTextAreaElement;

  const [generalError, setGeneralError] = createSignal("");
  const changeAgendaItem = async (): Promise<response> => {
    try {
      const data: response = await (
        await axios.postForm(PRIMDIR + "/api/items/changeItem.php", {
          ID: params.id,
          subject: subject.value,
          beginDate: beginDate.value,
          endDate: endDate.value,
          status: status.value,
          priority: priority.value,
          content: content.value,
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
  const mutation = createMutation<response>(
    ["createAgendaItem"],
    changeAgendaItem,
    {
      onSuccess: (data) => {
        if (data.Success == false && data.error?.title == "NOT LOGGEDIN") {
          return navigate(PRIMDIR + "/");
        }
        if (data.Success == false && data.error?.message != null) {
          return setGeneralError(data.error?.message);
        }
        navigate(PRIMDIR + "/agenda");
      },
    }
  );
  const createItem = (event: any) => {
    event.preventDefault();
    setBeginDateError("");
    setEndDateError("");
    setGeneralError("");
    setPriorityError("");
    setStatusError("");
    setSubjectError("");
    if (subject.checkValidity() == false) {
      return setSubjectError(subject.validationMessage);
    }
    if (beginDate.checkValidity() == false) {
      return setBeginDateError(beginDate.validationMessage);
    }
    if (endDate.checkValidity() == false) {
      return setEndDateError(endDate.validationMessage);
    }
    if (status.checkValidity() == false) {
      return setStatusError(status.validationMessage);
    }
    if (priority.checkValidity() == false) {
      return setPriorityError(priority.validationMessage);
    }
    mutation.mutate();
  };
  return (
    <section>
      <NavBar />
      <div class={Styles.ViewPort}>
        <div class={Styles.Content}>
          <button
            title="Terug"
            tabIndex={8}
            onClick={() => {
              navigate(PRIMDIR + "/agenda/item/" + params.id);
            }}
            class={Styles.BackPage}
          >
            <img src={BackPage} />
          </button>
          <button
            title="Aanpassen"
            tabIndex={7}
            type="submit"
            onClick={createItem}
            class={Styles.Change}
          >
            <img src={CalanderConfirm} alt="Aanpassen" />
          </button>
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
                  <form>
                    <h1 class={Styles.Title}>
                      Uw bent kalenderitem {query.data?.data?.Subject} aan het
                      aanpassen!
                    </h1>
                    <p class={Styles.Error}>{generalError}</p>
                    <hr />
                    <div class={Styles.Input}>
                      <p class={Styles.Label}>*Onderwerp:</p>
                      <input
                        type="text"
                        ref={subject}
                        value={query.data?.data?.Subject}
                        tabIndex={1}
                        maxLength={30}
                        placeholder="Onderwerp"
                        required
                      />
                      <p class={Styles.Error}>{subjectError}</p>
                    </div>
                    <div class={Styles.Input}>
                      <p class={Styles.Label}>*Begin datum:</p>
                      <input
                        type="date"
                        placeholder="Begin datum"
                        ref={beginDate}
                        tabIndex={2}
                        value={query.data?.data?.BeginDate}
                        required
                      />
                      <p class={Styles.Error}>{beginDateError}</p>
                    </div>
                    <div class={Styles.Input}>
                      <p class={Styles.Label}>*Eind datum:</p>
                      <input
                        type="date"
                        placeholder="Eind datum"
                        ref={endDate}
                        tabIndex={3}
                        min={beginDate.value}
                        value={query.data?.data?.EndDate}
                        required
                      />
                      <p class={Styles.Error}>{endDateError}</p>
                    </div>
                    <div class={Styles.Input}>
                      <p class={Styles.Label}>*Status:</p>
                      <select tabIndex={4} required ref={status}>
                        <Switch>
                          <Match when={query.data?.data?.Status == "n"}>
                            <option value="n" selected>
                              Niet begonnen
                            </option>
                            <option value="b">Bezig</option>
                            <option value="a">Afgerond</option>
                          </Match>
                          <Match when={query.data?.data?.Status == "b"}>
                            <option value="n">Niet begonnen</option>
                            <option value="b" selected>
                              Bezig
                            </option>
                            <option value="a">Afgerond</option>
                          </Match>
                          <Match when={query.data?.data?.Status == "a"}>
                            <option value="n">Niet begonnen</option>
                            <option value="b">Bezig</option>
                            <option value="a" selected>
                              Afgerond
                            </option>
                          </Match>
                        </Switch>
                      </select>
                      <p class={Styles.Error}>{statusError}</p>
                    </div>
                    <div class={Styles.Input}>
                      <p class={Styles.Label}>*Prioriteit:</p>
                      <input
                        tabIndex={5}
                        type="number"
                        placeholder="Prioriteit"
                        value={query.data?.data?.Priority}
                        min={1}
                        max={5}
                        ref={priority}
                        required
                      />
                      <p class={Styles.Error}>{priorityError}</p>
                    </div>
                    <div class={Styles.Input}>
                      <p class={Styles.Label}>Inhoud:</p>
                      <textarea
                        tabIndex={6}
                        ref={content}
                        placeholder="Inhoud"
                        value={query.data?.data?.Content}
                      />
                    </div>
                  </form>
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
