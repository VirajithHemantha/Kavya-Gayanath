import React, { useState, ReactNode, useEffect, useRef } from "react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useSpring,
  useMotionValue,
  useTransform,
} from "motion/react";
import {
  HelpCircle,
  MapPin,
  Clock,
  Heart,
  CheckCircle2,
  Flower2,
  Volume2,
  VolumeX,
  Sparkles,
} from "lucide-react";

// FlipCard Component with 3D Tilt Effect + Premium Mobile Tap Hint
function FlipCard({
  front,
  back,
  className,
  containerClassName,
  rounded = "rounded-[2rem]",
  ...motionProps
}: {
  front: ReactNode;
  back: ReactNode;
  className?: string;
  containerClassName?: string;
  rounded?: string;
  [key: string]: any;
}) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const rotateX = useTransform(y, [-100, 100], [15, -15]);
  const rotateY = useTransform(x, [-100, 100], [-15, 15]);

  const springConfig = { damping: 20, stiffness: 300 };
  const springRotateX = useSpring(rotateX, springConfig);
  const springRotateY = useSpring(rotateY, springConfig);

  useEffect(() => {
    const mql = window.matchMedia("(hover: none) and (pointer: coarse)");

    const update = () => setIsTouchDevice(mql.matches);
    update();

    // Safari iOS compatibility
    if (typeof mql.addEventListener === "function") mql.addEventListener("change", update);
    else (mql as any).addListener?.(update);

    return () => {
      if (typeof mql.removeEventListener === "function") mql.removeEventListener("change", update);
      else (mql as any).removeListener?.(update);
    };
  }, []);

  function handleMouseMove(event: React.MouseEvent<HTMLDivElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    x.set(event.clientX - centerX);
    y.set(event.clientY - centerY);
  }

  function handleMouseLeave() {
    x.set(0);
    y.set(0);
    setIsFlipped(false);
  }

  function handleClick(event: React.MouseEvent<HTMLDivElement>) {
    const target = event.target as HTMLElement | null;
    if (target?.closest("[data-no-flip]")) return;

    setIsFlipped((prev) => !prev);
  }

  return (
    <motion.div
      {...motionProps}
      ref={cardRef}
      className={`perspective-1000 cursor-pointer relative ${containerClassName || ""}`}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => {
        if (!isTouchDevice) setIsFlipped(true);
      }}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
      style={{
        rotateX: isFlipped ? 0 : springRotateX,
        rotateY: isFlipped ? 0 : springRotateY,
      }}
    >
      <motion.div
        initial={false}
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
        className={`w-full h-full transform-style-3d relative ${className || ""}`}
        style={{ WebkitTransformStyle: "preserve-3d" }}
      >
        {/* Front */}
          <div
          className={`absolute inset-0 backface-hidden flip-face w-full h-full ${rounded} overflow-hidden shadow-2xl border border-sage/40 ring-1 ring-black/5`}
          style={{ transform: "rotateY(0deg) translateZ(1px)", WebkitTransform: "rotateY(0deg) translateZ(1px)" }}
        >
          {front}
          <div className="absolute top-3 left-3 w-6 h-6 border-t border-l border-white/30 rounded-tl-lg" />
          <div className="absolute bottom-3 right-3 w-6 h-6 border-b border-r border-white/30 rounded-br-lg" />
        </div>

        {/* Back */}
        <div
          style={{ transform: "rotateY(180deg) translateZ(1px)", WebkitTransform: "rotateY(180deg) translateZ(1px)" }}
          className={`absolute inset-0 backface-hidden flip-face w-full h-full bg-paper border border-sage/20 ${rounded} flex flex-col justify-center items-center text-center p-3 md:p-8 shadow-2xl overflow-hidden`}
        >
          <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/paper-fibers.png')] pointer-events-none" />
          <div className="absolute top-5 left-5 w-10 h-10 border-t-2 border-l-2 border-sage/10 rounded-tl-xl" />
          <div className="absolute bottom-5 right-5 w-10 h-10 border-b-2 border-r-2 border-sage/10 rounded-br-xl" />
          <div className="relative z-10 w-full h-full flex flex-col py-4 overflow-y-auto overflow-x-hidden ios-scroll">{back}</div>
        </div>
      </motion.div>

      <AnimatePresence>
        {isTouchDevice && !isFlipped && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 6, transition: { duration: 0.4 } }}
            transition={{ duration: 0.4 }}
            className="absolute bottom-3 left-0 right-0 flex justify-center pointer-events-none z-50"
          >
            <motion.div
              animate={{ y: [0, -5, 0] }}
              transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
              className="flex items-center gap-2 bg-black/35 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/25 shadow-xl"
            >
              <span className="relative flex items-center justify-center w-4 h-4 shrink-0">
                <motion.span
                  animate={{ scale: [1, 2.2], opacity: [0.7, 0] }}
                  transition={{ repeat: Infinity, duration: 1.1, ease: "easeOut" }}
                  className="absolute inset-0 rounded-full bg-white/70"
                />
                <span className="relative w-2 h-2 rounded-full bg-white shadow-sm" />
              </span>
              <span
                className="text-white text-[9px] uppercase tracking-[0.2em] font-bold whitespace-nowrap"
                style={{ fontFamily: "Inter, sans-serif", letterSpacing: "0.18em" }}
              >
                Tap to reveal
              </span>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function RealisticPetal({ size = 20, className = "" }: { size?: number; className?: string }) {
  const organicPetal = "M15 30C15 30 0 25 0 15C0 5 10 0 15 0C20 0 30 5 30 15C30 25 15 30 15 30Z";

  return (
    <motion.div
      animate={{
        rotateX: [0, 45, -45, 0],
        rotateY: [0, 180, 360],
      }}
      transition={{
        duration: 3 + Math.random() * 2,
        repeat: Infinity,
        ease: "easeInOut",
      }}
      style={{ width: size, height: size }}
      className={className}
    >
      <svg width="100%" height="100%" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <radialGradient id="petalGrad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#D4AF37" stopOpacity="0.95" />
            <stop offset="60%" stopColor="#BF953F" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#785E1E" stopOpacity="0.7" />
          </radialGradient>
        </defs>
        <path
          d={organicPetal}
          fill="url(#petalGrad)"
          style={{ filter: "drop-shadow(0px 2px 2px rgba(0,0,0,0.05))" }}
        />
      </svg>
    </motion.div>
  );
}

type Attendance = "yes" | "no";

function RSVPForm({ guestName }: { guestName: string }) {
  const endpoint = (import.meta as any).env?.VITE_RSVP_ENDPOINT as string | undefined;

  const [attendance, setAttendance] = useState<Attendance>("yes");
  const [submitting, setSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const isAttending = attendance === "yes";

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setSuccessMessage(null);
    setErrorMessage(null);

    if (!endpoint) {
      setErrorMessage("RSVP saving is not configured yet (missing VITE_RSVP_ENDPOINT).");
      return;
    }

    const payload = {
      type: "rsvp",
      attendance,
      partyType: "individual",
      guestCount: isAttending ? 1 : 0,
      guests: [{ name: guestName }],
      submittedAt: new Date().toISOString(),
    };

    setSubmitting(true);
    try {
      // Try JSON request first
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error(String(res.status));
      setSuccessMessage("RSVP saved. Thank you!");
    } catch {
      try {
        // Fallback for Apps Script deployments
        const fd = new FormData();
        fd.append("payload", JSON.stringify(payload));
        await fetch(endpoint, { method: "POST", mode: "no-cors", body: fd });
        setSuccessMessage("RSVP submitted. Thank you!");
      } catch {
        setErrorMessage("Could not submit RSVP. Please try again.");
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div data-no-flip className="w-full cursor-auto">
      <CheckCircle2 size={24} className="text-sage mb-2 md:mb-4 mx-auto opacity-70 md:w-8 md:h-8" />
      <h4 className="serif text-2xl md:text-3xl text-sage mb-2 md:mb-3 text-center">RSVP</h4>
      <p className="text-[10px] md:text-xs text-stone-400 uppercase tracking-widest mb-4 md:mb-6 text-center leading-relaxed">
        Please let us know by
        <br />
        <span className="font-bold">15th September</span>
      </p>

      <form onSubmit={submit} className="space-y-4 md:space-y-4 px-1 md:px-2">
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            data-no-flip
            onClick={() => setAttendance("yes")}
            className={`py-3 md:py-2.5 rounded-xl text-[10px] md:text-xs uppercase tracking-widest font-bold border transition-colors ${attendance === "yes" ? "gold-gradient-bg text-paper border-sage" : "bg-sand/40 text-sage border-sand/30"
              }`}
          >
            Attending
          </button>
          <button
            type="button"
            data-no-flip
            onClick={() => setAttendance("no")}
            className={`py-3 md:py-2.5 rounded-xl text-[10px] md:text-xs uppercase tracking-widest font-bold border transition-colors ${attendance === "no" ? "bg-stone-800 text-white border-stone-800" : "bg-sand/40 text-stone-400 border-sand/30"
              }`}
          >
            Not Attending
          </button>
        </div>

        {errorMessage && <p className="text-[10px] md:text-xs text-red-700 font-semibold">{errorMessage}</p>}
        {successMessage && <p className="text-[10px] md:text-xs text-sage font-bold">{successMessage}</p>}

        <button
          type="submit"
          data-no-flip
          disabled={submitting}
          className="w-full gold-gradient-bg shimmer text-paper py-3 md:py-3 rounded-xl text-[10px] md:text-xs uppercase tracking-widest font-bold disabled:opacity-60 shadow-lg shadow-gold/20"
        >
          {submitting ? "Submitting..." : "Submit RSVP"}
        </button>

        {!endpoint && (
          <p className="text-[10px] md:text-[10px] text-zinc-500 leading-relaxed">
            Admin setup needed: set <span className="font-bold">VITE_RSVP_ENDPOINT</span> to your Google Apps Script URL.
          </p>
        )}
      </form>
    </div>
  );
}



export default function App() {
  const [isFlapOpen, setIsFlapOpen] = useState(false);
  const [isOpened, setIsOpened] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [guestName, setGuestName] = useState("YOU");
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const guest = params.get("guest");
    if (guest) {
      setGuestName(guest);
    }
  }, []);

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 640px)");
    const updateSize = () => setIsSmallScreen(mediaQuery.matches);
    updateSize();
    if (typeof mediaQuery.addEventListener === "function") {
      mediaQuery.addEventListener("change", updateSize);
      return () => mediaQuery.removeEventListener("change", updateSize);
    }

    // iOS Safari < 14
    mediaQuery.addListener(updateSize);
    return () => mediaQuery.removeListener(updateSize);
  }, []);

  useEffect(() => {
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updateMotion = () => setPrefersReducedMotion(motionQuery.matches);
    updateMotion();
    if (typeof motionQuery.addEventListener === "function") {
      motionQuery.addEventListener("change", updateMotion);
      return () => motionQuery.removeEventListener("change", updateMotion);
    }
    motionQuery.addListener(updateMotion);
    return () => motionQuery.removeListener(updateMotion);
  }, []);

  const isIOS =
    typeof navigator !== "undefined" &&
    (/iP(hone|od|ad)/.test(navigator.userAgent) || (navigator.platform === "MacIntel" && (navigator as any).maxTouchPoints > 1));

  const reduceEffects = prefersReducedMotion || isIOS;

  const handleOpen = () => {
    setIsFlapOpen(true);
    setIsMuted(false); // Auto-play the background music
    setTimeout(() => {
      setIsOpened(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, 1200);
  };

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.muted = isMuted;

    if (isMuted) {
      audio.pause();
      return;
    }

    const playPromise = audio.play();
    if (playPromise && typeof playPromise.catch === "function") {
      playPromise.catch(() => {
        // iOS/Safari may block playback until a user gesture; the button tap will retry.
      });
    }
  }, [isMuted]);

  return (
    <div
      className="min-h-screen bg-paper text-zinc-800 selection:bg-sage/40 overflow-x-hidden relative"
    >
      <audio ref={audioRef} src="/young_and_beautiful.mp3" loop preload="auto" />

      <motion.div className="fixed top-0 left-0 right-0 h-1 bg-sage origin-left z-[1000]" style={{ scaleX }} />

      <motion.button
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsMuted((m) => !m)}
        className="fixed bottom-6 right-6 z-[500] w-12 h-12 rounded-full gold-gradient-bg shimmer text-paper shadow-2xl flex items-center justify-center backdrop-blur-md border border-white/20"
      >
        {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} className="animate-pulse" />}
      </motion.button>

      <AnimatePresence>
        {!isOpened && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.8, delay: 0.5 } }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 overflow-hidden bg-paper"
          >
            {/* Background Image */}
            <div className="absolute inset-0 z-0">
              <img src="/hero-bg.png" alt="Background" className="w-full h-full object-cover" />
            </div>

            {/* Top Text Section */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.5, delay: 0.2, ease: "easeOut" }}
              className="absolute top-12 sm:top-16 md:top-24 left-1/2 -translate-x-1/2 w-full max-w-3xl text-center z-10 px-4 py-4"
            >
              {/* Soft glow behind text for readability */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[95%] md:w-[75%] h-[130%] bg-paper/80 blur-3xl rounded-[100%] pointer-events-none z-0" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] md:w-[60%] h-[100%] bg-white/70 blur-2xl rounded-[100%] pointer-events-none z-0" />
              
              <div className="relative z-10">
                <div className="flex items-center justify-center mb-2 md:mb-4">
                  <div className="w-16 h-[1px] bg-sage/50 shadow-[0_0_5px_rgba(255,255,255,1)]"></div>
                  <svg viewBox="0 0 24 24" className="mx-3 text-sage/80 w-5 h-5 md:w-6 md:h-6 drop-shadow-[0_0_5px_rgba(255,255,255,1)]" fill="currentColor">
                    <path d="M12 2L13 8L19 9L14 13L15 19L12 15L9 19L10 13L5 9L11 8L12 2Z" />
                  </svg>
                  <div className="w-16 h-[1px] bg-sage/50 shadow-[0_0_5px_rgba(255,255,255,1)]"></div>
                </div>
                
                <h1 className="serif text-[2.5rem] sm:text-5xl md:text-[5rem] text-sage font-medium tracking-[0.05em] md:tracking-[0.1em] drop-shadow-[0_2px_15px_rgba(255,255,255,1)] leading-tight mt-1 mb-2 md:mt-2 md:mb-4">
                  Kavya &amp; Gayanath
                </h1>
                
                <div className="flex items-center justify-center mt-3 mb-4 md:mt-6 md:mb-6">
                  <div className="w-16 h-[1px] bg-sage/50 shadow-[0_0_5px_rgba(255,255,255,1)]"></div>
                  <svg viewBox="0 0 24 24" className="mx-3 text-sage/80 w-5 h-5 md:w-6 md:h-6 rotate-180 drop-shadow-[0_0_5px_rgba(255,255,255,1)]" fill="currentColor">
                    <path d="M12 2L13 8L19 9L14 13L15 19L12 15L9 19L10 13L5 9L11 8L12 2Z" />
                  </svg>
                  <div className="w-16 h-[1px] bg-sage/50 shadow-[0_0_5px_rgba(255,255,255,1)]"></div>
                </div>
                
                <p className="text-[10px] md:text-sm uppercase tracking-[0.4em] text-sage font-bold drop-shadow-[0_1px_8px_rgba(255,255,255,1)]">
                  11 DECEMBER 2026
                </p>
              </div>
            </motion.div>

            <motion.div
              layoutId="envelope-box"
              style={{ perspective: 1500 }}
              animate={!reduceEffects && !isFlapOpen ? { y: [0, -10, 0] } : {}}
              transition={!reduceEffects ? { duration: 4, repeat: Infinity, ease: "easeInOut" } : { duration: 0 }}
              className="relative w-full max-w-2xl h-80 md:h-[450px] rounded-[2.25rem] shadow-[0_34px_80px_-22px_rgba(61,9,16,0.6)] flex flex-col items-center justify-center z-10 overflow-hidden mt-16 sm:mt-20 md:mt-24 border border-terra/30"
            >
              {/* premium envelope material */}
              <div className="absolute inset-0 bg-gradient-to-br from-sand via-sage/60 to-terra/40 shadow-[inset_0_-10px_40px_rgba(61,9,16,0.6)]" />
              <div className="absolute inset-0 opacity-25 bg-[url('https://www.transparenttextures.com/patterns/paper-fibers.png')] pointer-events-none" />
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-black/25 pointer-events-none" />
              <div className="absolute inset-[8px] rounded-[1.8rem] border border-terra/40 pointer-events-none" />
              <div className="absolute inset-[14px] rounded-[1.55rem] border border-terra/30 pointer-events-none" />
              {!reduceEffects && (
                <motion.div
                  animate={{ opacity: [0.18, 0.32, 0.18], scale: [1, 1.04, 1] }}
                  transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute -top-20 left-1/2 -translate-x-1/2 w-[520px] h-[260px] bg-paper/15 blur-3xl rounded-full pointer-events-none"
                />
              )}

              <div className="absolute inset-0 flex flex-col items-center justify-center pb-32 md:pb-40 space-y-4 md:space-y-6 z-25">
                <span className="serif text-white font-bold text-lg md:text-3xl tracking-[0.4em] md:tracking-[0.6em] uppercase text-center px-4 drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">
                  The Invitation
                </span>
                <div className="w-10 md:w-16 h-px bg-white/40" />
              </div>

              <div className="absolute bottom-0 left-0 right-0 h-[65%] bg-black/10 clip-path-envelope-bottom pointer-events-none rounded-b-[2rem]" />
              <div className="absolute bottom-0 left-0 right-0 h-[65%] bg-gradient-to-t from-terra/50 via-terra/10 to-transparent clip-path-envelope-bottom pointer-events-none rounded-b-[2rem]" />

              <motion.div
                initial={{ rotateX: 0 }}
                animate={{ rotateX: isFlapOpen ? 180 : 0, opacity: isFlapOpen ? 0 : 1 }}
                transition={{ duration: 1, ease: [0.3, 0.1, 0.2, 1] }}
                style={{ transformOrigin: "top", backfaceVisibility: "hidden" }}
                className="absolute top-0 left-0 right-0 h-[55%] drop-shadow-[0_15px_30px_rgba(61,9,16,0.6)] z-20 rounded-t-[2.25rem] clip-path-envelope flex flex-col items-center justify-start overflow-hidden pt-8 pointer-events-none"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-sand via-sage/50 to-terra/30" />
                <div className="absolute inset-0 opacity-22 bg-[url('https://www.transparenttextures.com/patterns/paper-fibers.png')] pointer-events-none" />
                <div className="absolute inset-0 bg-gradient-to-b from-white/10 via-transparent to-black/25" />
                <div className="absolute top-0 left-0 right-0 h-[2px] bg-terra/40" />
              </motion.div>

              {!isFlapOpen && (
                <motion.div
                  initial={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.8, opacity: 0 }}
                  transition={{ duration: 0.4 }}
                  className="absolute inset-0 z-30 flex flex-col items-center justify-center cursor-pointer"
                  onClick={handleOpen}
                >
                  <motion.div
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={!reduceEffects ? { repeat: Infinity, duration: 3, ease: "easeInOut" } : { duration: 0 }}
                    className="flex flex-col items-center gap-4 mt-8 md:mt-12 group"
                  >
                    <div className="w-24 h-24 md:w-32 md:h-32 rounded-full shadow-[0_18px_50px_-18px_rgba(0,0,0,0.65)] flex items-center justify-center relative group-hover:scale-105 transition-transform duration-500 bg-paper/10 border border-white/30 p-1.5 backdrop-blur-md">
                      <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white/14 via-transparent to-umber/25 pointer-events-none" />
                      <div className="w-full h-full rounded-full bg-gradient-to-br from-sienna via-sage to-taupe shadow-[inset_0_-8px_18px_rgba(0,0,0,0.28),0_8px_18px_rgba(0,0,0,0.22)] flex items-center justify-center border border-white/14 relative overflow-hidden">
                        <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-20 h-12 bg-paper/25 blur-2xl rounded-full" />
                        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_35%_30%,rgba(255,255,255,0.35)_0%,transparent_55%)]" />
                        <Heart className="relative text-paper/90 w-10 h-10 md:w-14 md:h-14 drop-shadow-md mt-1" fill="currentColor" />
                      </div>
                    </div>

                    <motion.div
                      animate={!reduceEffects ? { y: [0, 5, 0] } : { y: 0 }}
                      transition={!reduceEffects ? { repeat: Infinity, duration: 2, ease: "easeInOut" } : { duration: 0 }}
                    >
                      <p className="serif text-white/75 tracking-[0.32em] uppercase text-[10px] md:text-xs whitespace-nowrap">
                        Tap to break seal
                      </p>
                    </motion.div>
                  </motion.div>
                </motion.div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-paper/90 via-sand/20 to-paper/90" />
      </div>

      <motion.main
        initial={false}
        animate={isOpened ? { opacity: 1, y: 0 } : { opacity: 0, y: 100 }}
        transition={{ duration: 1.2, delay: 0.5, ease: "easeOut" }}
        className="max-w-[1600px] mx-auto px-4 py-10 sm:py-12 md:px-12 md:py-24 flex flex-col gap-10 md:gap-16 relative z-10 min-h-screen"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={isOpened ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
          transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1], delay: 0.8 }}
          className="text-center space-y-4 md:space-y-8 mt-4 md:mt-12"
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isOpened ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ delay: 1, duration: 1 }}
            className="flex items-center justify-center gap-4 text-sage/60"
          >
            <div className="h-px w-8 md:w-16 bg-current opacity-30" />
            <p className="text-[10px] md:text-sm uppercase tracking-[0.6em] font-bold">With joy in our hearts</p>
            <div className="h-px w-8 md:w-16 bg-current opacity-30" />
          </motion.div>

          <h1 className="flex flex-col items-center px-2">
            <span className="serif italic text-3xl sm:text-5xl md:text-[8rem] gold-gradient-text font-light leading-tight drop-shadow-sm mb-1 md:mb-6">
              You're Invited!
            </span>
            <span className="serif text-sm sm:text-base md:text-4xl gold-gradient-text tracking-[0.15em] md:tracking-[0.3em] uppercase font-light">
              to the wedding of
            </span>
          </h1>

          <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2 sm:gap-4 md:gap-8 mt-4 md:mt-8 relative w-full px-2">
            <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-32 bg-sage/5 blur-3xl rounded-full" />

            <div className="flex justify-end">
              <motion.h2 whileHover={{ scale: 1.05 }} className="script text-[12vw] sm:text-6xl md:text-[7rem] gold-gradient-text shimmer drop-shadow-lg relative z-10 leading-relaxed px-1">
                Kavya
              </motion.h2>
            </div>

            <div className="relative flex items-center justify-center shrink-0">
              <div className="h-px w-6 md:w-24 bg-sage/20 hidden md:block" />
              <div className="relative mx-1 md:mx-4 flex items-center">
                <Heart className="text-sage/40 w-5 h-5 sm:w-7 sm:h-7 md:w-10 md:h-10 animate-pulse" fill="currentColor" />
                <motion.div
                  animate={{ scale: [1, 1.5, 1], opacity: [0, 1, 0] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                  className="absolute inset-0 bg-sage/20 blur-xl rounded-full"
                />
              </div>
              <div className="h-px w-6 md:w-24 bg-sage/20 hidden md:block" />
            </div>

            <div className="flex justify-start">
              <motion.h2 whileHover={{ scale: 1.05 }} className="script text-[12vw] sm:text-6xl md:text-[7rem] gold-gradient-text shimmer drop-shadow-lg relative z-10 leading-relaxed px-1">
                Gayanath
              </motion.h2>
            </div>
          </div>

          <div className="w-24 md:w-32 h-px bg-gradient-to-r from-transparent via-sage/40 to-transparent mx-auto mt-8" />
        </motion.div>

        {/* Updated premium envelope section */}
        <div className="flex justify-center w-full mb-8">
          {!isOpened ? (
            <div className="w-full max-w-3xl relative h-[340px] sm:h-[380px] md:h-[460px]" />
          ) : (
            <motion.div
              layoutId="envelope-box"
              transition={{ duration: 1.2, ease: [0.4, 0, 0.2, 1] }}
              className="w-full max-w-4xl relative cursor-default"
              style={{
                height: isSmallScreen ? "520px" : "clamp(420px, 52vw, 620px)",
              }}
            >
              {/* ambient depth */}
              <motion.div
                animate={{ scale: [1, 1.08, 1], opacity: [0.28, 0.45, 0.28] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                className="absolute inset-x-6 sm:inset-x-10 top-[24%] h-44 sm:h-52 bg-sage/25 blur-[70px] rounded-full pointer-events-none z-0"
              />
              <div className="absolute inset-x-10 top-[18%] h-20 bg-sage/12 blur-[50px] rounded-full pointer-events-none z-0" />

              {/* floating dust glow */}
              <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
                {[...Array(10)].map((_, i) => (
                  <motion.div
                    key={`envelope-speck-${i}`}
                    className={`absolute rounded-full ${i % 2 === 0 ? "bg-sand" : "bg-sage"}`}
                    style={{
                      width: `${Math.random() * 6 + 3}px`,
                      height: `${Math.random() * 6 + 3}px`,
                      left: `${Math.random() * 100}%`,
                      top: `${Math.random() * 60 + 8}%`,
                      opacity: 0.12,
                      filter: "blur(1px)",
                    }}
                    animate={{
                      y: [0, -18, 0],
                      x: [0, (Math.random() - 0.5) * 14, 0],
                      opacity: [0.08, 0.2, 0.08],
                    }}
                    transition={{
                      duration: 4 + Math.random() * 4,
                      repeat: Infinity,
                      delay: Math.random() * 3,
                      ease: "easeInOut",
                    }}
                  />
                ))}
              </div>

              {/* envelope body back */}
              <div className="absolute bottom-0 left-0 right-0 h-[64%] sm:h-[66%] md:h-[68%] rounded-b-[2.5rem] overflow-hidden z-10 shadow-[0_24px_70px_-12px_rgba(61,34,21,0.55)]">
                <div className="absolute inset-0 bg-gradient-to-b from-umber via-taupe/40 to-sienna/50" />
                <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/paper-fibers.png')]" />
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-umber/25" />
                <div className="absolute inset-x-0 top-0 h-[2px] bg-terra/20" />
                <div className="absolute inset-x-10 top-3 h-px bg-terra/15" />
                <div className="absolute bottom-0 left-0 right-0 h-px bg-white/10" />
                <div className="absolute top-0 bottom-0 left-0 w-px bg-terra/15" />
                <div className="absolute top-0 bottom-0 right-0 w-px bg-terra/15" />
                <div className="absolute bottom-5 left-0 right-0 flex flex-col items-center gap-1 pointer-events-none">
                  <div className="w-16 h-px bg-sand/45" />
                  <p className="serif italic text-sand/55 text-[10px] tracking-[0.4em] uppercase">Official Invite · 2026</p>
                  <div className="w-16 h-px bg-sand/45" />
                </div>
              </div>

              {/* opened flap */}
              <div
                className="absolute left-0 right-0 z-10 pointer-events-none overflow-hidden"
                style={{
                  bottom: isSmallScreen ? "62.5%" : "66.2%",
                  height: isSmallScreen ? "33%" : "40%",
                }}
              >
                <div
                  className="absolute inset-0 bg-gradient-to-br from-umber/95 via-taupe/70 to-sienna/70"
                  style={{
                    clipPath: "polygon(0 100%, 50% 0, 100% 100%)",
                  }}
                >
                  <div className="absolute inset-0 opacity-25 bg-[url('https://www.transparenttextures.com/patterns/paper-fibers.png')]" />
                  <div className="absolute inset-0 bg-gradient-to-b from-white/10 via-white/0 to-transparent" />
                </div>

                <div
                  className="absolute inset-0 bg-gradient-to-br from-taupe via-sage to-taupe/80"
                  style={{
                    clipPath: "polygon(3% 100%, 50% 10%, 97% 100%)",
                  }}
                >
                  <div className="absolute inset-0 opacity-30 bg-[url('https://www.transparenttextures.com/patterns/paper-fibers.png')]" />
                  <div className="absolute inset-0 bg-gradient-to-b from-white/20 via-white/0 to-transparent" />
                </div>

                <div className="absolute bottom-0 left-0 right-0 h-4 bg-gradient-to-t from-umber/35 to-transparent" />
              </div>

              {/* invitation card */}
              <motion.div
                initial={{ y: 120, opacity: 0 }}
                animate={{
                  y: isSmallScreen ? -46 : -58,
                  opacity: 1,
                }}
                transition={{ duration: 1.4, delay: 0.9, ease: [0.22, 1, 0.36, 1] }}
                className="absolute left-3 right-3 sm:left-6 sm:right-6 md:left-16 md:right-16 z-20"
                style={{
                  bottom: isSmallScreen ? "30%" : "33%",
                  top: "auto",
                }}
              >
                <div className="absolute -bottom-4 left-6 right-6 h-10 bg-umber/20 blur-xl rounded-full" />

                <div className="relative bg-paper rounded-[1.6rem] md:rounded-[2rem] shadow-[0_-20px_60px_rgba(0,0,0,0.16),0_10px_30px_rgba(0,0,0,0.08)] border border-terra/30 overflow-hidden">
                  <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute inset-0 opacity-30 bg-[url('https://www.transparenttextures.com/patterns/natural-paper.png')]" />
                    <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-48 h-24 bg-terra/5 blur-3xl rounded-full" />
                    <div className="absolute inset-[10px] border border-terra/20 rounded-[1.1rem] md:rounded-xl" />
                    <div className="absolute inset-[16px] border border-terra/15 rounded-[0.9rem] md:rounded-lg" />

                    {[
                      ["top-3 left-3", "rotate-0"],
                      ["top-3 right-3", "rotate-90"],
                      ["bottom-3 left-3", "-rotate-90"],
                      ["bottom-3 right-3", "rotate-180"],
                    ].map(([pos, rot], i) => (
                      <div key={i} className={`absolute ${pos} w-7 h-7`}>
                        <svg viewBox="0 0 28 28" fill="none" className={`w-full h-full ${rot} opacity-40`}>
                          <path d="M2 2 C2 2, 14 2, 14 14" stroke="rgb(156 132 112)" strokeWidth="0.8" fill="none" />
                          <path d="M2 2 C8 2, 2 8, 2 14" stroke="rgb(156 132 112)" strokeWidth="0.8" fill="none" />
                          <circle cx="4" cy="4" r="1.2" fill="#3D0910" opacity="0.6" />
                          <path d="M6 2 C6 2, 6 6, 10 6" stroke="#3D0910" strokeWidth="0.6" fill="none" opacity="0.6" />
                        </svg>
                      </div>
                    ))}

                    <motion.div
                      animate={{ x: ["-100%", "200%"] }}
                      transition={{ repeat: Infinity, duration: 4.6, delay: 2, ease: "easeInOut" }}
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/12 to-transparent skew-x-12"
                    />
                  </div>

                  {/* content */}
                  <div className="relative z-10 px-4 pt-5 pb-4 sm:px-6 sm:pt-7 sm:pb-7 md:px-10 md:py-8 flex flex-col items-center text-center gap-0 sm:gap-2 md:gap-3">
                    {/* top ornament */}
                    <div className="flex items-center gap-3 w-full max-w-[240px]">
                      <div className="flex-1 h-px bg-gradient-to-r from-transparent to-taupe/55" />
                      <motion.div
                        animate={{ rotate: [0, 10, -10, 0] }}
                        transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
                      >
                        <svg viewBox="0 0 16 16" className="w-3 h-3 opacity-50 text-sage" fill="currentColor">
                          <path d="M8 0 L9.5 6.5 L16 8 L9.5 9.5 L8 16 L6.5 9.5 L0 8 L6.5 6.5 Z" />
                        </svg>
                      </motion.div>
                      <div className="flex-1 h-px bg-gradient-to-l from-transparent to-taupe/55" />
                    </div>



                    {/* hosting families */}
                    <div className="space-y-0.5 mt-4">
                      <p className="text-[8px] sm:text-[9px] md:text-[11px] uppercase tracking-[0.3em] text-sage font-bold leading-relaxed">
                        The Daughter of Mr. &amp; Mrs. Atapattu
                      </p>
                      <p className="text-[7px] sm:text-[8px] md:text-[9px] uppercase tracking-[0.25em] text-stone-600 font-medium">
                        and
                      </p>
                      <p className="text-[8px] sm:text-[9px] md:text-[11px] uppercase tracking-[0.3em] text-sage font-bold leading-relaxed">
                        The Son of Mr. &amp; Mrs. Chandrasena
                      </p>
                    </div>

                    <p className="text-[7px] sm:text-[8px] md:text-[9px] uppercase tracking-[0.2em] text-stone-600 font-medium leading-relaxed max-w-[220px] md:max-w-sm mt-3">
                      CORDIALLY INVITE<br/>
                      <span className="block my-2 text-terra drop-shadow-md text-[10px] sm:text-xs md:text-sm font-bold tracking-[0.3em]">{guestName}</span>
                      TO CELEBRATE<br/>
                      THE WEDDING OF
                    </p>

                    {/* couple names */}
                    <div className="flex flex-col md:flex-row items-center justify-center gap-1 md:gap-4 max-w-full px-4 mt-2">
                      <span className="script text-[22px] sm:text-[28px] md:text-[36px] gold-gradient-text shimmer drop-shadow-sm leading-[1.6] px-2">
                        Kavya
                      </span>
                      <span className="text-sage/80 text-sm md:text-xl font-serif">&amp;</span>
                      <span className="script text-[22px] sm:text-[28px] md:text-[36px] gold-gradient-text shimmer drop-shadow-sm leading-[1.6] px-2">
                        Gayanath
                      </span>
                    </div>



                    {/* bottom ornament */}
                    <div className="flex items-center gap-3 w-full max-w-[240px]">
                      <div className="flex-1 h-px bg-gradient-to-r from-transparent to-taupe/55" />
                      <svg viewBox="0 0 16 16" className="w-3 h-3 opacity-40 text-sage" fill="currentColor">
                        <path d="M8 0 L9.5 6.5 L16 8 L9.5 9.5 L8 16 L6.5 9.5 L0 8 L6.5 6.5 Z" />
                      </svg>
                      <div className="flex-1 h-px bg-gradient-to-l from-transparent to-taupe/55" />
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* front flaps */}
              <div className="absolute bottom-0 left-0 right-0 h-[64%] sm:h-[66%] md:h-[68%] z-30 rounded-b-[2.5rem] overflow-hidden pointer-events-none">
                <div
                  className="absolute inset-0 bg-gradient-to-br from-umber via-taupe/40 to-umber/80"
                  style={{
                    clipPath: "polygon(0 0, 50% 55%, 0 100%)",
                  }}
                >
                  <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/paper-fibers.png')]" />
                  <div className="absolute inset-0 bg-gradient-to-br from-white/6 to-transparent" />
                </div>

                <div
                  className="absolute inset-0 bg-gradient-to-bl from-umber via-taupe/40 to-umber/80"
                  style={{
                    clipPath: "polygon(100% 0, 50% 55%, 100% 100%)",
                  }}
                >
                  <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/paper-fibers.png')]" />
                  <div className="absolute inset-0 bg-gradient-to-bl from-white/6 to-transparent" />
                </div>

                <div
                  className="absolute inset-0 bg-umber/25"
                  style={{
                    clipPath: "polygon(45% 50%, 50% 55%, 55% 50%, 50% 48%)",
                  }}
                />

                <div className="absolute top-0 left-0 right-0 h-7 bg-gradient-to-b from-umber/25 to-transparent" />
              </div>
            </motion.div>
          )}
        </div>

        {/* Bento Grid Layout - Flipped Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-10 relative">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="w-full h-full col-span-2 lg:col-span-2"
          >
            <div className="w-full h-auto min-h-[400px] md:min-h-[500px] bg-sand p-2.5 md:p-4 shadow-2xl rounded-[2.5rem] relative overflow-hidden group">
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/natural-paper.png')] opacity-30 pointer-events-none" />
              <div className="absolute inset-0 bg-gradient-to-br from-white/50 via-transparent to-terra/10 pointer-events-none" />
              
              {/* Inner premium card with double border */}
              <div className="w-full h-full bg-paper/90 backdrop-blur-sm rounded-[1.8rem] md:rounded-[2rem] p-6 md:p-10 flex flex-col items-center justify-center text-center relative z-10 shadow-inner border border-white">
                
                {/* Decorative corners */}
                <div className="absolute top-5 left-5 w-6 h-6 border-t border-l border-sage/50" />
                <div className="absolute top-5 right-5 w-6 h-6 border-t border-r border-sage/50" />
                <div className="absolute bottom-5 left-5 w-6 h-6 border-b border-l border-sage/50" />
                <div className="absolute bottom-5 right-5 w-6 h-6 border-b border-r border-sage/50" />
                
                {/* Inner thin border */}
                <div className="absolute inset-6 md:inset-8 border border-sage/10 rounded-xl pointer-events-none" />
                
                <div className="relative z-20 space-y-6 md:space-y-8 flex flex-col items-center justify-center py-4 w-full">
                  
                  {/* Title */}
                  <div className="space-y-3 flex flex-col items-center">
                    <p className="text-[7px] md:text-[9px] uppercase tracking-[0.6em] text-terra/60 font-bold mb-1">
                      Join us to celebrate
                    </p>
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-[1px] bg-gradient-to-r from-transparent to-sage/50" />
                      <span className="serif italic text-2xl md:text-3xl text-sage tracking-widest drop-shadow-sm">Save the Date</span>
                      <div className="w-12 h-[1px] bg-gradient-to-l from-transparent to-sage/50" />
                    </div>
                  </div>

                  {/* Date Lockup */}
                  <div className="flex flex-col items-center py-2 md:py-4">
                    <p className="text-[10px] md:text-xs uppercase tracking-[0.5em] text-terra/80 font-bold mb-3 md:mb-4">Friday</p>
                    <div className="relative inline-flex flex-col items-center py-4 md:py-6">
                      <p className="font-sans text-6xl md:text-7xl lg:text-8xl font-bold tracking-tighter text-sage leading-none drop-shadow-[0_2px_4px_rgba(255,255,255,0.8)]">
                        11
                      </p>
                      <motion.div
                        animate={{ opacity: [0.3, 1, 0.3], scale: [1, 1.2, 1] }}
                        transition={{ repeat: Infinity, duration: 3 }}
                        className="absolute -top-1 -right-2 text-terra/60"
                      >
                        <Sparkles size={14} className="md:w-5 md:h-5" />
                      </motion.div>
                    </div>
                    <p className="serif text-lg md:text-2xl font-light tracking-[0.3em] text-sage mt-2 md:mt-4">DECEMBER</p>
                    
                    <div className="mt-2 md:mt-3 flex items-center justify-center">
                      <p className="text-[9px] md:text-xs uppercase tracking-[0.6em] font-bold text-terra/80">
                        2026
                      </p>
                    </div>
                  </div>

                  {/* Timeline section */}
                  <div className="flex flex-col items-center mt-2 md:mt-4">
                    <p className="text-[10px] md:text-sm uppercase tracking-[0.4em] text-sage font-bold drop-shadow-sm">5:30 PM</p>
                    <p className="serif text-base md:text-xl italic text-sage mt-1 md:mt-2">Wedding Ceremony</p>
                    <p className="text-[8px] md:text-[10px] uppercase tracking-[0.4em] text-terra/60 mt-2 md:mt-3 font-semibold">Followed by Reception</p>
                  </div>

                  {/* Elegant Divider */}
                  <div className="w-full max-w-[200px] flex items-center justify-center gap-2 opacity-60 mt-4 md:mt-6">
                    <div className="flex-1 h-px bg-gradient-to-r from-transparent to-sage/40" />
                    <div className="w-1.5 h-1.5 rotate-45 bg-sage/40" />
                    <div className="flex-1 h-px bg-gradient-to-l from-transparent to-sage/40" />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Location Block (Moved before RSVP) */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="w-full h-full col-span-2 lg:col-span-2"
          >
            <div className="w-full h-full bg-sand shadow-2xl rounded-[2.5rem] relative overflow-hidden group flex flex-col border border-white/40">
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/natural-paper.png')] opacity-30 pointer-events-none" />
              <div className="absolute inset-0 bg-gradient-to-br from-white/40 via-transparent to-terra/5 pointer-events-none" />
              
              {/* Image Section (Top framed) */}
              <div className="w-full p-4 md:p-5 pb-0 relative z-10">
                <div className="w-full rounded-[1.8rem] overflow-hidden border border-sage/20 relative shadow-sm bg-white/50">
                  <img
                    src="https://lh3.googleusercontent.com/gps-cs-s/AHRPTWnHoAy8rTap9ABAaoNOqyIcZTCf6-YO_tuxqcArDmPvhsx2EMRbv4JiMwBb7gPB9WGSYxIFqIAtv_hg3f5CzU8edkf5IdIgxi-dWbALw_QzYESj6cERpQ-SXlyFEG1zI1y7TpB79Yh4hMm4=s1360-w1360-h1020-rw"
                    alt="The Kingsbury Hotel"
                    className="w-full h-auto object-contain transition-transform duration-[4s] group-hover:scale-105"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-sage/5 pointer-events-none mix-blend-multiply" />
                </div>
              </div>
              
              {/* Content Section (Bottom) */}
              <div className="w-full flex-1 p-6 md:p-8 flex flex-col justify-center items-center text-center relative z-10">
                <div className="absolute top-5 left-6 w-4 h-4 border-t border-l border-sage/30" />
                <div className="absolute top-5 right-6 w-4 h-4 border-t border-r border-sage/30" />
                <div className="absolute bottom-6 left-6 w-4 h-4 border-b border-l border-sage/30" />
                <div className="absolute bottom-6 right-6 w-4 h-4 border-b border-r border-sage/30" />

                <div className="flex items-center justify-center gap-3 mb-4">
                  <MapPin className="text-sage" size={16} />
                  <span className="text-[9px] md:text-xs uppercase tracking-[0.5em] font-bold text-terra/70">The Location</span>
                </div>
                
                <div className="w-12 h-[1px] bg-sage/30 mx-auto mb-4" />
                
                <h3 className="serif text-4xl md:text-5xl text-sage font-medium leading-tight mb-1 drop-shadow-sm">
                  The Kingsbury
                </h3>
                <p className="serif italic text-sage/70 text-2xl lg:text-3xl mb-3 md:mb-4">Hotel</p>
                
                <div className="flex items-center justify-center gap-3 mb-6 md:mb-8">
                  <div className="w-4 md:w-6 h-px bg-sage/20" />
                  <p className="text-[8px] md:text-[10px] uppercase tracking-[0.4em] font-bold text-terra/80">The Balmoral</p>
                  <div className="w-4 md:w-6 h-px bg-sage/20" />
                </div>
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => window.open("https://maps.app.goo.gl/qpeQZQgRVc7Uoe3D6", "_blank")}
                  className="px-8 py-3 bg-sage text-paper rounded-full text-[9px] md:text-xs font-bold uppercase tracking-widest shadow-lg hover:bg-terra/90 transition-colors w-full max-w-[200px]"
                >
                  View Map
                </motion.button>
              </div>
            </div>
          </motion.div>

          {/* RSVP block (Moved to end of grid) */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="w-full h-full col-span-2 lg:col-start-2 lg:col-span-2"
          >
            <FlipCard
              containerClassName="w-full h-[380px] md:h-[350px] lg:h-[350px]"
              front={
                <div className="w-full h-full bg-sand p-6 flex flex-col justify-center items-center text-center relative group overflow-hidden">
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-sage/10 rounded-full blur-3xl pointer-events-none" />
                  <div className="relative z-10 space-y-3 md:space-y-6">
                    <p className="serif italic text-lg md:text-2xl text-sage/60 group-hover:scale-110 transition-transform">Kindly</p>
                    <motion.div
                      animate={{ scale: [1, 1.05, 1] }}
                      transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
                      className="group-hover:scale-110 transition-transform duration-500"
                    >
                      <div className="w-48 h-48 sm:w-56 sm:h-56 md:w-72 md:h-72 rounded-full border-2 border-sage/20 flex items-center justify-center bg-paper/30 backdrop-blur-md shadow-2xl mx-auto relative overflow-hidden group">
                        <div className="absolute inset-0 bg-gradient-to-tr from-sage/10 via-transparent to-sage/5 pointer-events-none" />
                        <img src="/ChatGPT Image Jul 31, 2026, 01_52_25 AM.png" alt="K&G Logo" className="w-[85%] h-[85%] object-contain select-none z-10" />
                        <div className="absolute inset-4 rounded-full border border-sage/10 pointer-events-none" />
                      </div>
                    </motion.div>
                    <h3 className="serif text-2xl md:text-4xl tracking-[0.3em] font-medium gold-gradient-text">RSVP</h3>
                  </div>
                </div>
              }
              back={
                <RSVPForm guestName={guestName} />
              }
            />
          </motion.div>


        </div>

        <motion.footer
          initial={{ opacity: 0 }}
          animate={isOpened ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 1.5, delay: 2 }}
          className="text-center pt-12 pb-12 space-y-6"
        >
          <div className="flex items-center justify-center gap-6 text-sage/40">
            <div className="h-px w-16 bg-current" />
            <span className="text-xs uppercase tracking-[0.6em] font-medium">Est. 2026</span>
            <div className="h-px w-16 bg-current" />
          </div>
          <p className="serif italic text-stone-400 text-xl max-w-lg mx-auto leading-relaxed">
            "Love is not just something you feel, it's something you do."
          </p>
          <p className="serif text-sage/60 text-sm italic">We can't wait to celebrate with you</p>

        </motion.footer>
      </motion.main>

      {/* Heavy background motion removed for iOS stability */}
    </div>
  );
}