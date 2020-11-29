import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import Home from "./views/Home/home";
import Room from "./views/Room/room";



function App() {
  return (
    <Router>
      <div>
        <Switch>
          <Route path="/room/:id" component={Room}></Route>
          <Route path="/" component={Home}></Route>
        </Switch>
      </div>
    </Router>
  );
}

export default App;


