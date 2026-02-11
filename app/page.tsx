"use client";

// Big animated heart with raining hearts
function BigHeart() {
  return (
    <div className="relative flex items-center justify-center w-full mb-2">
      <span className="big-heart-emoji animate-heart-pop">💗</span>
      <style jsx>{`
        .big-heart-emoji {
          font-size: 5.5rem;
          filter: drop-shadow(0 0 32px #f472b6cc) drop-shadow(0 0 8px #f472b6);
          animation: heart-beat 1.2s infinite cubic-bezier(.4,0,.2,1);
        }
        @keyframes heart-beat {
          0%, 100% { transform: scale(1); }
          10% { transform: scale(1.18); }
          20% { transform: scale(0.95); }
          30% { transform: scale(1.12); }
          50% { transform: scale(0.98); }
          70% { transform: scale(1.08); }
        }
        .animate-heart-pop {
          animation: heart-pop 0.7s cubic-bezier(.4,0,.2,1) 1;
        }
        @keyframes heart-pop {
          0% { transform: scale(0.2) rotate(-20deg); opacity: 0; }
          60% { transform: scale(1.2) rotate(10deg); opacity: 1; }
          100% { transform: scale(1) rotate(0deg); opacity: 1; }
        }
      `}</style>
      <RainingHearts allOverPage={true} />
    </div>
  );
}


import { useEffect, useRef, useState } from "react";

function RainingHearts({ allOverPage = false }: { allOverPage?: boolean }) {
  // Animated raining hearts background, random only on client
  const [hearts, setHearts] = useState<Array<{
    size: number;
    left: number;
    delay: number;
    duration: number;
    opacity: number;
  }>>([]);
  useEffect(() => {
    const arr = Array.from({ length: allOverPage ? 50 : 18 }, () => ({
      size: 22 + Math.random() * 18,
      left: Math.random() * 100,
      delay: Math.random() * (allOverPage ? 10 : 2),
      duration: 2.8 + Math.random() * (allOverPage ? 7.2 : 1.8),
      opacity: 0.7 + Math.random() * 0.3,
    }));
    setHearts(arr);
  }, [allOverPage]);
  return (
    <div className={`pointer-events-none absolute inset-0 z-10 ${allOverPage ? 'overflow-hidden' : 'overflow-visible'}`}>
      {hearts.map((h, i) => (
        <span
          key={i}
          className="raining-heart"
          style={{
            left: `${h.left}%`,
            fontSize: `${h.size}px`,
            animationDelay: `${h.delay}s`,
            animationDuration: `${h.duration}s`,
            opacity: h.opacity,
          }}
        >
          💖
        </span>
      ))}
      <style jsx>{`
        .raining-heart {
          position: absolute;
          top: -50px;
          pointer-events: none;
          animation: raining-heart-fall linear infinite;
        }
        @keyframes raining-heart-fall {
          to {
            top: 110vh;
            opacity: 0.1;
            transform: translateY(20px) scale(1.2) rotate(18deg);
          }
        }
      `}</style>
    </div>
  );
}



export default function Home() {
  const [showConfetti, setShowConfetti] = useState(false);
  const [showHearts, setShowHearts] = useState(false);
  const [answered, setAnswered] = useState(false);
  const yesBtnRef = useRef<HTMLButtonElement>(null);
  const noBtnRef = useRef<HTMLButtonElement>(null);


  // Improved No button movement: move away from cursor across the entire screen
  const moveNoButton = (e: React.MouseEvent) => {
    const btn = noBtnRef.current;
    if (!btn) return;

    // Use viewport dimensions for movement boundaries
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const btnRect = btn.getBoundingClientRect();
    
    const yesBtn = yesBtnRef.current;
    if (!yesBtn) return;
    const yesBtnRect = yesBtn.getBoundingClientRect();

    // Calculate a direction away from the mouse
    let dx = btnRect.left + btnRect.width / 2 - e.clientX;
    let dy = btnRect.top + btnRect.height / 2 - e.clientY;
    
    // Normalize and scale movement
    const dist = Math.sqrt(dx * dx + dy * dy) || 1;
    dx = (dx / dist) * 150 + (Math.random() - 0.5) * 50;
    dy = (dy / dist) * 150 + (Math.random() - 0.5) * 50;
    
    let newLeft = e.clientX + dx - btnRect.width / 2;
    let newTop = e.clientY + dy - btnRect.height / 2;

    // Prevent overlapping with the Yes button
    if (
      newLeft < yesBtnRect.right &&
      newLeft + btnRect.width > yesBtnRect.left &&
      newTop < yesBtnRect.bottom &&
      newTop + btnRect.height > yesBtnRect.top
    ) {
      newLeft += (newLeft > yesBtnRect.left ? 1 : -1) * (yesBtnRect.width / 2 + btnRect.width / 2 + 20);
      newTop += (newTop > yesBtnRect.top ? 1 : -1) * (yesBtnRect.height / 2 + btnRect.height / 2 + 20);
    }

    // Clamp to viewport bounds
    newLeft = Math.max(0, Math.min(viewportWidth - btnRect.width, newLeft));
    newTop = Math.max(0, Math.min(viewportHeight - btnRect.height, newTop));

    btn.style.position = "fixed";
    btn.style.left = `${newLeft}px`;
    btn.style.top = `${newTop}px`;
    
    // Make button unclickable while hovered
    btn.style.pointerEvents = "none";
    setTimeout(() => {
      if (btn) btn.style.pointerEvents = "auto";
    }, 350);
  };

  const handleYes = () => {
    setAnswered(true);
    setShowConfetti(true);
    setShowHearts(true);
    setTimeout(() => setShowConfetti(false), 2500);
    setTimeout(() => setShowHearts(false), 3500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-pink-100 font-sans">
      <RainingHearts allOverPage={true} />
      <div className="relative flex flex-col items-center justify-center bg-white rounded-3xl shadow-2xl p-10 w-[350px] h-[420px] border-4 border-pink-200">
        <div className="flex flex-col items-center w-full">
          <BigHeart />
          <h1 className="text-3xl font-extrabold text-pink-600 mb-8 text-center drop-shadow-lg mt-2">
            Will you be my Valentine?
          </h1>
        </div>
        {!answered && (
          <div className="relative w-full flex flex-row justify-center items-center gap-4 mt-8" style={{height: 120}}>
            <button
              ref={yesBtnRef}
              className="yes-btn px-8 py-3 rounded-full bg-pink-500 text-white text-xl font-bold shadow-lg hover:bg-pink-600 transition-all duration-200"
              onClick={handleYes}
            >
              Yes
            </button>
            <button
              ref={noBtnRef}
              className="no-btn px-8 py-3 rounded-full bg-white border-2 border-pink-400 text-pink-500 text-xl font-bold shadow hover:bg-pink-50 transition-all duration-200 select-none"
              onMouseEnter={moveNoButton}
              onMouseMove={moveNoButton}
              onClick={e => e.preventDefault()}
              tabIndex={-1}
              aria-disabled="true"
            >
              No
            </button>
          </div>
        )}
        {answered && (
          <div className="flex flex-col items-center mt-10">
            <span className="text-2xl text-pink-600 font-bold">Yay! 💖</span>
            <span className="text-lg text-pink-400 mt-2">Happy Valentine's Day!</span>
          </div>
        )}
        {showConfetti && <Confetti />}
        {showHearts && <Hearts />}
      </div>
    </div>
  );
}

function Confetti() {
  // Simple confetti animation using CSS
  return (
    <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden">
      {[...Array(30)].map((_, i) => (
        <span
          key={i}
          className="confetti"
          style={{
            left: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 0.5}s`,
            background: `hsl(${Math.random() * 360}, 90%, 80%)`,
          }}
        />
      ))}
      <style jsx>{`
        .confetti {
          position: absolute;
          top: -20px;
          width: 12px;
          height: 18px;
          border-radius: 3px;
          opacity: 0.85;
          animation: confetti-fall 2.5s linear forwards;
        }
        @keyframes confetti-fall {
          to {
            top: 110vh;
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
}

function Hearts() {
  // Floating hearts animation
  return (
    <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden">
      {[...Array(18)].map((_, i) => (
        <span
          key={i}
          className="heart"
          style={{
            left: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 1.5}s`,
          }}
        >
          💖
        </span>
      ))}
      <style jsx>{`
        .heart {
          position: absolute;
          top: 100vh;
          font-size: 2.2rem;
          opacity: 0.85;
          animation: heart-float 3.2s cubic-bezier(.4,0,.2,1) forwards;
        }
        @keyframes heart-float {
          to {
            top: -10vh;
            transform: scale(1.3) rotate(-20deg);
            opacity: 0.2;
          }
        }
      `}</style>
    </div>
  );
}
