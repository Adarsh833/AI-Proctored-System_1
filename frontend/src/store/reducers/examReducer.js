// examReducer.js

import { LOG_TAB_SWITCH } from '../actions/examActions';

const initialState = {
  tabSwitchLogs: [],
};

const examReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOG_TAB_SWITCH:
      return {
        ...state,
        tabSwitchLogs: [...state.tabSwitchLogs, action.payload],
      };
    default:
      return state;
  }
};

export default examReducer;