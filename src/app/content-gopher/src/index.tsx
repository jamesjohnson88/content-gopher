/* @refresh reload */
import type { ParentComponent } from "solid-js";
import { render } from 'solid-js/web';
import { Route, Router } from "@solidjs/router"

import './index.css';
import Home from "./pages/Home";
import NewSession from "./pages/session/NewSession";
import BrowseSessions from "./pages/session/BrowseSessions";
import NotFound from "./pages/NotFound";
import Header from "./components/Header";
import MultipleChoiceQuestions from "./pages/content/MultipleChoiceQuestions";
import EditSession from "./pages/session/EditSession";


const App: ParentComponent = (props) => {
    return (
        <>
            <Header />
            {props.children}
        </>
    );
};

render(() =>
(
    <Router root={App}>
        <Route path="/" component={Home} />
        <Route path="/sessions">
            <Route path="/new" component={NewSession} />
            <Route path="/browse" component={BrowseSessions} />
            <Route path="/edit/*filename" component={EditSession} />
        </Route>
        <Route path="/content">
            <Route path="/multiple-choice-question" component={MultipleChoiceQuestions} />
        </Route>
        <Route path="*paramName" component={NotFound} />
    </Router>
), document.getElementById("root")!);