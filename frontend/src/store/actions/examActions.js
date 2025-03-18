// examActions.js

// Action Types
export const LOG_TAB_SWITCH = 'LOG_TAB_SWITCH';

// Action Creators
export const logTabSwitch = () => {
  return {
    type: LOG_TAB_SWITCH,
    payload: {
      timestamp: new Date().toISOString(),
      message: 'Tab switch detected',
    },
  };
};