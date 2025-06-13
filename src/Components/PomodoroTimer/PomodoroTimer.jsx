import React, { useEffect, useRef, useState } from "react";
import { Button, ButtonGroup, Collapse, Form } from "react-bootstrap";
import { MdPlayArrow, MdPause, MdReplay, MdSettings } from "react-icons/md";
import styled from "styled-components";

/* ──────── styled-UI ──────── */
const Wrapper   = styled.div`margin-top:1.5rem;text-align:center;`;
const TimeBig   = styled.h2`font-size:2.8rem;margin:0;`;

const Tabs = styled(ButtonGroup)`
    margin:.5rem 0;
    padding:0 .5rem;
    display:flex !important;
    flex-wrap:wrap;               /* кнопки можно переносить */

    .btn{
        flex:1 0 50%;               /* две в строку → текст не лезет друг на друга */
        min-width:0;
        white-space:normal;
        line-height:1.2;
        padding:.45rem .25rem;
        font-size:.9rem;

        border-radius:0 !important;
    }

    /* ≥576 px оставляем привычную однострочную полосу */
    @media (min-width:576px){
        .btn{ flex:1 0 auto; }
    }
`;

const SettingsWrapper = styled.div`
    width:260px;
    margin:0 auto;
    max-height:70vh;
    overflow-y:auto;              /* внутренний скролл */
    padding:0 1rem 1rem;          /* БОЛЬШЕ отступов по краям */
`;

const CycleInfo = styled.div`font-size:.8rem;color:#888;`;

/* ─────── константы ─────── */
const STORAGE_KEY = "pomo_state";    // ключ в localStorage

/* ------------------------------------------------------------------ */
const PomodoroTimer = ({ onSettingsToggle = () => {} }) => {
    /* ───── A. чтение состояния из localStorage ───── */
    const loadState = () => {
        try {
            const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");

            const defaults = {
                dur : { work:1500, shortBreak:300, longBreak:900 },
                goal: 4,
                auto: true,
                mode:"work",
                running:false,
                left:1500,
                short:0,
            };

            const dur  = saved.dur  ?? defaults.dur;
            const goal = saved.goal ?? defaults.goal;
            const auto = saved.auto ?? defaults.auto;

            /* если таймер шёл — рассчитываем оставшееся */
            let running     = saved.running ?? defaults.running;
            let secondsLeft = saved.left    ?? defaults.left;

            if (running && saved.finishAt) {
                secondsLeft = Math.max(0, Math.ceil((saved.finishAt - Date.now())/1000));
                running     = secondsLeft > 0;
            }

            return {
                dur, goal, auto,
                mode : saved.mode ?? defaults.mode,
                left : secondsLeft || dur[saved.mode ?? defaults.mode],
                running,
                short: saved.short ?? defaults.short,
            };
        } catch {
            return {
                dur : { work:1500, shortBreak:300, longBreak:900 },
                goal:4, auto:true, mode:"work", left:1500, running:false, short:0
            };
        }
    };

    /* ───── B. state ───── */
    const initial            = loadState();
    const [dur,   setDur]    = useState(initial.dur);
    const [goal,  setGoal]   = useState(initial.goal);
    const [auto,  setAuto]   = useState(initial.auto);

    const [mode,  setMode]   = useState(initial.mode);
    const [left,  setLeft]   = useState(initial.left);
    const [running, setRun]  = useState(initial.running);

    const [shortCnt, setShort] = useState(initial.short);
    const [showSett, setShowSett] = useState(false);     // панель настроек

    const intervalRef = useRef(null);

    /* уведомляем родитель – открыт ли блок настроек */
    useEffect(() => onSettingsToggle(showSett), [showSett, onSettingsToggle]);

    /* ───── C. звук ───── */
    const audioRef = useRef(
        typeof Audio !== "undefined"
            ? new Audio(`${process.env.PUBLIC_URL}/sounds/alarm.mp3`)
            : null
    );
    const playSound = () => {
        const a = audioRef.current;
        if (!a) return;
        a.pause(); a.currentTime = 0;
        a.play().catch(()=>{});
    };

    /* ───── D. тикаем каждую секунду, если «running» ───── */
    useEffect(() => {
        if (!running) return;
        intervalRef.current = setInterval(() => setLeft(s => s - 1), 1000);
        return () => clearInterval(intervalRef.current);
    }, [running]);

    /* ───── E. достигли 0 — переходим к следующему режиму ───── */
    useEffect(() => {
        if (left > 0) return;

        if (running) playSound();
        setRun(false);

        if (mode === "work") {
            const nextShort   = shortCnt + 1;
            const reachedGoal = nextShort === goal;
            setShort(reachedGoal ? 0 : nextShort);

            const nextMode = reachedGoal ? "longBreak" : "shortBreak";
            setMode(nextMode);
            setLeft(dur[nextMode]);
            if (auto) setTimeout(() => setRun(true), 0);
        } else {                                // break закончился
            setMode("work");
            setLeft(dur.work);
            if (auto) setTimeout(() => setRun(true), 0);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [left]);

    /* ───── F. сохраняем текущее состояние ───── */
    useEffect(() => {
        const runtime =
            running
                ? { running:true, finishAt: Date.now() + left*1000 }
                : { running:false, left };
        localStorage.setItem(STORAGE_KEY,
            JSON.stringify({ dur, goal, auto, mode, short:shortCnt, ...runtime })
        );
    }, [dur, goal, auto, mode, left, running, shortCnt]);

    /* ───── G. helpers UI ───── */
    const mmss = () =>
        `${String(Math.floor(left/60)).padStart(2,"0")}:${String(left%60).padStart(2,"0")}`;

    const switchManually = (tab) => {
        clearInterval(intervalRef.current);
        setRun(false);
        setMode(tab);
        setLeft(dur[tab]);
    };

    const reset = () => {
        setShort(0);
        clearInterval(intervalRef.current);
        setRun(false);
        setMode("work");
        setLeft(dur.work);
    };

    /* ───── H. временные поля настроек ───── */
    const [tmpDur,  setTmpDur]  = useState(dur);
    const [tmpGoal, setTmpGoal] = useState(goal);
    const [tmpAuto, setTmpAuto] = useState(auto);

    const saveSettings = () => {
        setDur(tmpDur);
        setGoal(tmpGoal);
        setAuto(tmpAuto);
        reset();
        setShowSett(false);
    };

    /* ───── I. JSX ───── */
    return (
        <Wrapper>
            {/* вкладки */}
            <Tabs>
                {["work","shortBreak","longBreak"].map((tab) => (
                    <Button
                        key={tab}
                        variant={mode===tab ? "primary" : "outline-secondary"}
                        onClick={() => switchManually(tab)}
                    >
                        {tab==="work"
                            ? "Работа"
                            : tab==="shortBreak"
                                ? "Короткий перерыв"
                                : "Длинный перерыв"}
                    </Button>
                ))}
            </Tabs>

            <TimeBig>{mmss()}</TimeBig>
            <CycleInfo>Циклы: {shortCnt}/{goal}</CycleInfo>

            <ButtonGroup className="mt-2">
                <Button onClick={()=>setRun(r=>!r)} variant="outline-primary">
                    {running ? <MdPause size={20}/> : <MdPlayArrow size={20}/> }
                </Button>
                <Button onClick={reset} variant="outline-secondary">
                    <MdReplay size={18}/>
                </Button>
                <Button onClick={()=>setShowSett(s=>!s)} variant="outline-secondary">
                    <MdSettings size={18}/>
                </Button>
            </ButtonGroup>

            {/* настройки */}
            <Collapse in={showSett}>
                <SettingsWrapper>
                    <Form className="mt-3 text-start">
                        {[
                            ["work","Работа (сек)"],
                            ["shortBreak","Короткий перерыв (сек)"],
                            ["longBreak","Длинный перерыв (сек)"],
                        ].map(([k,label])=>(
                            <Form.Group className="mb-2" key={k}>
                                <Form.Label>{label}</Form.Label>
                                <Form.Control
                                    type="number" min={1}
                                    value={tmpDur[k]}
                                    onChange={e=>setTmpDur(p=>({...p,[k]:+e.target.value}))}
                                />
                            </Form.Group>
                        ))}

                        <Form.Group className="mb-3">
                            <Form.Label>Циклов до длинного перерыва</Form.Label>
                            <Form.Control
                                type="number" min={1} max={10}
                                value={tmpGoal}
                                onChange={e=>setTmpGoal(+e.target.value)}
                            />
                        </Form.Group>

                        <Form.Check
                            className="mb-3"
                            type="checkbox"
                            label="Авто-переключение"
                            checked={tmpAuto}
                            onChange={e=>setTmpAuto(e.target.checked)}
                        />

                        <Button className="w-100" onClick={saveSettings}>
                            Сохранить
                        </Button>
                    </Form>
                </SettingsWrapper>
            </Collapse>
        </Wrapper>
    );
};

export default PomodoroTimer;
