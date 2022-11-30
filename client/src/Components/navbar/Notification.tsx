import { useNavigate } from "@solidjs/router";
import { createQuery } from "@tanstack/solid-query";
import axios from "axios";
import { Component, createSignal } from "solid-js";
import { PRIMDIR } from "../../../DIRECTORIES";
import NotificationIcon from "../../icons/notification.svg";
import Styles from "./notification.module.scss";
type response = {
  Success: boolean;
  error?: {
    title: string;
    message: string;
  };
  data: number;
};
const Notification: Component = () => {
  const navigate = useNavigate();
  const [amountOfNotifications, setAmountOfNotifications] = createSignal(0);
  // fetch to get amount of notifications
  const query = createQuery<void>(
    () => ["amountOfNotificationsQuery"],
    async () => {
      try {
        const data: response = await (
          await axios.post(
            PRIMDIR + "/api/notification/notSeenNotifications.php"
          )
        ).data;
        if (data.Success == true) {
          setAmountOfNotifications(data.data);
          return;
        }
        setAmountOfNotifications(0);
      } catch (err) {
        setAmountOfNotifications(0);
      }
    }
  );
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
