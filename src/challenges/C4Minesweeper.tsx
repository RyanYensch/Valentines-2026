/* eslint-disable react-hooks/purity */
import { useMemo, useState } from "react";

type Tile = {
    mine: boolean;
    revealed: boolean;
    flagged: boolean;
    adj: number;
};

const SIZE = 8;
const MINES = 8;

function neighbors(r: number, c: number) {
    const out: Array<[number, number]> = [];
    for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
            if (dr === 0 && dc === 0) continue;
            out.push([r + dr, c + dc]);
        }
    }
    return out;
}

export default function C4Minesweeper(props: { onPass: () => void }) {
    const fresh = useMemo(() => {
        const g: Tile[][] = Array.from({ length: SIZE }, () =>
            Array.from({ length: SIZE }, () => ({
                mine: false,
                revealed: false,
                flagged: false,
                adj: 0,
            }))
        );

        let placed = 0;
        while (placed < MINES) {
            const r = Math.floor(Math.random() * SIZE);
            const c = Math.floor(Math.random() * SIZE);
            if (g[r][c].mine) continue;
            g[r][c].mine = true;
            placed++;
        }

        for (let r = 0; r < SIZE; r++) {
            for (let c = 0; c < SIZE; c++) {
                if (g[r][c].mine) continue;
                let n = 0;
                for (const [nr, nc] of neighbors(r, c)) {
                    if (g[nr]?.[nc]?.mine) n++;
                }
                g[r][c].adj = n;
            }
        }

        return g;
    }, []);

    const [grid, setGrid] = useState<Tile[][]>(fresh);
    const [lost, setLost] = useState(false);

    const revealFlood = (r0: number, c0: number, g: Tile[][]) => {
        const stack: Array<[number, number]> = [[r0, c0]];
        const seen = new Set<string>();

        while (stack.length) {
            const [r, c] = stack.pop()!;
            const key = `${r},${c}`;
            if (seen.has(key)) continue;
            seen.add(key);

            const t = g[r]?.[c];
            if (!t || t.revealed || t.flagged || t.mine) continue;

            t.revealed = true;
            if (t.adj === 0) {
                for (const [nr, nc] of neighbors(r, c)) stack.push([nr, nc]);
            }
        }
    };

    const checkWin = (g: Tile[][]) => {
        let correctFlags = 0;
        let safeRevealed = 0;

        for (const row of g) {
            for (const t of row) {
                if (t.mine && t.flagged) correctFlags++;
                if (!t.mine && t.revealed) safeRevealed++;
            }
        }

        if (correctFlags === MINES && safeRevealed === SIZE * SIZE - MINES) {
            props.onPass();
        }
    };

    const leftClick = (r: number, c: number) => {
        if (lost) return;

        setGrid((prev) => {
            const g = prev.map((row) => row.map((t) => ({ ...t })));
            const t = g[r][c];

            if (t.revealed || t.flagged) return prev;

            if (t.mine) {
                for (const row of g) for (const cell of row) cell.revealed = true;
                setLost(true);
                return g;
            }

            revealFlood(r, c, g);
            checkWin(g);
            return g;
        });
    };

    const rightClick = (e: React.MouseEvent, r: number, c: number) => {
        e.preventDefault();
        if (lost) return;

        setGrid((prev) => {
            const g = prev.map((row) => row.map((t) => ({ ...t })));
            const t = g[r][c];
            if (t.revealed) return prev;
            t.flagged = !t.flagged;
            checkWin(g);
            return g;
        });
    };

    return (
        <div>
            <p>
                Minesweeper rules:
                <br />- Left click = reveal
                <br />- Right click = 🚩
            </p>

            <div className="ms">
                {grid.map((row, r) =>
                    row.map((t, c) => (
                        <button
                            key={`${r}-${c}`}
                            className={`msCell ${t.revealed ? "rev" : ""} ${t.flagged ? "flagged" : ""}`}
                            onClick={() => leftClick(r, c)}
                            onContextMenu={(e) => rightClick(e, r, c)}
                        >
                            {t.revealed
                                ? t.mine
                                    ? "💥"
                                    : t.adj || ""
                                : t.flagged
                                    ? "🚩"
                                    : ""}
                        </button>
                    ))
                )}
            </div>

            {lost && <p className="hint">💥 BOOM. Refresh to try again 😜</p>}
        </div>
    );
}
