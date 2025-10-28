import { useState } from "react";
import { useFavoritesStore } from "../../store/favorites_store";
import { IoStar, IoTrash } from "react-icons/io5";
import "./article_item.scss";

function ArticleItem({ article, category }) {
  const [swipeOffset, setSwipeOffset] = useState(0);
  const [startX, setStartX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  const { toggleFavorite, isFavorited } = useFavoritesStore();
  const favorited = isFavorited(article.url);

  const SWIPE_MAX = 80;
  const SNAP_THRESHOLD = 40;

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
  };

  const handleTouchEnd = () => {
    setIsDragging(false);

    if (swipeOffset > SNAP_THRESHOLD) {
      setSwipeOffset(SWIPE_MAX);
    } else {
      setSwipeOffset(0);
    }
  };

  const handleActionClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(article, category);
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
  const getThumbnail = () => {
    if (article.multimedia && article.multimedia.length > 0) {
      return article.multimedia[0].url;
    }

    if (article.media && article.media.length > 0) {
      const mediaMetadata = article.media[0]["media-metadata"];
      if (mediaMetadata && mediaMetadata.length > 0) {
        return mediaMetadata[0].url;
      }
    }

    return "";
  };

  const thumbnail = getThumbnail();

  return (
    <article className="article-item">
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
          }`}
          onClick={handleActionClick}
          aria-label={favorited ? "Remove from favorites" : "Add to favorites"}>
          {favorited ? <IoTrash size={24} /> : <IoStar size={24} />}
        </button>
      </div>
    </article>
  );
}

export default ArticleItem;
