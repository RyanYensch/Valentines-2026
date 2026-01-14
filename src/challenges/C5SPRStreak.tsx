import { useState } from "react";

type Move = "rock" | "paper" | "scissors";

function beats(a: Move, b: Move) {
    return (
        (a === "rock" && b === "scissors") ||
        (a === "paper" && b === "rock") ||
        (a === "scissors" && b === "paper")
    );
}

export default function C5RpsStreak(props: { onPass: () => void }) {
    const [streak, setStreak] = useState(0);
    const [msg, setMsg] = useState("Win 3 in a row. No ties count.");

    const play = (you: Move) => {
        const moves: Move[] = ["rock", "paper", "scissors"];
        const cpu = moves[Math.floor(Math.random() * 3)];

        if (you === cpu) {
            setMsg(`Tie! You: ${you}, Me: ${cpu}.`);
            return;
        }

        if (beats(you, cpu)) {
            const next = streak + 1;
            setStreak(next);
            setMsg(`You win! You: ${you}, Me: ${cpu}. Streak: ${next}/3`);
            if (next >= 3) props.onPass();
        } else {
            setMsg(`I win 😈 You: ${you}, Me: ${cpu}. Streak resets.`);
            setStreak(0);
        }
    };

    return (
        <div>
            <p>{msg}</p>
            <div className="row">
                <button className="btn" onClick={() => play("rock")}>🪨 Rock</button>
                <button className="btn" onClick={() => play("paper")}>📄 Paper</button>
                <button className="btn" onClick={() => play("scissors")}>✂️ Scissors</button>
            </div>
        </div>
    );
}
