"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import type { ComponentProps } from "react";
import NextImage from "next/image";

type LivePhotoProps = {
  livePhotoSrc?: string;
  livePhotoType?: string;
  livePhotoAutoPlay?: boolean;
  livePhotoMuted?: boolean;
  livePhotoControls?: boolean;
};

type ImageWithLivePhotoProps = Omit<ComponentProps<typeof NextImage>, "fill" | "className"> &
  LivePhotoProps & {
    wrapperClassName?: string;
    imageClassName?: string;
  };

export function Image(props: ImageWithLivePhotoProps) {
  const {
    livePhotoSrc,
    livePhotoType = "video/quicktime",
    livePhotoAutoPlay = false,
    livePhotoMuted = true,
    livePhotoControls = false,
    wrapperClassName,
    imageClassName,
    sizes = "100vw",
    src,
    alt,
    ...rest
  } = props;

  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const shouldShowVideo = isPlaying;

  useEffect(() => {
    if (!livePhotoAutoPlay) {
      return;
    }

    const video = videoRef.current;
    if (!video) {
      return;
    }

    setIsPlaying(true);
    void video.play().catch(() => {
      setIsPlaying(false);
    });
  }, [livePhotoAutoPlay]);

  const handleMouseEnter = useCallback(() => {
    const video = videoRef.current;
    if (!video) {
      return;
    }

    setIsPlaying(true);
    void video.play();
  }, []);

  const resetVideo = useCallback(() => {
    const video = videoRef.current;
    if (!video) {
      return;
    }

    video.pause();
    video.currentTime = 0;
    setIsPlaying(false);
  }, []);

  const wrapperClasses = [wrapperClassName, "relative overflow-hidden"].filter(Boolean).join(" ");
  const imageClasses = [imageClassName, "object-cover object-center"].filter(Boolean).join(" ");

  return (
    <div
      className={wrapperClasses}
      onMouseEnter={livePhotoSrc ? handleMouseEnter : undefined}
      onMouseLeave={livePhotoSrc ? resetVideo : undefined}
    >
      <NextImage src={src} alt={alt} fill sizes={sizes} className={imageClasses} {...rest} />
      {livePhotoSrc ? (
        <video
          className={[
            "absolute inset-0 h-full w-full object-cover object-center transition-opacity duration-200",
            shouldShowVideo ? "opacity-100" : "opacity-0",
          ].join(" ")}
          autoPlay={livePhotoAutoPlay}
          loop={false}
          muted={livePhotoMuted}
          controls={livePhotoControls}
          playsInline
          aria-label={alt}
          ref={videoRef}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          onEnded={resetVideo}
        >
          <source src={livePhotoSrc} type={livePhotoType} />
        </video>
      ) : null}
    </div>
  );
}
