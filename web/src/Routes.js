import React from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";

// importing all components
import Logon from "./pages/Logon";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import NewIncident from "./pages/Incident/New";
import EditIncident from "./pages/Incident/Edit";

function Routes() {
  return (
    // BrowserRouter is the main route component, it will always be outside everything
    <BrowserRouter>
      <Switch>
        <Route path="/" exact component={Logon} />
        <Route path="/register" component={Register} />
        <Route path="/profile" component={Profile} />
        <Route path="/incident/new" component={NewIncident} />
        <Route path="/incident/edit/:id" component={EditIncident} />
      </Switch>
    </BrowserRouter>
  );
}

// Exports routes
export default Routes;
