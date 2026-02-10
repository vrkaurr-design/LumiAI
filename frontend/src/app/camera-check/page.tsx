"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import FooterPager from "@/components/common/FooterPager";

export default function CameraCheck() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [requesting, setRequesting] = useState(false);

  const start = async () => {
    setRequesting(true);
    setError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user", width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: false,
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      setReady(true);
    } catch (e: any) {
      setError(e?.message || "Camera access denied");
      setReady(false);
    } finally {
      setRequesting(false);
    }
  };

  useEffect(() => {
    const v = videoRef.current as HTMLVideoElement | null;
    return () => {
      const s = v?.srcObject as MediaStream | null;
      s?.getTracks().forEach((t) => t.stop());
    };
  }, []);

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4 relative">
      <div className="fixed inset-0 z-0 pointer-events-none bg-gradient-to-br from-secondary/35 via-primary/25 to-pink-200/10 mix-blend-soft-light" />
      <div className="w-full max-w-2xl mx-auto rounded-2xl border border-white/20 dark:border-white/10 bg-white/75 dark:bg-black/40 backdrop-blur-xl shadow-xl p-6 relative z-10">
        <h1 className="text-3xl font-extrabold text-center mb-2 text-primary text-pop-bright">Camera Check</h1>
        <p className="text-center text-sm text-gray-700 dark:text-gray-300 mb-6">
          Allow camera access and verify your setup before continuing.
        </p>

        <div className="rounded-xl overflow-hidden bg-black/20 dark:bg-black/50 mb-4 aspect-video flex items-center justify-center">
          <video ref={videoRef} className="w-full h-full object-cover" playsInline muted />
          {!ready && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="px-4 py-2 rounded-lg bg-dark dark:bg-white text-white dark:text-dark text-sm font-semibold">
                {error ? "Camera not available" : "Camera feed not started"}
              </div>
            </div>
          )}
        </div>

        {error && <div className="mb-4 text-sm text-red-600">{error}</div>}

        <div className="flex items-center justify-center gap-3">
          <button
            onClick={start}
            disabled={requesting}
            className="px-4 py-2 rounded-lg bg-dark dark:bg-white text-white dark:text-dark text-sm font-semibold hover:opacity-90 transition-opacity"
          >
            {requesting ? "Requesting…" : ready ? "Restart Preview" : "Allow Camera Access"}
          </button>
          <Link
            href={ready ? "/skin-analysis" : "#"}
            className={`px-4 py-2 rounded-lg bg-gradient-to-r from-secondary to-primary text-white text-sm font-semibold transition-opacity shadow-md ${
              ready ? "hover:opacity-90" : "opacity-60 cursor-not-allowed"
            }`}
          >
            Begin Analysis
          </Link>
        </div>
        
        <FooterPager hidePrevious nextHref={ready ? "/skin-analysis" : undefined} nextLabel="Begin Analysis" />
      </div>
    </div>
  );
}
