// src/Components/ToastModal/ToastModal.styled.js
import styled from "styled-components";
import Toast  from "react-bootstrap/Toast";

/*
  ─────────────────────────────────────────────────────────────
  •  Desktop (≥ 768 px)
      – позиционируемся «под» колокольчиком, поэтому
        top: calc(100% + 8px)   — сразу под нижней кромкой header-бара
        right: 60px             — то же горизонтальное выравнивание, что и раньше
      – transform убрали, чтобы не смещать элемент

  •  Mobile (< 768 px)
      – остаёмся фиксированными под navbar, по центру
  ─────────────────────────────────────────────────────────────
*/
export const ToastContainer = styled(Toast)`
    /* ─── десктоп ─── */
    position: absolute;
    top: 65px;     /* ниже колокольчика на 8 px */
    right: 210px;
    z-index: 1080;

    /* ─── мобильная адаптация ─── */
    @media (max-width: 767.98px) {
        position: fixed;
        top: 16px;               /* под navbar */
        left: 50%;
        right: auto;
        transform: translateX(-50%);
        width: calc(100% - 32px);
        max-width: 420px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,.25);
    }

    .toast-header .btn-close:focus {
        box-shadow: none !important;
    }
`;
