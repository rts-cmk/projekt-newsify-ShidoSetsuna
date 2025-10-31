import { useState, useRef, useEffect } from "react";
import ArticleItem from "../article_item/article_item";
import { IoChevronDown } from "react-icons/io5";
import { useNewsArticles } from "../../hooks/use_news_articles/use_news_articles";
import NYT_logo from "../../assets/nyt_logo.png";
import "./category.scss";

// Custom event to close other categories replacing the old "name" event
const CLOSE_CATEGORY_EVENT = "closeCategoryEvent";

function Category({
  type,
  section,
  title,
  articles: providedArticles,
  categoryName,
  isArchivePage = false,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const contentRef = useRef(null);
  const detailsRef = useRef(null);

  // Only fetch from API if no articles are provided
  const shouldFetch = !providedArticles && type && section;
  const {
    data: fetchedArticles,
    isLoading,
    error,
  } = useNewsArticles(type, section, shouldFetch && isOpen);

  // Use provided articles or fetched articles
  const articles = providedArticles || fetchedArticles;

  // Limit to 10 articles per category (only for home/popular, not archive)
  const displayArticles = providedArticles ? articles : articles?.slice(0, 10);

  const favoritesCategory = categoryName || section;

  // Update max-height when content changes (likke fx when articles load)
  useEffect(() => {
    const content = contentRef.current;
    if (content && isOpen && !isLoading) {
      requestAnimationFrame(() => {
        const newHeight = content.scrollHeight;
        content.style.maxHeight = `${newHeight}px`;
      });
    }
  }, [articles, isLoading, isOpen]);

  // Listen for close events from other categories
  useEffect(() => {
    const handleCloseOthers = (e) => {
      // If this category is open and another category is requesting to close others
      if (isOpen && e.detail.categoryRef !== detailsRef.current) {
        closeWithAnimation();
      }
    };

    window.addEventListener(CLOSE_CATEGORY_EVENT, handleCloseOthers);
    return () => {
      window.removeEventListener(CLOSE_CATEGORY_EVENT, handleCloseOthers);
    };
  }, [isOpen]);

  const closeWithAnimation = () => {
    const content = contentRef.current;
    if (!content) return;

    const currentHeight = content.scrollHeight;
    content.style.maxHeight = `${currentHeight}px`;
    content.style.overflow = "hidden";

    requestAnimationFrame(() => {
      content.style.transition = "max-height 0.3s ease-out";
      content.style.maxHeight = "0";
    });

    setTimeout(() => {
      setIsOpen(false);
    }, 300);
  };

  const handleClick = (e) => {
    const content = contentRef.current;
    if (!content) return;

    e.preventDefault();
    e.stopPropagation();

    if (isOpen) {
      closeWithAnimation();
    } else {
      // Tell other categories to close with animation
      window.dispatchEvent(
        new CustomEvent(CLOSE_CATEGORY_EVENT, {
          detail: { categoryRef: detailsRef.current },
        })
      );

      setIsOpen(true);

      content.style.maxHeight = "0";
      content.style.overflow = "hidden";
      content.style.transition = "none";

      content.offsetHeight;

      requestAnimationFrame(() => {
        const targetHeight = content.scrollHeight;
        content.style.transition = "max-height 0.3s ease-out";
        content.style.maxHeight = `${targetHeight}px`;
      });
    }
  };

  return (
    <details className="category" open={isOpen} ref={detailsRef}>
      <summary className="category__header" onClick={handleClick}>
        <div className="category__icon">
          <img src={NYT_logo} alt="New York Times Logo" />
        </div>
        <h2 className="category__title">{title}</h2>
        <IoChevronDown className="category__chevron" />
      </summary>

      <section className="category__content" ref={contentRef}>
        {isLoading && <p className="category__loading">Loading...</p>}
        {error && (
          <p className="category__error">
            {error.message?.includes("Rate limit")
              ? "Rate limit reached. Try again in a minute."
              : "Error loading articles"}
          </p>
        )}
        {displayArticles?.map((article, index) => (
          <ArticleItem
            key={`${section}-${index}-${article.url || article.title || index}`}
            article={article}
            category={favoritesCategory}
            isArchivePage={isArchivePage}
          />
        ))}
        {displayArticles?.length === 0 && isOpen && (
          <p className="category__empty">No articles in this category</p>
        )}
      </section>
    </details>
  );
}

export default Category;
