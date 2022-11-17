import type { Component } from "solid-js";
import { useNavigate } from "@solidjs/router";
//navbar
import Styles from "./navbar.module.scss";
import HomeIcon from "../../icons/Home.svg";
import AddToCalanderIcon from "../../icons/AddToCalander.svg";
import LogoutIcon from "../../icons/Logout.svg";

const Navbar: Component = () => {
  const navigate = useNavigate();
  return (
    <nav class={Styles.navbar}>
      <div class={Styles.Content}>
        <div class={Styles.left}>
          <a
            title="Terug naar uw agenda"
            onClick={() => {
              navigate("/agenda");
            }}
            class={Styles.left}
          >
            <img src={HomeIcon} alt="Home icon" />
          </a>
          <a
            title="Nieuw agendapunt"
            onClick={() => {
              navigate("/agenda/item");
            }}
            class={Styles.right}
          >
            <img src={AddToCalanderIcon} alt="Add to calander" />
          </a>
        </div>

        <div class={Styles.right}>
          <a
            title="Uitloggen"
            onClick={() => {
              navigate("/uitloggen");
            }}
          >
            <img src={LogoutIcon} alt="Uitloggen" />
          </a>
        </div>
      </div>
    </nav>
  );
};
export default Navbar;
