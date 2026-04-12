"use client";

import { useTheme } from "next-themes";
import dynamic from "next/dynamic";
import { useRef, useState } from "react";
import type { TouchEventHandler, WheelEventHandler } from "react";

import { Image } from "@components/image";
import { getHomePhotoGroups, type HomePhotoGroup } from "@lib/home-photos";
import type { SiteLocale } from "@lib/i18n";
import { cn } from "@lib/utils";

const HalftoneDots = dynamic(
  () => import("@paper-design/shaders-react").then((mod) => mod.HalftoneDots),
  { ssr: false },
);

function HomePhotoShader({ src }: { src: string }) {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  return (
    <div aria-hidden="true" className="home-photo-newsprint absolute inset-0">
      <HalftoneDots
        image={src}
        contrast={0.52}
        originalColors={false}
        inverted={false}
        grid="hex"
        radius={0.92}
        size={0.17}
        scale={1.08}
        grainSize={0.62}
        type="gooey"
        fit="cover"
        grainMixer={0.28}
        grainOverlay={0.26}
        colorFront={isDark ? "#E8E3D7" : "#24211D"}
        colorBack="#00000000"
        style={{
          width: "100%",
          height: "100%",
          backgroundColor: isDark ? "rgb(26 28 31 / 0.96)" : "rgb(236 230 216 / 0.96)",
        }}
      />
    </div>
  );
}

function usePhotoWheelNavigation(
  photoCount: number,
  activeIndex: number,
  onSelect: (nextIndex: number) => void,
) {
  const wheelAccumulatedXRef = useRef(0);
  const wheelGestureLockRef = useRef(false);
  const wheelResetTimerRef = useRef<number | null>(null);
  const touchStartXRef = useRef<number | null>(null);
  const hasMultiplePhotos = photoCount > 1;

  const cyclePhoto = (direction: "next" | "previous") => {
    if (!hasMultiplePhotos) {
      return;
    }

    const nextIndex =
      direction === "next"
        ? (activeIndex + 1) % photoCount
        : (activeIndex - 1 + photoCount) % photoCount;

    onSelect(nextIndex);
  };

  const handleWheel: WheelEventHandler<HTMLDivElement> = (event) => {
    if (!hasMultiplePhotos) {
      return;
    }

    const absX = Math.abs(event.deltaX);
    const absY = Math.abs(event.deltaY);

    if (absX < 24 || absX <= absY) {
      return;
    }

    event.preventDefault();

    if (wheelResetTimerRef.current) {
      window.clearTimeout(wheelResetTimerRef.current);
    }

    wheelResetTimerRef.current = window.setTimeout(() => {
      wheelAccumulatedXRef.current = 0;
      wheelGestureLockRef.current = false;
      wheelResetTimerRef.current = null;
    }, 160);

    if (wheelGestureLockRef.current) {
      return;
    }

    wheelAccumulatedXRef.current += event.deltaX;

    if (Math.abs(wheelAccumulatedXRef.current) < 72) {
      return;
    }

    wheelGestureLockRef.current = true;
    cyclePhoto(wheelAccumulatedXRef.current > 0 ? "next" : "previous");
  };

  const handleTouchStart: TouchEventHandler<HTMLDivElement> = (event) => {
    touchStartXRef.current = event.touches[0]?.clientX ?? null;
  };

  const handleTouchEnd: TouchEventHandler<HTMLDivElement> = (event) => {
    const startX = touchStartXRef.current;
    const endX = event.changedTouches[0]?.clientX;

    touchStartXRef.current = null;

    if (!hasMultiplePhotos || startX === null || endX === undefined) {
      return;
    }

    const deltaX = startX - endX;

    if (Math.abs(deltaX) < 36) {
      return;
    }

    cyclePhoto(deltaX > 0 ? "next" : "previous");
  };

  return {
    handleTouchEnd,
    handleTouchStart,
    handleWheel,
    hasMultiplePhotos,
  };
}

function HomePhotoCard({
  activeIndex,
  group,
  locale,
  onSelect,
}: {
  activeIndex: number;
  group: HomePhotoGroup;
  locale: SiteLocale;
  onSelect: (nextIndex: number) => void;
}) {
  const activePhoto = group.photos[activeIndex] ?? group.photos[0];
  const { handleTouchEnd, handleTouchStart, handleWheel, hasMultiplePhotos } =
    usePhotoWheelNavigation(group.photos.length, activeIndex, onSelect);

  return (
    <article className="border-b border-border/80 pb-8 last:border-b-0 last:pb-0">
      <figure className="home-photo-card relative overflow-hidden border border-border/70 bg-muted/35">
        <div
          className="home-photo-viewport relative aspect-video overflow-hidden"
          onTouchEnd={handleTouchEnd}
          onTouchStart={handleTouchStart}
          onWheel={handleWheel}
        >
          <div
            className="home-photo-track flex h-full"
            style={{ transform: `translateX(-${activeIndex * 100}%)` }}
          >
            {group.photos.map((photo, index) => (
              <div key={photo.src} className="relative h-full min-w-full overflow-hidden">
                <Image
                  src={photo.src}
                  alt={photo.alt[locale]}
                  sizes="(max-width: 639px) calc(100vw - 2rem), (max-width: 1279px) calc(100vw - 3.5rem), 28rem"
                  wrapperClassName="home-photo-original absolute inset-0"
                  imageClassName="object-cover object-center"
                  priority={index === 0}
                />
                <HomePhotoShader src={photo.src} />
              </div>
            ))}
          </div>
          <figcaption className="pointer-events-none absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 bg-gradient-to-t from-background/92 via-background/48 to-transparent px-4 py-4">
            <p className="max-w-[34ch] text-[0.88rem] leading-[1.72] text-foreground/88">
              {activePhoto.meta[locale]}
            </p>
            {hasMultiplePhotos ? (
              <div className="pointer-events-auto flex shrink-0 items-center gap-2">
                {group.photos.map((photo, index) => (
                  <button
                    key={photo.src}
                    aria-label={`Show photo ${index + 1} in ${group.province}`}
                    className={cn(
                      "cursor-pointer rounded-full transition-all duration-300",
                      index === activeIndex
                        ? "h-1.5 w-6 bg-foreground/80"
                        : "h-1.5 w-2.5 bg-background/70 hover:w-4 hover:bg-foreground/60",
                    )}
                    onClick={() => onSelect(index)}
                    type="button"
                  />
                ))}
              </div>
            ) : null}
          </figcaption>
        </div>
      </figure>
    </article>
  );
}

export function HomePhotoWall({ locale }: { locale: SiteLocale }) {
  const photoGroups = getHomePhotoGroups(locale);
  const [activeIndices, setActiveIndices] = useState(() => photoGroups.map(() => 0));

  return (
    <div className="xl:scroll-hidden hidden min-w-0 xl:block xl:min-h-0 xl:overflow-y-auto xl:overscroll-contain xl:pr-1">
      <div className="border-b-0 pt-0 pb-5">
        <div className="home-photo-showcase flex flex-col gap-8">
          {photoGroups.map((group, index) => (
            <HomePhotoCard
              key={group.province}
              activeIndex={activeIndices[index] ?? 0}
              group={group}
              locale={locale}
              onSelect={(nextIndex) => {
                setActiveIndices((current) =>
                  current.map((value, currentIndex) =>
                    currentIndex === index ? nextIndex : value,
                  ),
                );
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
