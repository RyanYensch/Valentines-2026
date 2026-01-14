import { useState } from "react";

type Card = { value: number; label: string };

function label(v: number) {
    if (v === 11) return "J";
    if (v === 12) return "Q";
    if (v === 13) return "K";
    if (v === 14) return "A";
    return String(v);
}

function draw(): Card {
    const v = 2 + Math.floor(Math.random() * 13);
    return { value: v, label: label(v) };
}

export default function C6HigherLower(props: { onPass: () => void }) {
    const [score, setScore] = useState(0);
    const [current, setCurrent] = useState<Card>(() => draw());
    const [msg, setMsg] = useState("Get 6 correct guesses.");

    const goal = 5;

    const guess = (g: "higher" | "lower") => {
        const next = draw();

        const correct =
            (g === "higher" && next.value >= current.value) ||
            (g === "lower" && next.value <= current.value);

        setCurrent(next);

        if (correct) {
            const ns = score + 1;
            setScore(ns);
            setMsg(`Correct ✅ (${next.label}). Score: ${ns}/${goal}`);
            if (ns >= goal) props.onPass();
        } else {
            setScore(0)
            setMsg(`Wrong 😈 (${next.label}). Score resets: ${score}/${goal}`);
        }
    };

    return (
        <div>
            <p>{msg}</p>
            <div className="bigCard">{current.label}</div>
            <div className="row">
                <button className="btn" onClick={() => guess("higher")}>Higher</button>
                <button className="btn" onClick={() => guess("lower")}>Lower</button>
            </div>
            <p className="hint">2 is low, A is high.</p>
        </div>
    );
}
