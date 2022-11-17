import type { Component } from "solid-js";
//navbar
import Styles from "./navbar.module.scss";
import HomeIcon from "../../icons/Home.svg";
import AddToCalanderIcon from "../../icons/AddToCalander.svg";
import LogoutIcon from "../../icons/Logout.svg";

const Navbar: Component = () => {
  return (
    <nav class={Styles.navbar}>
      <div class={Styles.left}>
        <a href="/agenda" class={Styles.left}>
          <img src={HomeIcon} alt="Home icon" />
        </a>
        <a href="/agenda/item" class={Styles.right}>
          <img src={AddToCalanderIcon} alt="Add to calander" />
        </a>
      </div>
      <div class={Styles.middle}></div>
      <div class={Styles.right}>
        <a>
          <img src={LogoutIcon} alt="hover over this to see user info" />
        </a>
      </div>
    </nav>
  );
};
export default Navbar;
