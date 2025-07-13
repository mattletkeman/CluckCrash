
import React, { useState, useEffect, useRef } from 'react';

const GameScreen = () => {
  const [multiplier, setMultiplier] = useState(1.0);
  const [isRunning, setIsRunning] = useState(false);
  const [crashed, setCrashed] = useState(false);
  const [credits, setCredits] = useState(100);
  const [crashPoint, setCrashPoint] = useState(0);
  const chickenRef = useRef(null);

  const jumpAudio = new Audio('/jump.mp3');
  const crashAudio = new Audio('/crash.mp3');

  useEffect(() => {
    if (isRunning) {
      const target = Math.random() < 0.95 ? Math.random() * 10 + 1 : Math.random() * 400 + 100;
      setCrashPoint(Number(target.toFixed(2)));

      const interval = setInterval(() => {
        setMultiplier((prev) => {
          const next = Number((prev + 0.05).toFixed(2));
          moveChicken(next);
          if (next >= crashPoint) {
            crashAudio.play();
            setCrashed(true);
            clearInterval(interval);
          }
          return next;
        });
      }, 100);
      return () => clearInterval(interval);
    }
  }, [isRunning]);

  const moveChicken = (multi) => {
    if (chickenRef.current) {
      chickenRef.current.style.transform = `translateX(${multi * 10}px)`;
      jumpAudio.play();
    }
  };

  const startGame = () => {
    setIsRunning(true);
    setMultiplier(1.0);
    setCrashed(false);
  };

  const cashout = () => {
    setIsRunning(false);
    const payout = Number((multiplier * 10).toFixed(2));
    setCredits((prev) => prev + payout);
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-black text-white">
      <h1 className="text-3xl font-bold mb-4">Cluck Crash</h1>
      <img ref={chickenRef} src="/chicken.png" alt="Chicken" className="w-24 transition-transform duration-100" />
      <div className="text-4xl my-4">x{multiplier.toFixed(2)}</div>
      {!isRunning ? (
        <button onClick={startGame} className="px-4 py-2 bg-green-600 rounded">Start</button>
      ) : (
        <button onClick={cashout} className="px-4 py-2 bg-yellow-500 rounded">Cashout</button>
      )}
      {crashed && <div className="text-red-500 text-xl mt-4">💥 CRASHED!</div>}
      <div className="mt-6">💰 Credits: {credits}</div>
    </div>
  );
};

export default GameScreen;
