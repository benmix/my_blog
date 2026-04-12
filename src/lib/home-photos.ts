import type { SiteLocale } from "@lib/i18n";

export type HomePhoto = {
  alt: Record<SiteLocale, string>;
  meta: Record<SiteLocale, string>;
  province: Record<SiteLocale, string>;
  src: string;
};

export type HomePhotoGroup = {
  photos: HomePhoto[];
  province: string;
};

const HOME_PHOTOS = [
  {
    alt: {
      zh: "杨浦，黄浦江边工业岸线与港口",
      en: "Yangpu, industrial waterfront and port along the Huangpu River",
    },
    meta: {
      zh: "黄浦江，杨浦，上海",
      en: "Huangpu River，Yangpu, shanghai",
    },
    province: {
      zh: "上海",
      en: "Shanghai",
    },
    src: "/photos/yangpu.shanghai.webp",
  },
  {
    alt: {
      zh: "闵行，电线与航迹划过的夏日天空",
      en: "Summer sky over Minhang crossed by power lines and a contrail",
    },
    meta: {
      zh: "闵行，上海",
      en: "Minhang, Shanghai",
    },
    province: {
      zh: "上海",
      en: "Shanghai",
    },
    src: "/photos/minhang.shanghai.webp",
  },
  {
    alt: {
      zh: "文昌，月亮湾海滩",
      en: "Wenchang, Moon Bay Beach",
    },
    meta: {
      zh: "月亮湾，文昌，海南",
      en: "Moon Bay, Wenchang, Hainan",
    },
    province: {
      zh: "海南",
      en: "Hainan",
    },
    src: "/photos/wenchang.hainan.webp",
  },
  {
    alt: {
      zh: "海口，海边将雨未雨的云层",
      en: "Haikou shoreline under storm clouds",
    },
    meta: {
      zh: "海口，海南",
      en: "Haikou, Hainan",
    },
    province: {
      zh: "海南",
      en: "Hainan",
    },
    src: "/photos/haikou.hainan.webp",
  },
  {
    alt: {
      zh: "杭州，树影之间的屋顶与院落",
      en: "Hangzhou courtyard and tiled roofs among trees",
    },
    meta: {
      zh: "杭州，浙江",
      en: "Hangzhou, Zhejiang",
    },
    province: {
      zh: "浙江",
      en: "Zhejiang",
    },
    src: "/photos/hangzhou.zhejiang.webp",
  },
] as const satisfies readonly HomePhoto[];

export function getHomePhotoGroups(locale: SiteLocale) {
  const groups = new Map<string, HomePhoto[]>();

  for (const photo of HOME_PHOTOS) {
    const province = photo.province[locale];
    const current = groups.get(province) ?? [];
    current.push(photo);
    groups.set(province, current);
  }

  return [...groups.entries()].map(([province, photos]) => ({
    photos,
    province,
  })) satisfies HomePhotoGroup[];
}
