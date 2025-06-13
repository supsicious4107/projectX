import styled        from "styled-components";
import Offcanvas     from "react-bootstrap/Offcanvas";
import Button        from "react-bootstrap/Button";
import ProgressBar   from "react-bootstrap/ProgressBar";

const SIDEBAR_WIDTH = "270px";

/* ───────── mobile-burger ───────── */
export const ToolsButton = styled.button`
    position: fixed;
    top: 12px;
    right: 12px;
    width: 40px;
    height: 40px;
    padding: 0;
    border: none;
    background: transparent;
    color: #9a9a9a;
    z-index: 2000;

    display: flex;
    align-items: center;
    justify-content: center;

    svg path { stroke: currentColor; }

    @media (min-width: 992px) { display: none; }
`;

/* ───────── desktop-sidebar ───────── */
export const AsideSidebar = styled.aside.attrs({ "data-right-sidebar": "" })`
    width: ${SIDEBAR_WIDTH};
    flex: 0 0 ${SIDEBAR_WIDTH};
    min-height: 100vh;
    position: sticky;
    top: 0;

    display: none;                 /* скрыт на мобилке */

    @media (min-width: 992px) {    /* показываем на десктопе */
        display: flex;
        flex-direction: column;
        margin-left: auto;           /* прижимаем вправо */
    }

    background: ${({ theme }) => theme.background.primary};
    border-left: 1px solid ${({ theme }) => theme.linecolor.sideBorder};
`;

/* …верх оставляем без изменений… */

export const OffcanvasMobile = styled(Offcanvas)`
    background: ${({ theme }) => theme.background.primary};
    color:      ${({ theme }) => theme.color.primary};
    width: ${SIDEBAR_WIDTH}!important;
    height: 100vh;
    top: 0!important;
    padding-top: 56px;

    @media (min-width: 992px) { display: none; }

    /* ← больше «воздуха» по бокам */
    .offcanvas-body{
        overflow-y: auto;
        padding: 0 20px;            /* ⬆ было 12px, стало 20px */
    }
`;

/* ——— для стационарной (desktop) панели даём такой же внутренний отступ ——— */
export const DesktopBody = styled.div`
  flex: 1 1 auto;
  display: flex;
  flex-direction: column;
  padding: 0 20px;              /* тот же 20-px отступ */
`;


/* ───────── header ───────── */
export const Header = styled(Offcanvas.Header)`
    flex-direction: column;
    padding: 16px 1.25rem 1rem;
    position: relative;

    .btn-close{
        position: absolute;
        top: -30px;
        left: 12px;
        width: 16px;
        height: 16px;
        margin: 0;
        padding: 0;
        opacity: 1;
        filter: none;
        background-size: 100% 100%;
        background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3E%3Cpath stroke='%23ff3b30' stroke-width='2' stroke-linecap='round' d='M2 2l12 12M14 2L2 14'/%3E%3C/svg%3E");

        @media (min-width: 992px){ display:none; }
    }
`;

/* ───────── user-block ───────── */
export const UserBlock  = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-bottom: .5rem;
`;
export const UserLabel = styled.div`
    margin-bottom: .25rem;
    font-weight: 600;
    text-align: center;
`;
export const ProfileBtn = styled(Button)`
    width: 80%;
    height: 34px;
    border: none;
    font-size: 14px;
    font-weight: bold;
    background: ${({ theme }) => theme.canvas}!important;

    :hover{ background:${({ theme }) => theme.background.hover}!important; }
`;

/* ───────── progress bar ───────── */
export const ProgressBarContainer = styled(ProgressBar)`
    .progress-bar{ background:${({ theme }) => theme.canvas}!important; }
`;
export const ProgressContainer = styled.div`
    width: 100%;
    margin: .5rem 0 10px;
    color: ${({ theme }) => theme.color.primary};

    span{ display:block; margin-bottom:8px; }
`;

/* ───────── footer ───────── */
export const Footer = styled.footer`
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: ${({ $pushBottom }) => ($pushBottom ? "auto" : ".75rem")};
    padding-bottom: ${({ $pushBottom }) => ($pushBottom ? "1rem" : "0")};
`;
export const DeleteBtn = styled.span`
    cursor: pointer;
    color: ${({ theme }) => theme.color.primary};
    :hover{ color:${({ theme }) => theme.color.hover}; }
`;

/* ───────── divider ───────── */
export const Divider = styled.hr`
    margin: 1rem 0;
    opacity: .4;
`;
