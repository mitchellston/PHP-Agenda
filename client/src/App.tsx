import type { Component } from "solid-js";
import { Routes, Route, useNavigate } from "@solidjs/router";
import { lazy } from "solid-js";

//import pages
const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));
const Uitloggen = lazy(() => import("./pages/Logout"));
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
          <Route path="/" component={Login} />
          <Route path="/register" component={Register} />
          <Route path="/uitloggen" component={Uitloggen} />
          <Route path="/agenda" component={Agenda} />
          <Route path="/agenda/item" component={Item} />
          <Route path="/agenda/item/:id" component={Detail} />
          <Route path="/agenda/item/:id/aanpassen" component={Change} />
          <Route path="/*all" component={NotFound} />
        </Routes>
      </main>
    </div>
  );
};

export default App;
