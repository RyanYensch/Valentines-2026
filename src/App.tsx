import { useState, useMemo, useEffect } from 'react'
import type { ChallengeId, Progress, GamePhase } from './types';
import { usePersistentState } from './usePersistentState';

import ChallengeShell from './challenges/ChallengeShell';
import C1TelportFurthest from './challenges/C1TeleportFurthest';
import C2FlashlightFind from './challenges/C2FlaslightFind';
import C3Maze from './challenges/C3Maze';
import C4Minesweeper from './challenges/C4Minesweeper';
import C5SPRStreak from './challenges/C5SPRStreak';
import C6HigherLower from './challenges/C6HigherLower';
import C7Trolley from './challenges/C7Trolley';
import C8Suduko from './challenges/C8Suduko';
import C9Reaction from './challenges/C9Reaction';
import C10LoveMore from './challenges/C10LoveMore';

const STORAGE_KEY = "I_LOVE_POOKIE";

const initialProgress: Progress = {
  nextChallenge: 1,
  completed: {},
  accepted: false,
};

function clampChallenges(n: number): ChallengeId {
  if (n < 1) return 1;
  if (n > 10) return 10;
  return n as ChallengeId;
}


export default function App() {
  const [progress, setProgress] = usePersistentState<Progress>(STORAGE_KEY, initialProgress);

  const [mode, setMode] = useState<GamePhase>(() => (progress.accepted ? { kind: "accepted" } : { kind: "question" }));

  const noDisabled = useMemo(() => {
    return !!progress.completed[10] || progress.accepted;
  }, [progress]);

  useEffect(() => {
    if (mode.kind === "fake_rejection") {
      const t = setTimeout(() => {
        setMode({ kind: "redemption" });
      }, 2500);
      return () => clearTimeout(t);
    }
  }, [mode]);

  const startNextChallenge = () => {
    const id = progress.nextChallenge;
    setMode({ kind: "challenge", id });
  };

  const completeChallenge = (id: ChallengeId) => {
    setProgress((p) => {
      const next = clampChallenges(id + 1);
      const completed = { ...p.completed, [id]: true };
      const isAccepted = p.accepted;

      return {
        ...p,
        completed,
        nextChallenge: next,
        accepted: isAccepted
      };
    });

    setMode({ kind: "question" });
  };

  const fakeReject = () => {
    setMode({ kind: "fake_rejection" });
  };

  const acceptFinal = () => {
    setProgress((p) => ({ ...p, accepted: true }));
    setMode({ kind: "accepted" });
  };


  if (mode.kind === "fake_rejection") {
    return (
      <div className="page">
        <div className="card">
          <h1>😔</h1>
          <p>
            I definitely love you more…
            <br />
            but I guess you're not my Valentine 😞
          </p>
          <p className="hint">(this hurts more than the minesweeper)</p>
        </div>
      </div>
    );
  }

  if (mode.kind === "redemption") {
    return (
      <div className="page">
        <div className="card">
          <h1>Okay fine 😭</h1>
          <p>Will you be my Valentine? 💖</p>

          <div className="row">
            <button className="btn yes" onClick={acceptFinal}>
              Yes ❤️
            </button>
          </div>

          <p className="hint">You passed all 10 challenges. There is no escape.</p>
        </div>
      </div>
    );
  }



  if (mode.kind === "accepted") {
    return (
      <div className="page">
        <div className="card">
          <h1 className="title">🩷 YAYYYYYYY!!!! 🩷</h1>
          <p className="subtitle">You're officially my Valentine 🥰😍</p>
        </div>
      </div>
    );
  }

  if (mode.kind === "challenge") {
    const id = mode.id;

    const challenge = (() => {
      switch (id) {
        case 1:
          return <C1TelportFurthest onPass={() => completeChallenge(1)} />
        case 2:
          return <C2FlashlightFind onPass={() => completeChallenge(2)} />
        case 3:
          return <C3Maze onPass={() => completeChallenge(3)} />
        case 4:
          return <C4Minesweeper onPass={() => completeChallenge(4)} />
        case 5:
          return <C5SPRStreak onPass={() => completeChallenge(5)} />
        case 6:
          return <C6HigherLower onPass={() => completeChallenge(6)} />
        case 7:
          return <C7Trolley onPass={() => completeChallenge(7)} />
        case 8:
          return <C8Suduko onPass={() => completeChallenge(8)} />
        case 9:
          return <C9Reaction onPass={() => completeChallenge(9)} />
        case 10:
          return <C10LoveMore onAdmit={fakeReject} />
      }
    })();

    return (
      <ChallengeShell id={id}>
        {challenge}
        <div className="row space">
          <button className="btn ghost" onClick={() => setMode({ kind: "question" })}>
            Back to question
          </button>
        </div>
      </ChallengeShell>
    );
  }

  return (
    <div className="page">
      <div className="card">
        <h1 className="title">Will you be my Valentine? 😘</h1>
        <div className="row">
          <button className="btn yes" onClick={() => setMode({ kind: "accepted" })}>🩷 Yes!</button>

          {!noDisabled ? (
            <button className="btn no" onClick={startNextChallenge}>No 🥲</button>
          ) : (
            <button className="btn no" disabled>No 🥲</button>
          )}
        </div>

        <div className="row space">
        </div>

      </div>
    </div>
  );
}