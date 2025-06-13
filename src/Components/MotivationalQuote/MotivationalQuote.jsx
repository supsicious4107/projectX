// src/Components/MotivationalQuote/MotivationalQuote.jsx
import React, { useEffect, useRef, useState } from "react";
import { createPortal }                     from "react-dom";
import styled                               from "styled-components";
import { FiRefreshCw }                      from "react-icons/fi";

/* ─────────────────────────── UI ─────────────────────────── */
const QuoteWrapper = styled.div`
    position: fixed;
    bottom: 0;

    /* ▸ десктоп — оставляем место слева/справа под сайдбары */
    left : var(--lsize, 0px);
    right: var(--rsize, 0px);

    /* ▸ мобилка — цитата во всю ширину */
    @media (max-width: 991.98px) {
        left: 0;
        right: 0;
    }

    padding: .8rem 1.2rem;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: .8rem;

    background: ${({ theme }) => `${theme.background.primary}E6`};
    border-top: 1px solid ${({ theme }) => `${theme.color.primary}55`};
    backdrop-filter: blur(6px);

    color: ${({ theme }) => theme.color.primary};
    font-size: 1.5rem;
    line-height: 1.3;
    z-index: 3000;
`;

const RefreshBtn = styled.button`
    background: transparent;
    border     : none;
    padding    : 0;
    cursor     : pointer;
    display    : flex;
    align-items: center;
    color      : inherit;
    transition : transform .25s ease;

    &:hover { transform: rotate(90deg); }
`;

/* ──────────────────────── данные ───────────────────────── */
const phrases = [
    "Сегодня – идеальный день, чтобы начать!",
    "Большие дела делаются маленькими шагами.",
    "Ошибки – это ступеньки к успеху.",
    "Всё невозможно, пока не сделано.",
    "Двигайся вперёд, даже если медленно.",
    "Сосредоточься на задаче, а не на препятствии.",
    "Твой будущий «я» скажет спасибо за это усилие.",
    "Каждая минута работы приближает тебя к цели.",
    "Сделай сейчас то, что другие откладывают.",
    "Успех — это привычка доводить до конца.",
    "Каждый день – новый шанс стать лучше.",
    "Твой предел – только начало.",
    "Не бойся медлить, бойся стоять на месте.",
    "Сложно — значит интересно.",
    "Сделай сегодня то, о чём завтра будешь гордиться.",
    "Начни, и половина дела сделана.",
    "Трудности закаляют характер.",
    "Вера в себя – первый шаг к победе.",
    "Путь в тысячу миль начинается с одного шага.",
    "Упорство побеждает талант, когда талант ленится.",
    "Маленький прогресс лучше, чем его отсутствие.",
    "Не откладывай мечты на завтра.",
    "Смотри вперёд, туда, где будут твои победы.",
    "Каждый успех начинается с решения попробовать.",
    "Секрет прогресса — начать.",
    "Настойчивость превращает невозможное в возможное.",
    "Твоё время ограничено — используй его мудро.",
    "Сложности – это рост в процессе.",
    "Будь сильнее своих оправданий.",
    "Желание победить должно быть сильнее страха проиграть."
];

/* ───────────────────── компонент ──────────────────────── */
const MotivationalQuote = () => {
    const random = () => phrases[Math.floor(Math.random() * phrases.length)];
    const [quote,  setQuote]  = useState(random);
    const [hidden, setHidden] = useState(false);         // прячем, если открыт off-canvas
    const ref                 = useRef(null);

    /* ► измеряем цитату + реальные ширины сайдбаров */
    useEffect(() => {
        const setSizes = () => {
            const h = ref.current?.offsetHeight || 0;
            document.documentElement.style.setProperty("--quote-height", `${h}px`);

            /* ищем панели со спец-атрибутами (добавьте их, если ещё нет) */
            const l = document.querySelector("[data-left-sidebar]") ?.offsetWidth || 0;
            const r = document.querySelector("[data-right-sidebar]")?.offsetWidth || 0;
            document.documentElement.style.setProperty("--lsize", `${l}px`);
            document.documentElement.style.setProperty("--rsize", `${r}px`);
        };

        setSizes();
        window.addEventListener("resize", setSizes);
        return () => window.removeEventListener("resize", setSizes);
    }, [quote]);

    /* ► следим, открыт ли любой bootstrap-offcanvas */
    useEffect(() => {
        const check = () => setHidden(!!document.querySelector(".offcanvas.show"));
        check();                                 // первый раз

        const mo = new MutationObserver(check);
        mo.observe(document.body, { childList: true, subtree: true });
        return () => mo.disconnect();
    }, []);

    /* ► если открыт сайдбар — ничего не рендерим */
    if (hidden) return null;

    return createPortal(
        <QuoteWrapper ref={ref}>
            {quote}
            <RefreshBtn onClick={() => setQuote(random)}>
                <FiRefreshCw size={22} />
            </RefreshBtn>
        </QuoteWrapper>,
        document.body
    );
};

export default MotivationalQuote;
