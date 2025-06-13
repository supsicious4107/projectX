import React, { useState, useEffect, useRef } from "react";
import { Button, ButtonGroup, Collapse, Form } from "react-bootstrap";
import { MdPlayArrow, MdPause, MdReplay, MdSettings } from "react-icons/md";
import styled from "styled-components";

/* ───── UI ───── */
const Wrapper   = styled.div`margin-top:1.5rem;text-align:center;`;
const TimeBig   = styled.h2`font-size:2.8rem;margin:0;`;
const Tabs      = styled(ButtonGroup)`margin:.5rem 0;padding:0 .5rem;`;
const CycleInfo = styled.div`font-size:.8rem;color:#888;`;

/* ─── key в localStorage ─── */
const STORAGE_KEY = "pomo_state";   // всё состояние таймера

/* --------------------------------------------------------------------- */
const PomodoroTimer = ({ onSettingsToggle = () => {} }) => {
    /* ---------- A. helpers загрузки ---------- */
    const loadState = () => {
        try {
            const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");

            /* базовые настройки (длительности / цель циклов / авто-старт) */
            const dur  = saved.dur  ?? { work:1500, shortBreak:300, longBreak:900 };
            const goal = saved.goal ?? 4;
            const auto = saved.auto ?? true;

            /* режим и таймер */
            if (!saved.mode) {
                return { dur, goal, auto, mode:"work", left:dur.work, running:false, short:0 };
            }

            /* если таймер шёл, вычисляем, сколько осталось */
            let secondsLeft = saved.left;
            let running     = saved.running;

            if (saved.running && saved.finishAt) {
                secondsLeft = Math.max(0, Math.ceil((saved.finishAt - Date.now())/1000));
                running     = secondsLeft > 0;                // если уже 0 — ставим на паузу
            }

            return {
                dur, goal, auto,
                mode : saved.mode,
                left : secondsLeft || dur[saved.mode],
                running,
                short: saved.short ?? 0,
            };
        } catch {
            return { dur:{work:1500,shortBreak:300,longBreak:900},
                goal:4, auto:true, mode:"work", left:1500, running:false, short:0 };
        }
    };

    /* ---------- B. state ---------- */
    const initial                = loadState();
    const [dur,   setDur]        = useState(initial.dur);
    const [goal,  setGoal]       = useState(initial.goal);
    const [auto,  setAuto]       = useState(initial.auto);

    const [mode,  setMode]       = useState(initial.mode);
    const [left,  setLeft]       = useState(initial.left);
    const [running, setRun]      = useState(initial.running);

    const [shortCnt, setShort]   = useState(initial.short);
    const [showSett, setShowSett] = useState(false);

    /* уведомляем родителя (RightSideBar) открыт ли блок настроек */
    useEffect(() => onSettingsToggle(showSett), [showSett, onSettingsToggle]);

    const intervalRef = useRef(null);

    /* ---------- C. звук ---------- */
    const audioRef = useRef(
        typeof Audio !== "undefined"
            ? new Audio(`${process.env.PUBLIC_URL}/sounds/alarm.mp3`)
            : null
    );
    const playSound = () => {
        const a = audioRef.current;
        if (!a) return;
        a.pause();
        a.currentTime = 0;
        a.play().catch(() => {});
    };

    /* ---------- D. ход таймера ---------- */
    useEffect(() => {
        if (!running) return;
        intervalRef.current = setInterval(() => setLeft((s) => s - 1), 1000);
        return () => clearInterval(intervalRef.current);
    }, [running]);

    /* ---------- E. когда дошли до нуля ---------- */
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
        } else {
            setMode("work");
            setLeft(dur.work);
            if (auto) setTimeout(() => setRun(true), 0);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [left]);

    /* ---------- F. сохранение в localStorage ---------- */
    useEffect(() => {
        const runtimeData =
            running
                ? { running:true, finishAt: Date.now() + left * 1000 }
                : { running:false, left };

        localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify({
                dur, goal, auto,
                mode, short: shortCnt,
                ...runtimeData,
            })
        );
    }, [dur, goal, auto, mode, left, running, shortCnt]);

    /* ---------- G. utils ---------- */
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

    /* ---------- H. временные поля настроек ---------- */
    const [tmpDur,  setTmpDur]  = useState(dur);
    const [tmpGoal, setTmpGoal] = useState(goal);
    const [tmpAuto, setTmpAuto] = useState(auto);

    const saveSettings = () => {
        setDur(tmpDur);
        setGoal(tmpGoal);
        setAuto(tmpAuto);
        reset();

        /* оставляем совместимость со старыми ключами, если нужны */
        localStorage.setItem("pomoDur",        JSON.stringify(tmpDur));
        localStorage.setItem("pomoCyclesGoal", String(tmpGoal));
        localStorage.setItem("pomoAutoStart",  JSON.stringify(tmpAuto));

        setShowSett(false);
    };

    /* ---------- I. UI ---------- */
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
                <Button
                    onClick={() => setRun((r)=>!r)}
                    variant="outline-primary"
                >
                    {running ? <MdPause size={20}/> : <MdPlayArrow size={20}/> }
                </Button>
                <Button onClick={reset}          variant="outline-secondary">
                    <MdReplay size={18}/>
                </Button>
                <Button onClick={()=>setShowSett((s)=>!s)} variant="outline-secondary">
                    <MdSettings size={18}/>
                </Button>
            </ButtonGroup>

            {/* панель настроек */}
            <Collapse in={showSett}>
                <div style={{
                    width:260, margin:"0 auto", maxHeight:"60vh",
                    paddingBottom:"1rem",
                }}>
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
                                    onChange={(e)=>setTmpDur(p=>({...p,[k]:+e.target.value}))}
                                />
                            </Form.Group>
                        ))}

                        <Form.Group className="mb-3">
                            <Form.Label>Циклов до длинного перерыва</Form.Label>
                            <Form.Control
                                type="number" min={1} max={10}
                                value={tmpGoal}
                                onChange={(e)=>setTmpGoal(+e.target.value)}
                            />
                        </Form.Group>

                        <Form.Check
                            className="mb-3"
                            type="checkbox"
                            label="Авто-переключение"
                            checked={tmpAuto}
                            onChange={(e)=>setTmpAuto(e.target.checked)}
                        />

                        <Button className="w-100" onClick={saveSettings}>
                            Сохранить
                        </Button>
                    </Form>
                </div>
            </Collapse>
        </Wrapper>
    );
};

export default PomodoroTimer;
