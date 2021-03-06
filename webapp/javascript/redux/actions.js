import {
  SET_DATE_RANGE,
  SET_FROM,
  SET_UNTIL,
  SET_MAX_NODES,
  SET_LABELS,
  ADD_LABEL,
  REMOVE_LABEL,
  REFRESH,
  REQUEST_JSON,
  RECEIVE_JSON,
  REQUEST_NAMES,
  RECEIVE_NAMES,
} from "./actionTypes";

export const setDateRange = (from, until) => {
  return { type: SET_DATE_RANGE, payload: { from, until } };
};

export const setFrom = (from) => {
  return { type: SET_FROM, payload: { from } }
};

export const setUntil = (until) => {
  return { type: SET_UNTIL, payload: { until } }
};

export const setMaxNodes = (maxNodes) => {
  return { type: SET_MAX_NODES, payload: { maxNodes } }
};

export const setLabels = (labels) => {
  return { type: SET_LABELS, payload: { labels } }
};

export const addLabel = (name, value) => {
  return { type: ADD_LABEL, payload:  { name, value } };
};

export const removeLabel = (name) => {
  return { type: REMOVE_LABEL, payload: { name } }
};

export const refresh = (url) => {
  return { type: REFRESH, payload: { url } }
};

export const requestJSON = (url) => {
  return { type: REQUEST_JSON, payload: { url } }
};

export const receiveJSON = (data) => {
  return { type: RECEIVE_JSON, payload: data }
};

export const requestNames = () => {
  return { type: REQUEST_NAMES, payload: {} }
};

export const receiveNames = (names) => {
  return { type: RECEIVE_NAMES, payload: { names } }
};


let currentJSONController;
export function fetchJSON(url) {
  return dispatch => {
    if (currentJSONController) {
      currentJSONController.abort();
    }
    currentJSONController = new AbortController();

    dispatch(requestJSON(url));
    return fetch(url + '&format=json', { signal: currentJSONController.signal })
      .then((response) => {
        return response.json()
      })
      .then((data) => {
        dispatch(receiveJSON(data));
      })
      .finally();
  }
}

let currentNamesController;
export function fetchNames() {
  return dispatch => {
    if (currentNamesController) {
      currentNamesController.abort();
    }
    currentNamesController = new AbortController();

    dispatch(requestNames());
    return fetch("/label-values?label=__name__", { signal: currentNamesController.signal })
      .then((response) => {
        return response.json()
      })
      .then((data) => {
        dispatch(receiveNames(data));
      })
      .finally()
  }
}
