// src/GlobalStyle.js
import { createGlobalStyle } from "styled-components";

/**
 * Глобальные правила, подключаются один раз в корне приложения
 */
export const GlobalStyle = createGlobalStyle`
  /* базовый reset + box-sizing */
  *, *::before, *::after {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  /* fluid-type: от 14 px на мобилке до 18 px на десктопе */
  html {
    font-size: clamp(14px, 2vw, 18px);
  }

  /* медиа-контент не вылезает за контейнер */
  img,
  svg,
  video {
    max-width: 100%;
    height: auto;
  }
  html, body {
      max-width: 100%;
      overflow-x: hidden;
      box-sizing: border-box;   /* чтобы padding не расширял 100 %-ширину */
  }
`;
