import React, { useEffect, useState, useRef } from "react";
import { Button, ButtonGroup } from "react-bootstrap";
import styled from "styled-components";

const Wrapper = styled.div`
    margin-top: 1rem;
    text-align: center;
    font-size: 1.25rem;
`;
const Time = styled.div`
    font-family: "Courier New", monospace;
    margin-bottom: .5rem;
`;

const STORAGE_KEY = "sw_state";          // { running, startTime }

const Stopwatch = () => {
    /* --- стартовое состояние из localStorage --- */
    const load = () => {
        try {
            const data = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
            if (!data.startTime) return { running: false, elapsed: 0 };
            const elapsed = data.running
                ? Math.floor((Date.now() - data.startTime) / 1000)
                : data.elapsed || 0;
            return { running: data.running, elapsed };
        } catch {
            return { running: false, elapsed: 0 };
        }
    };

    const [{ running, elapsed }, setState] = useState(load);
    const intervalRef = useRef(null);

    /* --- тик --- */
    useEffect(() => {
        if (!running) return;
        intervalRef.current = setInterval(
            () => setState((s) => ({ ...s, elapsed: s.elapsed + 1 })),
            1000
        );
        return () => clearInterval(intervalRef.current);
    }, [running]);

    /* --- сохранение --- */
    useEffect(() => {
        const data = running
            ? { running: true, startTime: Date.now() - elapsed * 1000 }
            : { running: false, elapsed };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    }, [running, elapsed]);

    /* --- helpers --- */
    const toggleRun = () =>
        setState((s) => ({ ...s, running: !s.running }));
    const reset = () => setState({ running: false, elapsed: 0 });
    const mmss = () =>
        `${String(Math.floor(elapsed / 60)).padStart(2, "0")}:${String(
            elapsed % 60
        ).padStart(2, "0")}`;

    return (
        <Wrapper>
            <Time>{mmss()}</Time>

            <ButtonGroup size="sm" className="d-flex justify-content-center gap-2">
                <Button
                    variant={running ? "secondary" : "primary"}
                    onClick={toggleRun}
                >
                    {running ? "Стоп" : "Старт"}
                </Button>
                <Button variant="outline-secondary" onClick={reset}>
                    Сброс
                </Button>
            </ButtonGroup>
        </Wrapper>
    );
};

export default Stopwatch;
