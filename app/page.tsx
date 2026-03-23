"use client";

import { useEffect, useMemo, useState } from "react";
import { allEmojis, emojiCategories } from "@/data/emojis";

export default function HomePage() {
  const [toast, setToast] = useState("");
  const [recentEmojis, setRecentEmojis] = useState<string[]>([]);
  const [favoriteEmojis, setFavoriteEmojis] = useState<string[]>([]);
  const [activeCategory, setActiveCategory] = useState(
    emojiCategories[0]?.id ?? ""
  );
  const [search, setSearch] = useState("");
  const [copiedEmoji, setCopiedEmoji] = useState("");
  const [limit, setLimit] = useState(240);

  const query = search.trim().toLowerCase();

  useEffect(() => {
    const savedRecent = localStorage.getItem("recent-emojis");
    const savedFavorites = localStorage.getItem("favorite-emojis");

    if (savedRecent) {
      try {
        setRecentEmojis(JSON.parse(savedRecent));
      } catch (error) {
        console.error("Failed to parse recent emojis:", error);
      }
    }

    if (savedFavorites) {
      try {
        setFavoriteEmojis(JSON.parse(savedFavorites));
      } catch (error) {
        console.error("Failed to parse favorite emojis:", error);
      }
    }
  }, []);

  useEffect(() => {
    setLimit(240);
  }, [query, activeCategory]);

  const filteredCategories = useMemo(() => {
    if (!query) return emojiCategories;

    return emojiCategories
      .map((category) => ({
        ...category,
        emojis: category.emojis.filter((item) => {
          const haystack = [
            item.emoji,
            item.name,
            item.group,
            item.subgroup,
            ...item.keywords,
          ]
            .join(" ")
            .toLowerCase();

          return haystack.includes(query);
        }),
      }))
      .filter((category) => category.emojis.length > 0);
  }, [query]);

  const searchResults = useMemo(() => {
    if (!query) return [];

    return allEmojis.filter((item) => {
      const haystack = [
        item.emoji,
        item.name,
        item.group,
        item.subgroup,
        ...item.keywords,
      ]
        .join(" ")
        .toLowerCase();

      return haystack.includes(query);
    });
  }, [query]);

  const visibleCategory =
    filteredCategories.find((cat) => cat.id === activeCategory) ||
    filteredCategories[0];

  const visibleEmojis = query
    ? searchResults.slice(0, limit)
    : (visibleCategory?.emojis ?? []).slice(0, limit);

  const showToast = (message: string) => {
    setToast(message);
    window.clearTimeout((showToast as typeof showToast & { timer?: number }).timer);
    (showToast as typeof showToast & { timer?: number }).timer = window.setTimeout(
      () => {
        setToast("");
      },
      1200
    );
  };

  const handleCopy = async (emoji: string) => {
    try {
      await navigator.clipboard.writeText(emoji);

      setCopiedEmoji(emoji);
      showToast(`${emoji} copied!`);

      setRecentEmojis((prev) => {
        const next = [emoji, ...prev.filter((item) => item !== emoji)].slice(
          0,
          24
        );
        localStorage.setItem("recent-emojis", JSON.stringify(next));
        return next;
      });

      window.setTimeout(() => {
        setCopiedEmoji("");
      }, 1200);
    } catch (error) {
      console.error("Copy failed:", error);
      showToast("Copy failed");
    }
  };

  const handleToggleFavorite = (emoji: string) => {
    setFavoriteEmojis((prev) => {
      const exists = prev.includes(emoji);
      const next = exists
        ? prev.filter((item) => item !== emoji)
        : [emoji, ...prev].slice(0, 100);

      localStorage.setItem("favorite-emojis", JSON.stringify(next));
      showToast(
        exists
          ? `${emoji} removed from favorites`
          : `${emoji} added to favorites`
      );

      return next;
    });
  };

  return (
    <main className="page">
      <div className="container">
        <section className="hero">
          <p className="badge">Full Unicode Emoji Tool</p>
          <h1 className="title">Emoji Copy Paste</h1>
          <p className="description">
            Browse and copy the full emoji set by category, or search by name,
            keyword, group, and emoji.
          </p>
        </section>

        <section className="card" id="categories">
          <div className="section">
            <h2 className="section-title">Find emojis fast</h2>
            <p className="section-desc">
              Search for dog, heart, fire, smile, flag, family, skin tone, and
              more.
            </p>

            <div className="field">
              <label className="label">Search</label>
              <input
                className="input"
                type="text"
                placeholder="Try dog, heart, fire, family, flag..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            {!query && (
              <div className="tab-row">
                {emojiCategories.map((category) => (
                  <button
                    key={category.id}
                    type="button"
                    className={`tab-button ${
                      activeCategory === category.id ? "active" : ""
                    }`}
                    onClick={() => setActiveCategory(category.id)}
                  >
                    {category.name}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="section mt-24">
            <div className="section-head">
              <div>
                <h2 className="section-title">
                  {query
                    ? `Search Results (${searchResults.length})`
                    : visibleCategory?.name || "Emoji Results"}
                </h2>
                <p className="section-desc">
                  Click any emoji below to copy it instantly.
                </p>
              </div>

              <div className="copy-status">
                {copiedEmoji ? `Copied ${copiedEmoji}` : "Tap an emoji to copy"}
              </div>
            </div>

            <div className="emoji-grid">
              {visibleEmojis.map((item) => {
                const isFavorite = favoriteEmojis.includes(item.emoji);

                return (
                  <div
                    key={`${item.emoji}-${item.name}`}
                    className="emoji-card"
                    title={`${item.name} — ${item.keywords.join(", ")}`}
                  >
                    <button
                      type="button"
                      className="emoji-main-button"
                      onClick={() => handleCopy(item.emoji)}
                      aria-label={`Copy ${item.name}`}
                    >
                      <span className="emoji-char">{item.emoji}</span>
                      <span className="emoji-copy-text">
                        {copiedEmoji === item.emoji ? "Copied!" : "Copy"}
                      </span>
                      <span className="emoji-name">{item.name}</span>
                    </button>

                    <button
                      type="button"
                      className={`favorite-button ${
                        isFavorite ? "active" : ""
                      }`}
                      onClick={() => handleToggleFavorite(item.emoji)}
                      aria-label={
                        isFavorite
                          ? `Remove ${item.name} from favorites`
                          : `Add ${item.name} to favorites`
                      }
                    >
                      {isFavorite ? "★" : "☆"}
                    </button>
                  </div>
                );
              })}
            </div>

            {visibleEmojis.length === 0 && (
              <div className="empty-state">No emojis found for this search.</div>
            )}

            {(query
              ? searchResults.length
              : visibleCategory?.emojis.length || 0) > limit && (
              <div style={{ marginTop: 20 }}>
                <button
                  type="button"
                  className="button button-secondary"
                  onClick={() => setLimit((prev) => prev + 240)}
                >
                  Load more
                </button>
              </div>
            )}
          </div>

          <div className="section mt-24">
            <h2 className="section-title">Recent copies</h2>
            <p className="section-desc">
              Your most recently copied emojis appear here.
            </p>

            {recentEmojis.length > 0 ? (
              <div className="emoji-grid small">
                {recentEmojis.map((emoji) => (
                  <button
                    key={`recent-${emoji}`}
                    type="button"
                    className="emoji-card simple"
                    onClick={() => handleCopy(emoji)}
                  >
                    <span className="emoji-char">{emoji}</span>
                    <span className="emoji-copy-text">Copy again</span>
                  </button>
                ))}
              </div>
            ) : (
              <div className="empty-state">No recently copied emojis yet.</div>
            )}
          </div>

          <div className="section mt-24">
            <h2 className="section-title">Favorites</h2>
            <p className="section-desc">
              Save emojis you use often for quick access.
            </p>

            {favoriteEmojis.length > 0 ? (
              <div className="emoji-grid small">
                {favoriteEmojis.map((emoji) => (
                  <div key={`favorite-${emoji}`} className="emoji-card simple">
                    <button
                      type="button"
                      className="emoji-main-button"
                      onClick={() => handleCopy(emoji)}
                    >
                      <span className="emoji-char">{emoji}</span>
                      <span className="emoji-copy-text">Copy</span>
                    </button>

                    <button
                      type="button"
                      className="favorite-button active"
                      onClick={() => handleToggleFavorite(emoji)}
                      aria-label={`Remove ${emoji} from favorites`}
                    >
                      ★
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-state">No favorite emojis yet.</div>
            )}
          </div>

          <div className="section mt-24" id="about">
  <h2 className="section-title">About Emoji Copy and Paste</h2>
  <div className="info-list">
    <div className="info-item">
      <p className="info-text">
        Emoji Copy and Paste is a free tool that helps you quickly find, copy,
        and use emojis for social media, messaging apps, blogs, and online
        communities. Instead of searching through your phone keyboard or
        switching between devices, you can browse popular emoji categories,
        search by keyword, and copy any emoji with one click.
      </p>
      <p className="info-text mt-12">
        Emojis are widely used to add emotion, tone, and personality to digital
        communication. They can make captions feel more natural, help messages
        feel friendlier, and improve visual engagement in posts, comments, and
        profiles. This tool is designed to make emoji access simple on desktop
        and mobile.
      </p>
    </div>
  </div>
</div>

<div className="section mt-24" id="why-emojis">
  <h2 className="section-title">Why people use emojis</h2>
  <div className="info-list">
    <div className="info-item">
      <p className="info-title">Better expression</p>
      <p className="info-text">
        Emojis help show emotion and intent in plain text. A short message can
        feel warmer, lighter, or more playful when the right emoji is added.
      </p>
    </div>
    <div className="info-item">
      <p className="info-title">Useful for social media</p>
      <p className="info-text">
        People often use emojis in Instagram captions, TikTok comments, YouTube
        descriptions, and Discord chats to improve readability and catch
        attention faster.
      </p>
    </div>
    <div className="info-item">
      <p className="info-title">Fast visual communication</p>
      <p className="info-text">
        A single emoji can replace a short phrase, making communication quicker
        and more visually engaging across different platforms.
      </p>
    </div>
  </div>
</div>

<div className="section mt-24" id="categories-info">
  <h2 className="section-title">Popular emoji categories</h2>
  <div className="info-list">
    <div className="info-item">
      <p className="info-title">Smileys and people</p>
      <p className="info-text">
        Smileys are some of the most commonly used emojis because they help show
        mood, reactions, and personality in everyday conversations.
      </p>
    </div>
    <div className="info-item">
      <p className="info-title">Hearts and symbols</p>
      <p className="info-text">
        Heart emojis and symbol emojis are popular for profiles, bios, romantic
        messages, and decorative text formatting on social apps.
      </p>
    </div>
    <div className="info-item">
      <p className="info-title">Animals, food, and objects</p>
      <p className="info-text">
        These categories are often used in themed posts, storytelling, seasonal
        content, and fun message combinations.
      </p>
    </div>
  </div>
</div>

<div className="section mt-24" id="social-tips">
  <h2 className="section-title">Tips for using emojis online</h2>
  <div className="info-list">
    <div className="info-item">
      <p className="info-title">Use emojis naturally</p>
      <p className="info-text">
        Emojis work best when they support the message instead of replacing too
        much text. A few well-placed emojis are usually more effective than too
        many in one sentence.
      </p>
    </div>
    <div className="info-item">
      <p className="info-title">Check platform appearance</p>
      <p className="info-text">
        Emojis may look slightly different on Apple, Android, Windows, and web
        browsers, so it is helpful to keep cross-platform rendering in mind.
      </p>
    </div>
    <div className="info-item">
      <p className="info-title">Copy from desktop more easily</p>
      <p className="info-text">
        Many users visit emoji tools on desktop because it is faster to search,
        copy, and paste emojis into documents, websites, and social media posts.
      </p>
    </div>
  </div>
</div>

          
          <div className="section mt-24" id="guide">
            <h2 className="section-title">How to use</h2>
            <div className="info-list">
              <div className="info-item">
                <p className="info-title">Browse all categories</p>
                <p className="info-text">
                  View the full emoji set grouped into standard categories.
                </p>
              </div>
              <div className="info-item">
                <p className="info-title">Search by word</p>
                <p className="info-text">
                  Search terms like dog, heart, flag, family, laugh, or coffee.
                </p>
              </div>
              <div className="info-item">
                <p className="info-title">Click to copy</p>
                <p className="info-text">
                  Tap any emoji card to copy it immediately.
                </p>
              </div>
            </div>
          </div>

         
          
          <div className="section mt-24" id="faq">
            <h2 className="section-title">FAQ</h2>
            <div className="info-list">
              <div className="info-item">
                <p className="info-title">Does this include all emojis?</p>
                <p className="info-text">
                  It uses a full Unicode emoji dataset rather than a small
                  manual list.
                </p>
              </div>
              <div className="info-item">
                <p className="info-title">
                  Why are some emojis combined characters?
                </p>
                <p className="info-text">
                  Many modern emojis are sequences, not just one code point.
                </p>
              </div>
              <div className="info-item">
                <p className="info-title">
                  Why do some emojis look different?
                </p>
                <p className="info-text">
                  Emoji appearance depends on the operating system and font
                  renderer.
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
<a href="/emoji-combiner">Emoji Combiner</a>
<a href="/emoji-kitchen">Emoji Kitchen</a>
<a href="/instagram-emoji">Instagram Emoji</a>
      
      {toast && <div className="toast">{toast}</div>}
    </main>
  );
}
