import React, { useEffect, useState, useRef } from "react";
import { Button, Form, ButtonGroup } from "react-bootstrap";
import styled from "styled-components";

const Wrapper = styled.div`
    margin-top: 1.5rem;
    text-align: center;
    font-size: 1.25rem;
`;
const InputWrapper = styled.div`
    display: inline-block;
    position: relative;

    input {
        width: 120px;
        padding-right: 6ch;
        text-align: right;
        -moz-appearance: textfield;
    }
    input::-webkit-inner-spin-button,
    input::-webkit-outer-spin-button { -webkit-appearance:none; }

    span {
        position: absolute;
        right: 1ch;
        top: 50%;
        transform: translateY(-50%);
        pointer-events: none;
        color: ${({ theme }) => theme.color.secondary ?? "#888"};
        user-select: none;
    }
`;
const Time = styled.div`
    font-family: "Courier New", monospace;
    margin-bottom: .5rem;
`;

const STORAGE_KEY = "cd_state";   // { finishAt,total }

const CountdownTimer = () => {
    /* ---------- глобальный <audio> ---------- */
    const audioRef = useRef(null);
    useEffect(() => {
        const el = document.createElement("audio");
        el.src = `${process.env.PUBLIC_URL}/sounds/alarm.mp3`;
        el.preload = "auto";
        el.setAttribute("playsinline", "");  // iOS
        document.body.appendChild(el);
        audioRef.current = el;
        return () => el.remove();            // очистка при размонтировании
    }, []);

    /* ---------- начальное состояние ---------- */
    const load = () => {
        try {
            const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
            if (!saved.finishAt) return { total: "", seconds: 0, running: false };
            const diff = Math.max(0, Math.ceil((saved.finishAt - Date.now()) / 1000));
            return diff === 0
                ? { total: saved.total, seconds: 0, running: false }
                : { total: saved.total, seconds: diff, running: true };
        } catch {
            return { total: "", seconds: 0, running: false };
        }
    };
    const [{ total, seconds, running }, setState] = useState(load);

    /* ---------- тик ---------- */
    useEffect(() => {
        if (!running) return;
        const id = setInterval(
            () => setState(s => ({ ...s, seconds: Math.max(0, s.seconds - 1) })),
            1000
        );
        return () => clearInterval(id);
    }, [running]);

    /* ---------- сигнал + стоп ---------- */
    useEffect(() => {
        if (seconds === 0 && running) {
            setState(s => ({ ...s, running: false }));
            audioRef.current?.play().catch(() => {});
        }
    }, [seconds, running]);

    /* ---------- сохранение ---------- */
    useEffect(() => {
        if (!running) {
            localStorage.setItem(
                STORAGE_KEY,
                JSON.stringify({ total, seconds, running: false })
            );
            return;
        }
        localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify({
                total,
                finishAt: Date.now() + seconds * 1000,
                running: true,
            })
        );
    }, [running, seconds, total]);

    /* ---------- helpers ---------- */
    const mmss = () =>
        `${String(Math.floor(seconds / 60)).padStart(2, "0")}:${String(
            seconds % 60
        ).padStart(2, "0")}`;

    /* ---------- handlers ---------- */
    const unlockAudio = () => {
        if (!audioRef.current) return;
        if (!audioRef.current.paused) return;      // уже разблокирован
        audioRef.current.volume = 0;
        audioRef.current.play()
            .then(() => {
                audioRef.current.pause();
                audioRef.current.currentTime = 0;
                audioRef.current.volume = 1;
            })
            .catch(() => {});
    };

    const start = () => {
        if (!total) return;
        unlockAudio();                             // первый пользовательский жест
        setState({
            total,
            seconds: seconds || +total,
            running: true,
        });
    };
    const pause = () => setState(s => ({ ...s, running: false }));
    const reset = () =>
        setState(s => ({ ...s, running: false, seconds: +total || 0 }));

    return (
        <Wrapper>
            <Time>{mmss()}</Time>

            <InputWrapper className="mb-2">
                <Form.Control
                    type="number"
                    min={1}
                    value={total}
                    placeholder="0"
                    onChange={e => {
                        const val = e.target.value === "" ? "" : +e.target.value;
                        setState(s => ({
                            ...s,
                            total: val,
                            seconds: s.running ? s.seconds : val || 0,
                        }));
                    }}
                />
                <span>сек</span>
            </InputWrapper>

            <ButtonGroup size="sm" className="d-flex justify-content-center gap-2">
                {running ? (
                    <Button variant="secondary" onClick={pause}>
                        Пауза
                    </Button>
                ) : (
                    <Button variant="primary" onClick={start}>
                        Старт
                    </Button>
                )}
                <Button variant="outline-secondary" onClick={reset}>
                    Сброс
                </Button>
            </ButtonGroup>
        </Wrapper>
    );
};

export default CountdownTimer;
