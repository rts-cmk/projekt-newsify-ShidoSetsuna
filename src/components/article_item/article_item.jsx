import { useState } from "react";
import { useFavoritesStore } from "../../store/favorites_store/favorites_store";
import { FiTrash } from "react-icons/fi";
import { GoBookmarkFill } from "react-icons/go";
import "./article_item.scss";

function ArticleItem({ article, category, isArchivePage = false }) {
  const [swipeOffset, setSwipeOffset] = useState(0);
  const [startX, setStartX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);
  const [showSparks, setShowSparks] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const { toggleFavorite, isFavorited } = useFavoritesStore();
  const favorited = isFavorited(article.url);

  const SWIPE_MAX = 242; // Maximum swipe distance
  const SNAP_THRESHOLD = 40; // Snap to open position
  const ACTION_THRESHOLD = 120; // Auto-trigger action

  const handleTouchStart = (e) => {
    setStartX(e.touches[0].clientX);
    setIsDragging(true);
  };

  const handleTouchMove = (e) => {
    if (!isDragging) return;

    const currentX = e.touches[0].clientX;
    const diff = startX - currentX;

    let newOffset = swipeOffset + diff;
    newOffset = Math.max(0, Math.min(SWIPE_MAX, newOffset));

    setSwipeOffset(newOffset);
    setStartX(currentX);

    // Show sparks when crossing the action threshold
    if (newOffset >= ACTION_THRESHOLD && !showSparks) {
      setShowSparks(true);
    } else if (newOffset < ACTION_THRESHOLD && showSparks) {
      setShowSparks(false);
    }
  };

  const performAction = () => {
    // If removing from favorites on archive page, animate first then remove
    if (favorited && isArchivePage) {
      setIsRemoving(true);
      setTimeout(() => {
        toggleFavorite(article, category);
        setIsRemoving(false);
      }, 300);
    } else {
      toggleFavorite(article, category);
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
    setShowSparks(false);

    // If swiped past action threshold, perform action automatically
    if (swipeOffset >= ACTION_THRESHOLD) {
      performAction();
      setIsAnimating(true);
      setSwipeOffset(0);
      setTimeout(() => setIsAnimating(false), 300);
    } else if (swipeOffset >= SNAP_THRESHOLD) {
      // Snap to open position (100px) but don't perform action
      // Allows user to THINK HARD ABOUT IT
      setIsAnimating(true);
      setSwipeOffset(100);
      setTimeout(() => setIsAnimating(false), 300);
    } else {
      // Below snap threshold, close completely
      setIsAnimating(true);
      setSwipeOffset(0);
      setTimeout(() => setIsAnimating(false), 300);
    }
  };

  const handleActionClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    performAction();
    setSwipeOffset(0);
  };

  const handleArticleClick = (e) => {
    if (swipeOffset > 0) {
      e.preventDefault();
      setSwipeOffset(0);
    }
  };

  // Some parts of the API use different fields for multimedia, so we check both
  // (Why did they do this????)
  // I realized there are many different images, for different sizes,
  // so we'll need to look for the smallest one available
  const getThumbnail = () => {
    // Strategy 1: Try to find image by format name (prefer smallest)
    const findImageByFormat = (mediaArray) => {
      const preferredFormats = [
        "Large Thumbnail",
        "threeByTwoSmallAt2X",
        "Super Jumbo",
      ];

      for (const format of preferredFormats) {
        const image = mediaArray.find((img) => img.format === format);
        if (image) return image.url;
      }
      return null;
    };

    // Strategy 2: Find smallest image by dimensions
    const findSmallestImage = (mediaArray) => {
      let smallest = mediaArray[0];
      let smallestArea =
        (smallest.width || Infinity) * (smallest.height || Infinity);

      for (const img of mediaArray) {
        const area = (img.width || Infinity) * (img.height || Infinity);
        if (area < smallestArea) {
          smallest = img;
          smallestArea = area;
        }
      }
      return smallest.url;
    };

    // Handle article.multimedia
    if (article.multimedia && article.multimedia.length > 0) {
      const byFormat = findImageByFormat(article.multimedia);
      if (byFormat) return byFormat;

      const bySize = findSmallestImage(article.multimedia);
      if (bySize) return bySize;

      return article.multimedia[0].url;
    }

    // Handle article.media (media-metadata structure)
    if (article.media && article.media.length > 0) {
      const mediaMetadata = article.media[0]["media-metadata"];
      if (mediaMetadata && mediaMetadata.length > 0) {
        const byFormat = findImageByFormat(mediaMetadata);
        if (byFormat) return byFormat;

        const bySize = findSmallestImage(mediaMetadata);
        if (bySize) return bySize;

        return mediaMetadata[0].url;
      }
    }

    return "";
  };

  const thumbnail = getThumbnail();

  // Calculate icon scale and opacity based on swipe progress
  const swipeProgress = Math.min(swipeOffset / ACTION_THRESHOLD, 1);
  const iconScale = 1 + swipeProgress * 0.5;
  const iconOpacity = 0.6 + swipeProgress * 0.4;

  return (
    <article
      className={`article-item ${isRemoving ? "article-item--removing" : ""}`}>
      <div
        className="article-item__container"
        style={{
          transform: `translateX(-${swipeOffset}px)`,
          transition: isDragging ? "none" : "transform 0.3s ease-out",
        }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}>
        <a
          href={article.url}
          target="_blank"
          rel="noopener noreferrer"
          className="article-item__link"
          onClick={handleArticleClick}>
          <div className="article-item__thumbnail">
            {thumbnail ? (
              <img src={thumbnail} alt={article.title} />
            ) : (
              <div className="article-item__placeholder" />
            )}
            <span className="article-item__section">{article.section}</span>
          </div>
          <div className="article-item__content">
            <h3 className="article-item__title">{article.title}</h3>
            <p className="article-item__abstract">{article.abstract}</p>
          </div>
        </a>

        <button
          className={`article-item__action ${
            favorited
              ? "article-item__action--delete"
              : "article-item__action--favorite"
          } ${showSparks ? "article-item__action--sparking" : ""}`}
          onClick={handleActionClick}
          style={{
            opacity: iconOpacity,
            width: `${Math.max(swipeOffset, 0)}px`, //Dynamically adjust width based on swipe
            transition: isAnimating
              ? "width 0.3s ease-out, opacity 0.3s ease-out"
              : "none",
          }}
          aria-label={favorited ? "Remove from favorites" : "Add to favorites"}>
          <span
            style={{
              transform: `scale(${iconScale})`,
              transition: isDragging
                ? "transform 0.1s ease-out"
                : "transform 0.3s ease-out",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}>
            {favorited ? <FiTrash size={24} /> : <GoBookmarkFill size={24} />}
          </span>
        </button>
      </div>
    </article>
  );
}

export default ArticleItem;
