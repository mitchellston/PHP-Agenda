import type { Component } from "solid-js";
import { Routes, Route, useNavigate } from "@solidjs/router";
import { lazy } from "solid-js";
import { PRIMDIR } from "../DIRECTORIES";
//import pages
const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));
const Uitloggen = lazy(() => import("./pages/Logout"));
const Notifications = lazy(() => import("./pages/Notifications"));
const Agenda = lazy(() => import("./pages/Agenda"));
const Item = lazy(() => import("./pages/Item"));
const Detail = lazy(() => import("./pages/Detail"));
const Change = lazy(() => import("./pages/Change"));
const NotFound = lazy(() => import("./pages/NotFound"));

const App: Component = () => {
  const nav = useNavigate();
  return (
    <div>
      <main>
        <Routes>
          <Route path={PRIMDIR} component={Login} />
          <Route path={PRIMDIR + "/login"} component={Login} />
          <Route path={PRIMDIR + "/index.html"} component={Login} />
          <Route path={PRIMDIR + "/register"} component={Register} />
          <Route path={PRIMDIR + "/uitloggen"} component={Uitloggen} />
          <Route path={PRIMDIR + "/notifications"} component={Notifications} />
          <Route path={PRIMDIR + "/agenda"} component={Agenda} />
          <Route path={PRIMDIR + "/agenda/item"} component={Item} />
          <Route path={PRIMDIR + "/agenda/item/:id"} component={Detail} />
          <Route
            path={PRIMDIR + "/agenda/item/:id/aanpassen"}
            component={Change}
          />
          <Route
            path={PRIMDIR + "/agenda/item/:id/invite"}
            component={Change}
          />
          <Route path={PRIMDIR + "/*all"} component={NotFound} />
        </Routes>
      </main>
    </div>
  );
};

export default App;
