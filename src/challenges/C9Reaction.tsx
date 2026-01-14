import { useEffect, useRef, useState } from "react";

type Phase = "ready" | "waiting" | "go" | "result";

export default function C9Reaction(props: { onPass: () => void }) {
    const [phase, setPhase] = useState<Phase>("ready");
    const [ms, setMs] = useState<number | null>(null);

    const startTime = useRef<number>(0);
    const timer = useRef<number | null>(null);

    const start = () => {
        setMs(null);
        setPhase("waiting");

        const delay = 800 + Math.random() * 1600;
        timer.current = window.setTimeout(() => {
            startTime.current = performance.now();
            setPhase("go");
        }, delay);
    };

    const click = () => {
        if (phase === "waiting") {
            if (timer.current) window.clearTimeout(timer.current);
            setPhase("result");
            setMs(9999);
            return;
        }

        if (phase === "go") {
            const t = performance.now() - startTime.current;
            setMs(Math.round(t));
            setPhase("result");
            if (t < 240) props.onPass();
        }
    };

    useEffect(() => {
        return () => {
            if (timer.current) window.clearTimeout(timer.current);
        };
    }, []);

    return (
        <div>
            <p>Goal: click when it turns GREEN in under <b>240ms</b>.</p>

            <div
                className={`reaction ${phase}`}
                onClick={phase === "go" || phase === "waiting" ? click : undefined}
            >
                {phase === "ready" && "Click START"}
                {phase === "waiting" && "WAIT… (don't click yet)"}
                {phase === "go" && "NOW!"}
                {phase === "result" && (ms === 9999 ? "Too early 😋" : `${ms}ms`)}
            </div>

            <div className="row">
                <button className="btn" onClick={start}>
                    Start
                </button>
                {phase === "result" && ms !== null && ms < 240 && (
                    <span className="hint">You're cracked 🤯</span>
                )}
            </div>
        </div>
    );
}
