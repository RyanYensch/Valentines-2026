import React from "react";
import { CHALLENGE_TITLES } from "./index";
import type { ChallengeId } from "../types";

export default function ChallengeShell(props: {
    id: ChallengeId;
    children: React.ReactNode;
    onGiveUp?: () => void;
}) {
    const { id, children } = props;

    return (
        <div className="Page">
            <div className="Card">
                <div className="Badge"> Challenge {id}/10</div>
                <h1 className="title">{CHALLENGE_TITLES[id]}</h1>
                <div className="content">{children}</div>
            </div>
        </div>
    );
}