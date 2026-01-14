export type ChallengeId = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;

export type GamePhase =
    | { kind: "question" }
    | { kind: "challenge"; id: ChallengeId }
    | { kind: "fake_rejection" }
    | { kind: "redemption" }
    | { kind: "accepted" };

export type Progress = {
    nextChallenge: ChallengeId;
    completed: Partial<Record<ChallengeId, boolean>>;
    accepted: boolean;
};