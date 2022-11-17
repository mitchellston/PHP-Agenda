import type { Component } from "solid-js";
import { Routes, Route, useNavigate } from "@solidjs/router";
import { lazy } from "solid-js";

//import pages
const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));
const Agenda = lazy(() => import("./pages/Agenda"));
const NotFound = lazy(() => import("./pages/NotFound"));

const App: Component = () => {
  const nav = useNavigate();
  return (
    <div>
      <main>
        <Routes>
          <Route path="/" component={Login} />
          <Route path="/register" component={Register} />
          <Route path="/agenda" component={Agenda} />
          <Route path="/agenda/item" component={NotFound} />
          <Route path="/agenda/item/:id" component={NotFound} />
          <Route path="/*all" component={NotFound} />
        </Routes>
      </main>
    </div>
  );
};

export default App;
