import { useState } from "react";

export default function C7Trolley(props: { onPass: () => void }) {
    const [choice, setChoice] = useState<"A" | "B" | null>(null);
    const [why, setWhy] = useState("");

    const done = choice && why.trim().length >= 10;

    return (
        <div>
            <p>
                The trolley is coming. You can pull the lever. One track has <b>me</b>.
                The other track has <b>50 strangers and all the worlds games that can't be remade</b>.
            </p>

            <div className="row">
                <button className="btn" onClick={() => setChoice("A")}>
                    Pull lever (save me)
                </button>
                <button className="btn" onClick={() => setChoice("B")}>
                    Don't pull (save 50 + games)
                </button>
            </div>

            {choice && (
                <>
                    <p>
                        You chose: <b>{choice === "A" ? "save me" : "save 50 strangers and games"}</b>.
                        Now type a short reason (10+ chars) 🤔
                    </p>

                    <input
                        className="input"
                        value={why}
                        onChange={(e) => setWhy(e.target.value)}
                        placeholder="Because..."
                    />

                    <div className="row space">
                        <button className="btn yes" disabled={!done} onClick={props.onPass}>
                            Submit
                        </button>
                    </div>
                </>
            )}
        </div>
    );
}
