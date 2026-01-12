"use client";
import { forwardRef, useCallback, useRef, useState } from "react";
import type { ImageProps } from "next/image";
import NextImage from "next/image";

type LivePhotoProps = {
  livePhotoSrc?: string;
  livePhotoType?: string;
  livePhotoAutoPlay?: boolean;
  livePhotoLoop?: boolean;
  livePhotoMuted?: boolean;
  livePhotoControls?: boolean;
};

type ImageWithLivePhotoProps = ImageProps & LivePhotoProps;

const getPosterSrc = (src: ImageProps["src"]) => {
  if (typeof src === "string") {
    return src;
  }
  if ("default" in src) {
    return src?.default.src;
  } else {
    return src?.src;
  }
};

export const Image = forwardRef<HTMLImageElement | HTMLVideoElement, ImageWithLivePhotoProps>(
  (props, ref) => {
    const {
      livePhotoSrc,
      livePhotoType = "video/quicktime",
      livePhotoMuted = true,
      className,
      ...rest
    } = props;

    const ImageComponent = typeof rest.src === "object" ? NextImage : "img";
    const [isPlaying, setIsPlaying] = useState(false);
    const videoRef = useRef<HTMLVideoElement>(null);

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

    if (livePhotoSrc) {
      const poster = getPosterSrc(rest.src);

      const wrapperClassName = [className, "relative overflow-hidden"].filter(Boolean).join(" ");
      return (
        <div className={wrapperClassName} onMouseEnter={handleMouseEnter} onMouseLeave={resetVideo}>
          <ImageComponent
            src={poster}
            alt={rest.alt ?? ""}
            className="block h-full w-full object-cover object-center"
          />
          <video
            className={[
              "absolute inset-0 h-full w-full object-cover object-center transition-opacity duration-200",
              isPlaying ? "opacity-100" : "opacity-0",
            ].join(" ")}
            loop={false}
            muted={livePhotoMuted}
            controls={false}
            playsInline
            aria-label={rest.alt}
            ref={(node) => {
              videoRef.current = node;
              if (typeof ref === "function") {
                ref(node);
                return;
              }
              if (ref) {
                (ref as React.RefObject<HTMLVideoElement | null>).current = node;
              }
            }}
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
            onEnded={resetVideo}
          >
            <source src={livePhotoSrc} type={livePhotoType} />
          </video>
        </div>
      );
    }

    return (
      // @ts-expect-error -- fixme
      <ImageComponent {...rest} className={className} ref={ref} />
    );
  },
);

Image.displayName = "Image";
