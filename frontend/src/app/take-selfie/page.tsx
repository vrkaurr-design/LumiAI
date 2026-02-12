"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useUI } from "@/context/UIContext";
import Reveal from "@/components/common/Reveal";

export default function TakeSelfie() {
  const [ready, setReady] = useState(false);
  const [requesting, setRequesting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [originalPhotoUrl, setOriginalPhotoUrl] = useState<string | null>(null);
  const uploadInputRef = useRef<HTMLInputElement | null>(null);
  const [showNote, setShowNote] = useState(false);
  const router = useRouter();
  const { openLogin } = useUI();

  const handleRipple = (e: React.MouseEvent<HTMLElement>) => {
    const target = e.currentTarget as HTMLElement;
    const rect = target.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;
    const ripple = document.createElement("span");
    ripple.className = "ripple";
    ripple.style.width = `${size}px`;
    ripple.style.height = `${size}px`;
    ripple.style.left = `${x}px`;
    ripple.style.top = `${y}px`;
    ripple.style.background = "rgba(255,255,255,0.45)";
    target.appendChild(ripple);
    ripple.addEventListener("animationend", () => {
      ripple.remove();
    });
  };

  const startCamera = async () => {
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

  const stopCamera = () => {
    const v = videoRef.current as HTMLVideoElement | null;
    const s = v?.srcObject as MediaStream | null;
    s?.getTracks().forEach((t) => t.stop());
    setReady(false);
  };

  const triggerUpload = () => {
    uploadInputRef.current?.click();
  };

  const onUploadChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setPhotoUrl(reader.result as string);
      setOriginalPhotoUrl(reader.result as string);
      stopCamera();
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  const capturePhoto = () => {
    const v = videoRef.current as HTMLVideoElement | null;
    if (!v) return;
    const w = v.videoWidth;
    const h = v.videoHeight;
    const canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.drawImage(v, 0, 0, w, h);
    const url = canvas.toDataURL("image/jpeg", 0.92);
    setPhotoUrl(url);
    setOriginalPhotoUrl(url);
  };

  const cropCenterSquare = () => {
    if (!photoUrl) return;
    const img = new Image();
    img.onload = () => {
      const size = Math.min(img.width, img.height);
      const sx = (img.width - size) / 2;
      const sy = (img.height - size) / 2;
      const canvas = document.createElement("canvas");
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      ctx.drawImage(img, sx, sy, size, size, 0, 0, size, size);
      setPhotoUrl(canvas.toDataURL("image/jpeg", 0.92));
    };
    img.src = photoUrl;
  };

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4 relative">
      <Reveal className="w-full max-w-3xl mx-auto rounded-2xl border border-white/20 dark:border-white/10 bg-white/85 dark:bg-black/50 backdrop-blur-xl shadow-2xl p-6 relative z-10">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-2xl font-extrabold text-dark dark:text-white">Take the Selfie</h2>
          <button
            onClick={stopCamera}
            className="rounded-md px-2 py-1 bg-white/70 dark:bg-white/10 text-dark dark:text-white hover:bg-white/90 dark:hover:bg-white/20"
          >
            ⏹
          </button>
        </div>
        {!ready && (
          <div className="mb-4 text-sm text-gray-700 dark:text-gray-300">
            {requesting ? "Requesting camera permission…" : error ? `Error: ${error}` : "Allow camera access to begin."}
          </div>
        )}
        <Reveal className="rounded-xl overflow-hidden bg-black/20 dark:bg-black/50 mb-4 aspect-video flex items-center justify-center" delay={40}>
          <video ref={videoRef} className="w-full h-full object-cover" playsInline muted />
          {!ready && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="px-4 py-2 rounded-lg bg-dark dark:bg-white text-white dark:text-dark text-sm font-semibold">
                {error ? "Camera not available" : "Preview not started"}
              </div>
            </div>
          )}
        </Reveal>
        <input ref={uploadInputRef} type="file" accept="image/*" className="hidden" onChange={onUploadChange} />
        {photoUrl && (
          <Reveal className="mt-4 rounded-xl overflow-hidden border border-white/30 dark:border-white/10" delay={60}>
            <img src={photoUrl} alt="Captured selfie" className="w-full max-h-[50vh] object-contain" />
          </Reveal>
        )}
        <div className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-3">
          <button
            onClick={(e) => { handleRipple(e); startCamera(); }}
            disabled={requesting}
            className="group camera-hover relative overflow-hidden h-12 w-full rounded-lg bg-dark dark:bg-white text-white dark:text-dark text-sm font-semibold shine-sweep inline-flex items-center justify-center"
          >
            {requesting ? "Requesting…" : ready ? (
              <span className="inline-flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path d="M20 12a8 8 0 1 1-4-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M17 4v5h5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Restart Preview
              </span>
            ) : "Allow Camera Access"}
          </button>
          <button
            onClick={(e) => { handleRipple(e); capturePhoto(); }}
            disabled={!ready}
            className={`group camera-hover relative overflow-hidden h-12 w-full rounded-lg bg-primary text-white text-sm font-semibold shadow-md shine-sweep inline-flex items-center justify-center ${ready ? "" : "opacity-60 cursor-not-allowed"}`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" className="mr-2">
              <rect x="3" y="7" width="18" height="12" rx="2" stroke="currentColor" strokeWidth="1.5" />
              <path d="M8 7l2-3h4l2 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              <circle cx="12" cy="13" r="3.5" stroke="currentColor" strokeWidth="1.5" />
            </svg>
            Capture Photo
          </button>
          <button
            onClick={(e) => { handleRipple(e); triggerUpload(); }}
            className="group gallery-hover relative overflow-hidden h-12 w-full rounded-lg bg-dark dark:bg-white text-white dark:text-dark text-sm font-semibold shine-sweep inline-flex items-center justify-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" className="mr-2">
              <rect x="3" y="5" width="18" height="14" rx="2" stroke="currentColor" strokeWidth="1.5" />
              <circle cx="9" cy="10" r="1.7" stroke="currentColor" strokeWidth="1.5" />
              <path d="M4.5 17l6-6 5 5 3.5-3.5V19H4.5Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Upload from Gallery
          </button>
          <button
            onClick={(e) => { handleRipple(e); cropCenterSquare(); }}
            onDoubleClick={(e) => { handleRipple(e); if (originalPhotoUrl) setPhotoUrl(originalPhotoUrl); }}
            disabled={!photoUrl}
            className={`relative overflow-hidden h-12 w-full rounded-lg bg-secondary text-white text-sm font-semibold shadow-md shine-sweep inline-flex items-center justify-center ${photoUrl ? "" : "opacity-60 cursor-not-allowed"}`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" className="mr-2">
              <path d="M7 3v10h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              <path d="M17 21V11H7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              <rect x="9" y="9" width="6" height="6" stroke="currentColor" strokeWidth="1.5" />
            </svg>
            Crop
          </button>
          <button
            onClick={(e) => { handleRipple(e); setPhotoUrl(null); setOriginalPhotoUrl(null); }}
            disabled={!photoUrl}
            className={`group relative overflow-hidden h-12 w-full rounded-lg bg-rose-600 text-white text-sm font-semibold shadow-md shine-sweep inline-flex items-center justify-center ${photoUrl ? "" : "opacity-60 cursor-not-allowed"}`}
          >
            <span className={`inline-flex items-center gap-2 transition-opacity ${photoUrl ? "group-hover:opacity-0" : ""}`}>
              Delete Photo
            </span>
            <span className={`absolute inset-0 flex items-center justify-center opacity-0 ${photoUrl ? "group-hover:opacity-100" : ""}`}>
              <svg className="trash-icon trash-pop" viewBox="0 0 24 24" fill="none">
                <path d="M9 3h6l1 2h4v2H4V5h4l1-2Z" fill="currentColor" />
                <path d="M6 9h12l-1 10a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2L6 9Z" fill="currentColor" />
                <path d="M10 12v7M14 12v7" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </span>
          </button>
          <button
            onClick={(e) => {
              handleRipple(e);
              if (!photoUrl) return;
              try {
                const authed = sessionStorage.getItem("auth:loggedIn");
                if (!authed) {
                  setError("Please log in to continue with analysis.");
                  try { sessionStorage.setItem("auth:next", "/skin-analysis"); } catch {}
                  openLogin();
                  return;
                }
                sessionStorage.setItem("analysis:image", photoUrl);
              } catch {}
              setShowNote(true);
              setTimeout(() => {
                stopCamera();
                router.push("/skin-analysis");
              }, 900);
            }}
            disabled={!photoUrl}
            className={`group send-hover relative overflow-hidden h-12 w-full rounded-lg bg-gradient-to-r from-secondary to-primary text-white text-sm font-semibold shadow-md shine-sweep inline-flex items-center justify-center ${photoUrl ? "" : "opacity-60 cursor-not-allowed"}`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" className="mr-2">
              <path d="M5 12h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              <path d="M13 8l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Send for Analysis
          </button>
        </div>
        {showNote && (
          <>
            <Reveal as="p" className="mt-4 text-xs text-center text-gray-700 dark:text-gray-300" delay={80}>
              Please wait for the analysis to get the best results.
            </Reveal>
            <div className="mt-3 flex items-center justify-between">
              <Link
                href="/selfie-prep"
                className="relative overflow-hidden px-3 py-1.5 rounded-md bg-dark dark:bg-white text-white dark:text-dark text-xs font-semibold hover:opacity-90 transition-opacity"
              >
                Previous
              </Link>
              <Link
                href={photoUrl ? "/skin-analysis" : "#"}
                aria-disabled={!photoUrl}
                className={`relative overflow-hidden px-3 py-1.5 rounded-md bg-gradient-to-r from-secondary to-primary text-white text-xs font-semibold transition-opacity ${photoUrl ? "hover:opacity-90" : "opacity-60 pointer-events-none"}`}
              >
                Next
              </Link>
            </div>
          </>
        )}
      </Reveal>
    </div>
  );
}
