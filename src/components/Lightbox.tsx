import React, { useEffect, useState, useRef } from 'react';
import { useGallery } from '../context/GalleryContext';
import { FavoriteButton } from './FavoriteButton';
import { 
  X, 
  ChevronLeft, 
  ChevronRight, 
  Download, 
  Maximize, 
  Minimize, 
  MapPin, 
  Camera, 
  Loader2, 
  AlertCircle 
} from 'lucide-react';

export const Lightbox: React.FC = () => {
  const { 
    filteredImages, 
    lightboxIndex, 
    closeLightbox, 
    nextLightbox, 
    prevLightbox, 
    addToast 
  } = useGallery();

  const [isFullscreen, setIsFullscreen] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const lightboxRef = useRef<HTMLDivElement>(null);
  const closeBtnRef = useRef<HTMLButtonElement>(null);

  const isOpen = lightboxIndex !== null && lightboxIndex >= 0 && lightboxIndex < filteredImages.length;
  const currentImage = isOpen ? filteredImages[lightboxIndex!] : null;

  // Reset image load state on photo change
  useEffect(() => {
    setImageLoaded(false);
    setImageError(false);
  }, [lightboxIndex]);

  // Lock background scroll and manage focus
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      closeBtnRef.current?.focus();
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Keyboard controls: Escape, ArrowLeft, ArrowRight, F
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        closeLightbox();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        nextLightbox();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        prevLightbox();
      } else if (e.key === 'f' || e.key === 'F') {
        e.preventDefault();
        toggleFullscreen();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, nextLightbox, prevLightbox, closeLightbox]);

  if (!isOpen || !currentImage) return null;

  const total = filteredImages.length;
  const currentNum = (lightboxIndex ?? 0) + 1;

  // Fullscreen API toggle
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      lightboxRef.current?.requestFullscreen().then(() => {
        setIsFullscreen(true);
      }).catch(() => {
        addToast('Fullscreen mode not available in this context.', 'info');
      });
    } else {
      document.exitFullscreen().then(() => {
        setIsFullscreen(false);
      });
    }
  };

  // Truthful download handler
  const handleDownload = async () => {
    if (!currentImage) return;
    setIsDownloading(true);
    addToast('Initiating high-resolution download...', 'info');

    try {
      const response = await fetch(currentImage.image_url, { mode: 'cors' });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);
      const anchor = document.createElement('a');
      anchor.href = blobUrl;
      const cleanFileName = `${currentImage.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}.jpg`;
      anchor.download = cleanFileName;
      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();
      URL.revokeObjectURL(blobUrl);
      addToast(`Downloaded "${currentImage.title}" successfully!`, 'success');
    } catch (err) {
      console.info('Pixora: Direct blob download restricted by remote CORS, opening high-res photo in new tab.', err);
      addToast(
        'Direct download restricted by remote host CORS. Opening original full-resolution photo in a new tab for direct saving.',
        'info'
      );
      window.open(currentImage.image_url, '_blank', 'noopener,noreferrer');
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div
      ref={lightboxRef}
      role="dialog"
      aria-modal="true"
      aria-label={`Photograph viewer: ${currentImage.title}`}
      className="fixed inset-0 z-50 bg-[#121210]/95 backdrop-blur-md flex flex-col justify-between text-white select-none animate-toast-in"
      onClick={closeLightbox}
    >
      {/* Top Header Bar */}
      <div
        className="w-full h-18 px-4 sm:px-8 flex items-center justify-between bg-gradient-to-b from-black/80 to-transparent z-20 shrink-0"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3">
          <span className="px-3 py-1 rounded-full bg-white/10 backdrop-blur-xs text-xs font-semibold tracking-wider text-white/90">
            Photo {currentNum} of {total}
          </span>
          <span className="px-3 py-1 rounded-full bg-[#C76546] text-white text-xs font-bold tracking-wider uppercase">
            {currentImage.category_name}
          </span>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Favorite Button */}
          <FavoriteButton imageId={currentImage.id} size="md" />

          {/* Download Button */}
          <button
            type="button"
            onClick={handleDownload}
            disabled={isDownloading}
            className="p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C76546]"
            aria-label="Download photograph"
            title="Download high-resolution photograph"
          >
            {isDownloading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Download className="w-5 h-5" />
            )}
          </button>

          {/* Fullscreen Toggle Button */}
          <button
            type="button"
            onClick={toggleFullscreen}
            className="p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C76546]"
            aria-label={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
            title="Toggle fullscreen (F)"
          >
            {isFullscreen ? <Minimize className="w-5 h-5" /> : <Maximize className="w-5 h-5" />}
          </button>

          {/* Close Button */}
          <button
            ref={closeBtnRef}
            type="button"
            onClick={closeLightbox}
            className="p-2.5 rounded-full bg-white/20 hover:bg-[#C76546] text-white transition focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C76546]"
            aria-label="Close viewer (Esc)"
            title="Close viewer (Esc)"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Center Media Stage */}
      <div className="relative flex-1 flex items-center justify-between px-2 sm:px-6 overflow-hidden">
        {/* Previous Button */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            prevLightbox();
          }}
          className="p-3 sm:p-4 rounded-full bg-white/10 hover:bg-[#C76546] text-white transition z-20 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C76546] shrink-0"
          aria-label="Previous photograph (Left Arrow)"
          title="Previous (Left Arrow)"
        >
          <ChevronLeft className="w-6 h-6 sm:w-7 sm:h-7" />
        </button>

        {/* Photograph Container */}
        <div
          className="relative max-w-[90vw] max-h-[calc(100vh-210px)] flex items-center justify-center p-2"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Spinner */}
          {!imageLoaded && !imageError && (
            <div className="absolute inset-0 flex items-center justify-center">
              <Loader2 className="w-10 h-10 text-[#C76546] animate-spin" />
            </div>
          )}

          {/* Failed Image Notice */}
          {imageError ? (
            <div className="p-8 text-center bg-white/5 rounded-2xl border border-white/10 max-w-md">
              <AlertCircle className="w-10 h-10 text-[#C76546] mx-auto mb-3" />
              <h3 className="font-serif text-xl font-bold mb-1">{currentImage.title}</h3>
              <p className="text-xs text-white/70 mb-4">
                Unable to load remote photograph. The external image host may be offline.
              </p>
            </div>
          ) : (
            <img
              src={currentImage.image_url}
              alt={`${currentImage.title} by ${currentImage.photographer}`}
              onLoad={() => setImageLoaded(true)}
              onError={() => setImageError(true)}
              className={`max-w-full max-h-[calc(100vh-210px)] object-contain rounded-lg shadow-2xl transition-opacity duration-300 ${
                imageLoaded ? 'opacity-100' : 'opacity-0'
              }`}
            />
          )}
        </div>

        {/* Next Button */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            nextLightbox();
          }}
          className="p-3 sm:p-4 rounded-full bg-white/10 hover:bg-[#C76546] text-white transition z-20 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C76546] shrink-0"
          aria-label="Next photograph (Right Arrow)"
          title="Next (Right Arrow)"
        >
          <ChevronRight className="w-6 h-6 sm:w-7 sm:h-7" />
        </button>
      </div>

      {/* Bottom Editorial Caption Drawer */}
      <div
        className="w-full px-4 sm:px-8 py-5 bg-gradient-to-t from-black/95 via-black/80 to-transparent z-20 shrink-0"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="max-w-4xl mx-auto flex flex-col gap-2">
          <div className="flex flex-wrap items-baseline justify-between gap-3">
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-white tracking-tight">
              {currentImage.title}
            </h2>
            <div className="flex flex-wrap items-center gap-3 text-xs text-white/75">
              <span>By <strong>{currentImage.photographer}</strong></span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-[#C76546]" />
                {currentImage.location}
              </span>
              {currentImage.camera && (
                <>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Camera className="w-3.5 h-3.5 text-[#687453]" />
                    {currentImage.camera}
                  </span>
                </>
              )}
            </div>
          </div>

          <p className="text-xs sm:text-sm text-white/85 leading-relaxed line-clamp-2 sm:line-clamp-3">
            {currentImage.description}
          </p>

          <div className="hidden sm:flex items-center gap-4 text-[11px] text-white/50 pt-1">
            <span>Controls:</span>
            <span className="bg-white/10 px-1.5 py-0.5 rounded font-mono text-white/75">Esc</span> Close
            <span className="bg-white/10 px-1.5 py-0.5 rounded font-mono text-white/75">←</span> Previous
            <span className="bg-white/10 px-1.5 py-0.5 rounded font-mono text-white/75">→</span> Next
            <span className="bg-white/10 px-1.5 py-0.5 rounded font-mono text-white/75">F</span> Fullscreen
          </div>
        </div>
      </div>
    </div>
  );
};
