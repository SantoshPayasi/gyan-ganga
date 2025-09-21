"use client";

import { createContext, useCallback, useContext, useRef, useState } from "react";
import ReactCanvasConfetti from "react-canvas-confetti";
import { TCanvasConfettiInstance } from "react-canvas-confetti/dist/types";

type ConfettiContextType = {
    triggerConfetti: () => void;
    ready: boolean;
};

const ConfettiContext = createContext<ConfettiContextType | null>(null);

export function ConfettiProvider({ children }: { children: React.ReactNode }) {
    const refAnimationInstance = useRef<TCanvasConfettiInstance | null>(null);
    const [ready, setReady] = useState(false);

    const getInstance = useCallback(({ confetti }: { confetti: TCanvasConfettiInstance }) => {
        refAnimationInstance.current = confetti;
        setReady(true);
    }, []);

    const makeShot = useCallback((particleRatio: number, opts: any) => {
        if (refAnimationInstance.current) {
            refAnimationInstance.current({
                ...opts,
                origin: { y: 0.7 },
                particleCount: Math.floor(200 * particleRatio),
            });
        }
    }, []);

    const triggerConfetti = useCallback(() => {
        if (!refAnimationInstance.current) return;

        makeShot(0.25, { spread: 26, startVelocity: 55 });
        makeShot(0.2, { spread: 60 });
        makeShot(0.35, { spread: 100, decay: 0.91, scalar: 0.8 });
        makeShot(0.1, { spread: 120, startVelocity: 25, decay: 0.92, scalar: 1.2 });
        makeShot(0.1, { spread: 120, startVelocity: 45 });
    }, [makeShot]);

    return (
        <ConfettiContext.Provider value={{ triggerConfetti, ready }}>
            {children}
            <ReactCanvasConfetti
                onInit={getInstance}
                style={{
                    position: "fixed",
                    pointerEvents: "none",
                    width: "100%",
                    height: "100%",
                    top: 0,
                    left: 0,
                }}
            />
        </ConfettiContext.Provider>
    );
}

export function useConfetti() {
    const ctx = useContext(ConfettiContext);
    if (!ctx) {
        throw new Error("useConfetti must be used within a ConfettiProvider");
    }
    return ctx;
}
