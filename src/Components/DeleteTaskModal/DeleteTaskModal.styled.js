// DeleteTaskModal.styled.js
import styled from "styled-components";
import Button from "react-bootstrap/Button";

/* кнопка подтверждения --------------------------------------------- */
export const ConfirmBtn = styled(Button)`
    background: ${({ theme }) => theme.canvas};
    border: none !important;

    :hover,
    :focus-visible,
    :focus {
        background: ${({ theme }) => theme.canvas};
        box-shadow: none !important;
    }
`;

/* смещение всей модалки чуть ниже ---------------------------------- */
/* dialog-класс (привяжем его через dialogClassName)                  */
export const DialogLower = styled.div`
    margin-top: 120px;           /* ← регулируйте, сколько нужно */

    /* чтобы диалог НЕ прижимался вправо, добавим минимальную ширину
       — иначе bootstrap даст ему width: 0 на узких экранах */
    min-width: 300px;
`;
