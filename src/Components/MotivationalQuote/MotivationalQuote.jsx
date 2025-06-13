import React, { useEffect, useState, useRef } from "react";
import { createPortal } from "react-dom";
import styled from "styled-components";
import { FiRefreshCw } from "react-icons/fi";

/* ───── оформление ───── */
const QuoteWrapper = styled.div`
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;                /* мобильная ширина по умолчанию */

    padding: 0.8rem 1.2rem;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 0.8rem;

    background: ${({ theme }) => theme.background.primary}E6;
    border-top: 1px solid ${({ theme }) => theme.color.primary}55;
    backdrop-filter: blur(6px);

    color: ${({ theme }) => theme.color.primary};
    font-size: 1.5rem;
    line-height: 1.3;
    z-index: 3000;

    /* ── десктоп ≥ 992 px: убираем области сайдбаров ── */
    @media (min-width: 992px) {
        left: 270px;            /* ширина левого сайдбара */
        right: 340px;           /* ширина правого сайдбара */
    }
`;

const RefreshBtn = styled.button`
  background: transparent;
  border: none;
  padding: 0;
  cursor: pointer;
  display: flex;
  align-items: center;
  color: inherit;
  transition: transform .25s ease;

  &:hover { transform: rotate(90deg); }
`;

/* ───── 30 фраз — без изменений ───── */
const phrases = [
    "Сегодня – идеальный день, чтобы начать!",
    "Большие дела делаются маленькими шагами.",
    /* … оставшиеся 28 строк … */
    "Желание победить должно быть сильнее страха проиграть."
];

/* ───── компонент ───── */
const MotivationalQuote = () => {
    const random = () => phrases[Math.floor(Math.random() * phrases.length)];
    const [quote, setQuote] = useState(random);

    const ref = useRef(null);

    /* обновляем CSS-переменную с высотой цитаты,
       чтобы в центральной колонке был правильный «запас» */
    useEffect(() => {
        const h = ref.current?.offsetHeight || 0;
        document.documentElement.style.setProperty("--quote-height", `${h}px`);
    }, [quote]);

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
