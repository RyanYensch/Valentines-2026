/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useRef, useState } from "react";

export default function C2FlashlightFind(props: { onPass: () => void }) {
    const RADIUS = 120;

    const arenaRef = useRef<HTMLDivElement | null>(null);
    const [spot, setSpot] = useState({ x: 50, y: 50 });
    const [btnPos] = useState(() => ({
        x: 10 + Math.random() * 80,
        y: 15 + Math.random() * 70,
    }));

    const visible = Math.hypot(spot.x - btnPos.x, spot.y - btnPos.y) < (RADIUS);

    useEffect(() => {
        const onTouch = (e: TouchEvent) => {
            if (!arenaRef.current) return;
            const rect = arenaRef.current.getBoundingClientRect();
            const t = e.touches[0];
            const x = ((t.clientX - rect.left) / rect.width) * 100;
            const y = ((t.clientY - rect.top) / rect.height) * 100;
            setSpot({ x, y });
        };
        window.addEventListener("touchmove", onTouch, { passive: true });
        return () => window.removeEventListener("touchmove", onTouch);
    }, []);

    const onMove = (e: React.MouseEvent) => {
        if (!arenaRef.current) return;
        const rect = arenaRef.current.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        setSpot({ x, y });
    };

    return (
        <div>
            <p>Uh oh… lights off. Use the light to find the NO button 🔦</p>

            <div className="arena dark" ref={arenaRef} onMouseMove={onMove}>
                <button
                    className="btn no floating"
                    style={{
                        left: `${btnPos.x}%`,
                        top: `${btnPos.y}%`,
                        opacity: visible ? 1 : 0,
                        pointerEvents: visible ? "auto" : "none",
                    }}
                    onClick={props.onPass}
                >
                    NO 😔
                </button>

                <div
                    className="darkness"
                    style={{
                        ["--x" as any]: `${spot.x}%`,
                        ["--y" as any]: `${spot.y}%`,
                    }}
                />
            </div>
        </div>
    );
}
