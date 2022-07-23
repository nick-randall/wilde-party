export const initDevSettings: DevSettings = {
  grid: {
    on: false,
    name: "Use Grid",
  },
  animationBuilder: {
    on: false,
    name: "Use Animation Builder",
  },
};
export const toggleDevSetting = (id: string): ToggleDevSetting => ({ type: "TOGGLE_DEV_SETTING", payload: id });
