import { useNavigate } from "@solidjs/router";
import { Component, createSignal } from "solid-js";
import { PRIMDIR } from "../../../DIRECTORIES";
import NotificationIcon from "../../icons/notification.svg";
import Styles from "./notification.module.scss";
const Notification: Component = () => {
  const navigate = useNavigate();
  const [amountOfNotifications, setAmountOfNotifications] = createSignal(0);
  // fetch to get amount of notifications

  return (
    <a
      title={"U heeft " + amountOfNotifications() + " notificaties"}
      onClick={() => {
        navigate(PRIMDIR + "/notifications");
      }}
    >
      <div class={Styles.Box}>
        <div class={Styles.AmountBox}>{amountOfNotifications}</div>
        <img
          src={NotificationIcon}
          alt={"U heeft " + amountOfNotifications() + " notificaties"}
        />
      </div>
    </a>
  );
};
export default Notification;
