import { useEffect, useMemo, useState } from "react";

type Cell = 0 | 1;

export default function C3Maze(props: { onPass: () => void }) {
    const grid: Cell[][] = useMemo(
        () => [
            [1, 1, 1, 1, 1, 1, 1, 1, 1],
            [1, 0, 0, 0, 1, 0, 0, 0, 1],
            [1, 0, 1, 0, 1, 0, 1, 0, 1],
            [1, 0, 1, 0, 0, 0, 1, 0, 1],
            [1, 0, 1, 1, 1, 0, 1, 0, 1],
            [1, 0, 0, 0, 0, 0, 1, 0, 1],
            [1, 1, 1, 1, 1, 0, 1, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 1, 1, 1, 1, 1, 1, 1, 1],
        ],
        []
    );

    const goal = { r: 7, c: 7 };
    const [p, setP] = useState({ r: 1, c: 1 });

    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            const k = e.key.toLowerCase();
            const dr =
                k === "arrowup" || k === "w" ? -1 : k === "arrowdown" || k === "s" ? 1 : 0;
            const dc =
                k === "arrowleft" || k === "a" ? -1 : k === "arrowright" || k === "d" ? 1 : 0;

            if (!dr && !dc) return;

            setP((cur) => {
                const nr = cur.r + dr;
                const nc = cur.c + dc;
                if (grid[nr]?.[nc] !== 0) return cur;
                return { r: nr, c: nc };
            });
        };
        window.addEventListener("keydown", handler);
        return () => window.removeEventListener("keydown", handler);
    }, [grid]);

    useEffect(() => {
        if (p.r === goal.r && p.c === goal.c) props.onPass();
    }, [p, goal.r, goal.c, props]);

    return (
        <div>
            <p>Escape the maze. Use arrow keys or WASD to reach the NO button.</p>
            <div className="maze">
                {grid.map((row, r) =>
                    row.map((cell, c) => {
                        const isP = p.r === r && p.c === c;
                        const isG = goal.r === r && goal.c === c;
                        const cls =
                            cell === 1 ? "mazeCell wall" : isG ? "mazeCell goal" : "mazeCell empty";
                        return (
                            <div key={`${r}-${c}`} className={cls}>
                                {isP ? "🥰" : isG ? "NO" : ""}
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
}
