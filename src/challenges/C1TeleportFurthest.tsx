
import React, { useMemo, useRef, useState } from "react";

export default function C1TelportFurthest(props: { onPass: () => void }) {
    const boxRef = useRef<HTMLDivElement | null>(null);
    const [pos, setPos] = useState<{ x: number; y: number }>({ x: 50, y: 50 });
    const [clicked, setClicked] = useState(false);

    const corners = useMemo(() => [
        { x: 8, y: 10 },
        { x: 92, y: 10 },
        { x: 8, y: 90 },
        { x: 92, y: 90 },
    ], []);

    const onMove = (e: React.MouseEvent) => {
        if (!boxRef.current || clicked) return;

        const rect = boxRef.current.getBoundingClientRect();
        const cx = ((e.clientX - rect.left) / rect.width) * 100;
        const cy = ((e.clientY - rect.top) / rect.height) * 100;

        let best = corners[0];
        let bestD = -1;

        for (const c of corners) {
            const dx = c.x - cx;
            const dy = c.y - cy;
            const d = dx * dx + dy * dy;
            if (d > bestD) {
                bestD = d;
                best = c;
            }
        }
        setPos(best);
    };

    const click = () => {
        setClicked(true);
        props.onPass();
    };

    return (
        <div>
            <p>Try to click the NO button. It keeps teleporting to the furthest corner 😈</p>
            <div className="arena" ref={boxRef} onMouseMove={onMove}>
                <button
                    className="btn no floating"
                    style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
                    onClick={click}>
                    NO 🥲
                </button>
            </div>
        </div>
    );
}