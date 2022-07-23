type DevSettings = {
  [id: string]: {
    on: boolean;
    name: string;
  };
};

// type DevSettings = {
//   [name: string]: Setting;
// };
type ToggleDevSetting = { type: "TOGGLE_DEV_SETTING"; payload: string };
