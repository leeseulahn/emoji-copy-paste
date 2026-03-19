import dataByEmoji from "unicode-emoji-json/data-by-emoji.json";

export type EmojiItem = {
  emoji: string;
  name: string;
  group: string;
  subgroup: string;
  keywords: string[];
};

export type EmojiCategory = {
  id: string;
  name: string;
  emojis: EmojiItem[];
};

type UnicodeEmojiRow = {
  name?: string;
  group?: string;
  subgroup?: string;
  shortName?: string;
  short_name?: string;
  keywords?: string[];
};

const raw = dataByEmoji as Record<string, UnicodeEmojiRow>;

function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

const allEmojiItems: EmojiItem[] = Object.entries(raw).map(([emoji, info]) => {
  const name = info.name || info.shortName || info.short_name || emoji;
  const group = info.group || "Other";
  const subgroup = info.subgroup || "Other";
  const keywords = Array.isArray(info.keywords) ? info.keywords : [];

  return {
    emoji,
    name,
    group,
    subgroup,
    keywords,
  };
});

const groupedMap = new Map<string, EmojiItem[]>();

for (const item of allEmojiItems) {
  const key = item.group;
  if (!groupedMap.has(key)) groupedMap.set(key, []);
  groupedMap.get(key)!.push(item);
}

export const emojiCategories: EmojiCategory[] = Array.from(groupedMap.entries()).map(
  ([groupName, emojis]) => ({
    id: slugify(groupName),
    name: groupName,
    emojis,
  })
);

export const allEmojis = allEmojiItems;