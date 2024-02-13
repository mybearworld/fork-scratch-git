/** @file A lookup to create elements using scratch-gui classnames */

/** @type {string[]} */
const classNames = [...[...document.styleSheets].map((e) => e.cssRules)]
  .map((e) => Array.from(e))
  .flatMap((e) => e)
  .map((e) => e.selectorText)
  .filter((e) => e !== undefined)
  .map((e) => e.slice(1));

const select = (className) =>
  classNames.filter((e) => e.includes(className))[0];

/**
 * Accessors for parts of the UI
 * @enum
 */
const Cmp = {
  // menu
  MENU_CONTAINER: select("menu-bar_main-menu"),
  MENU_BAR: select("menu-bar_menu-bar"),
  MENU_POSITION: select("gui_menu-bar-position"),
  MENU_ITEM: select("menu-bar_menu-bar-item"),
  MENU_ITEM_ACTIVE: select("menu-bar_active").split(",")[0].split(".")[1],
  MENU_ACCOUNTINFOGROUP: select("menu-bar_account-info-group"),
  MENU_SECTION: select("menu_menu-section"),

  // alerts
  ALERT_CONTAINER: select("alerts_alerts-inner-container"),
  ALERT_DIALOG: select("alert_alert"),
  ALERT_SUCCESS: select("alert_success").split(".")[1],
  ALERT_MESSAGE: select("alert_alert-message"),
  ALERT_BUTTONS: select("alert_alert-buttons"),
  ALERT_CLOSE_CONTAINER: select("alert_alert-close-button-container"),
  ALERT_CLOSE_BUTTON: select("alert_alert-close-button"),

  // misc
  SAVE_STATUS: select("save-status_save-now"),
  BOX: select("box_box"),
  SETTINGS_BUTTON: select("settings-modal_button"),
  CLOSE_BUTTON: select("close-button_close-button"),
  CLOSE_BUTTON_LARGE: select("close-button_large").split(".")[1].split(":")[0],
  CLOSE_ICON: select("close-button_close-icon"),
  DISABLED_BUTTON: select("button_mod-disabled"),
};
window.Cmp = Cmp;
export default Cmp;