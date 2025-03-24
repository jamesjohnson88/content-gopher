/* @refresh reload */
import type {ParentComponent} from "solid-js";
import { render } from 'solid-js/web';
import {A,Route, Router} from "@solidjs/router"

import './index.css';
import Home from "./pages/Home";
import NewSession from "./pages/session/NewSession";
import BrowseSessions from "./pages/session/BrowseSessions";
import NotFound from "./pages/NotFound";


const App: ParentComponent = (props) => {
    return (
        <>
            <h1 class="text-2xl font-bold underline">title</h1>
            <br />
            <A href="/">Home</A>
            <br/>
            <A href="/sessions/new">New Session</A>
            <br/>
            <A href="/sessions/browse">Browse Existing Sessions</A>
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
            </Route>
            <Route path="*paramName" component={NotFound} />
        </Router>
    ), document.getElementById("root")!);