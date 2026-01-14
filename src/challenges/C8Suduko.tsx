import { useMemo, useState } from "react";

type Cell = number | 0;

const puzzle: Cell[] = [
    1, 0, 3, 0,
    0, 4, 1, 0,
    0, 1, 4, 0,
    4, 0, 0, 1,
];

const solution: number[] = [
    1, 2, 3, 4,
    3, 4, 1, 2,
    2, 1, 4, 3,
    4, 3, 2, 1,
];

export default function C8Sudoku(props: { onPass: () => void }) {
    const [grid, setGrid] = useState<Cell[]>(puzzle);
    const fixed = useMemo(() => puzzle.map((v) => v !== 0), []);

    const setAt = (i: number, v: Cell) => {
        if (fixed[i]) return;
        setGrid((g) => {
            const ng = [...g];
            ng[i] = v;
            return ng;
        });
    };

    const correct = grid.every((v, i) => v === solution[i]);

    return (
        <div>
            <p>Fill the sudoku. Use digits 1-4.</p>
            <div className="sudoku">
                {grid.map((v, i) => (
                    <input
                        key={i}
                        className={`sCell ${fixed[i] ? "fixed" : ""}`}
                        value={v === 0 ? "" : String(v)}
                        disabled={fixed[i]}
                        onChange={(e) => {
                            const raw = e.target.value.trim();
                            if (raw === "") return setAt(i, 0);
                            const n = Number(raw);
                            if ([1, 2, 3, 4].includes(n)) setAt(i, n as Cell);
                        }}
                        inputMode="numeric"
                        maxLength={1}
                    />
                ))}
            </div>

            <div className="row space">
                <button className="btn yes" disabled={!correct} onClick={props.onPass}>
                    Check ✅
                </button>
            </div>

            <p className="hint">{correct ? "Perfect 😘" : "Not quite yet…"}</p>
        </div>
    );
}
