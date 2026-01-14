import { useState } from "react";

export default function C10LoveMore(props: { onAdmit: () => void }) {
    const [done, setDone] = useState(false);

    const finish = () => {
        setDone(true);
        setTimeout(() => {
            props.onAdmit();
        }, 1500);
    };

    if (done) {
        return (
            <div>
                <h2>😔</h2>
                <p>
                    I definitely love you more…
                    <br />
                    but I guess you're not my Valentine 😞
                </p>
                <p className="hint">(just kidding… maybe)</p>
            </div>
        );
    }

    return (
        <div>
            <p>Final challenge.</p>
            <p>Admit the truth:</p>

            <div className="row">
                <button className="btn yes" onClick={finish}>
                    Okay fine… you love me but I love you MORE 🩷
                </button>
            </div>

            <p className="hint">There is no other option.</p>
        </div>
    );
}
