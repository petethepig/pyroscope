import thunkMiddleware from 'redux-thunk';
import promiseMiddleware from 'redux-promise';

import { createStore, compose, applyMiddleware } from "redux";
import persistState from 'redux-localstorage'
import updateUrl from "./enhancers/updateUrl";
import { composeWithDevTools } from 'redux-devtools-extension';

import ReduxQuerySync from 'redux-query-sync'

import rootReducer from "./reducers";
import { setFrom, setUntil, setLabels, setMaxNodes } from "./actions";

import { parseLabels, encodeLabels } from "../util/key.js";



const enhancer = composeWithDevTools(
  applyMiddleware(thunkMiddleware, promiseMiddleware),
  // updateUrl(["from", "until", "labels"]),
  // persistState(["from", "until", "labels"]),
)

const store = createStore(rootReducer, enhancer);

ReduxQuerySync({
  store, // your Redux store
  params: {
    from: {
      defaultValue: "now-1h",
      selector: state => {
        return state.from;
      },
      action: setFrom,
    },
    until: {
      defaultValue: "now",
      selector: state => {
        return state.until;
      },
      action: setUntil,
    },
    name: {
      defaultValue: "pyroscope.server.cpu{}",
      selector: state => {
        return encodeLabels(state.labels);
      },
      action: (v) => {
        return setLabels(parseLabels(v));
      },
    },
    maxNodes: {
      defaultValue: "1024",
      selector: state => {
        return state.maxNodes;
      },
      action: setMaxNodes,
    },
  },
  initialTruth: 'location',
  replaceState: false,
})

export default store;
