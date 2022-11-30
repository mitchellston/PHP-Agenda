import { useNavigate, useParams } from "@solidjs/router";
import { createMutation, createQuery } from "@tanstack/solid-query";
import axios from "axios";
import { Component, createSignal, Match, Switch } from "solid-js";
import BackPage from "../icons/Calander.svg";
import CalanderConfirm from "../icons/CalanderConfirm.svg";
import NavBar from "../Components/navbar/NavBar";
import Styles from "./SCSS/Item.module.scss";
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
  const navigate = useNavigate();
  const [name, setName] = createSignal("");
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
  const createAgendaItem = async (): Promise<response> => {
    try {
      const data: response = await (
        await axios.postForm(PRIMDIR + "/api/items/addItem.php", {
          subject: subject.value,
          content: content.value,
          beginDate: beginDate.value,
          endDate: endDate.value,
          status: status.value,
          priority: priority.value,
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
    createAgendaItem,
    {
      onSuccess: (data) => {
        if (data.Success == false && data.error?.title == "NOT LOGGEDIN") {
          return navigate(PRIMDIR + "/");
        }
        if (data.Success == false && data.error?.message != null) {
          return setGeneralError(data.error?.message);
        }
        console.log(data);
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
        <form class={Styles.Content}>
          <button
            title="Terug"
            tabIndex={8}
            onClick={() => {
              navigate(PRIMDIR + "/agenda");
            }}
            class={Styles.BackPage}
          >
            <img src={BackPage} alt="Terug" />
          </button>
          <button
            title="Aanmaken"
            tabIndex={7}
            type="submit"
            onClick={createItem}
            class={Styles.Change}
          >
            <img src={CalanderConfirm} alt="Aanmaken" />
          </button>
          <h1 class={Styles.Title}>Nieuw kalenderitem - {name}</h1>
          <p class={Styles.Error}>{generalError}</p>
          <hr />
          <div class={Styles.Input}>
            <p class={Styles.Label}>*Onderwerp:</p>
            <input
              type="text"
              ref={subject}
              onInput={() => {
                setName(subject.value);
              }}
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
              value={getDate()}
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
              value={getDate(1)}
              required
            />
            <p class={Styles.Error}>{endDateError}</p>
          </div>
          <div class={Styles.Input}>
            <p class={Styles.Label}>*Status:</p>
            <select tabIndex={4} required ref={status}>
              <option value="n">Niet begonnen</option>
              <option value="b">Bezig</option>
              <option value="a">Afgerond</option>
            </select>
            <p class={Styles.Error}>{statusError}</p>
          </div>
          <div class={Styles.Input}>
            <p class={Styles.Label}>*Prioriteit:</p>
            <input
              tabIndex={5}
              type="number"
              placeholder="Prioriteit"
              min={1}
              max={5}
              value={1}
              ref={priority}
              required
            />
            <p class={Styles.Error}>{priorityError}</p>
          </div>
          <div class={Styles.Input}>
            <p class={Styles.Label}>Inhoud:</p>
            <textarea tabIndex={6} ref={content} placeholder="Inhoud" />
          </div>
        </form>
      </div>
    </section>
  );
};
export default App;
