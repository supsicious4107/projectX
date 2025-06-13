// src/Theme/defaultTheme.js
import { device } from "./breakpoints";

/**
 * Цвета, общие для light- и dark-режимов
 */
const defaultTheme = {
  /* <<< НОВОЕ --------------------------------------------------- */
  device,                //  <-- теперь theme.device.mobile / tablet / laptop
  /* ------------------------------------------------------------- */

  linecolor: { sideBorder: "#ccc" },

  color: {
    primary: "#0d6efd",
    hover:   "#6d28d1",
    muted:   "#7c7c7c",
  },
  background: {
    primary: "#f8f9fa",
    hover:   "#e9ecef",
    secondary: "#ffffff",
    hoverBtnColor: "#d63384",
    viewBtnColor:  "#d3d3d3",
  },
};

export default defaultTheme;