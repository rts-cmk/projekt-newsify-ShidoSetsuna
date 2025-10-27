import { useState, useRef, useEffect } from "react";
import ArticleItem from "../article_item/article_item";
import { IoChevronDown } from "react-icons/io5";
import { useNewsArticles } from "../../hooks/use_news_articles";
import "./category.scss";

function Category({
  type,
  section,
  title,
  articles: providedArticles,
  categoryName,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const contentRef = useRef(null);

  // Only fetch from API if no articles are provided
  const shouldFetch = !providedArticles && type && section;
  const {
    data: fetchedArticles,
    isLoading,
    error,
  } = useNewsArticles(type, section, shouldFetch && isOpen);

  // Use provided articles or fetched articles
  const articles = providedArticles || fetchedArticles;

  const favoritesCategory = categoryName || section;

  // Update max-height when content changes (e.g., when articles load)
  useEffect(() => {
    const content = contentRef.current;
    if (content && isOpen && !isLoading) {
      // Recalculate and update height when articles finish loading
      requestAnimationFrame(() => {
        const newHeight = content.scrollHeight;
        content.style.maxHeight = `${newHeight}px`;
      });
    }
  }, [articles, isLoading, isOpen]);

  const handleClick = (e) => {
    e.preventDefault(); // Prevent default summary click

    const content = contentRef.current;
    const details = content.closest("details");
    if (!content || !details) return;

    if (isOpen) {
      // Closing: animate to 0 first, then close
      const currentHeight = content.scrollHeight;
      content.style.maxHeight = `${currentHeight}px`;
      content.style.overflow = "hidden";

      requestAnimationFrame(() => {
        content.style.transition = "max-height 0.3s ease-out";
        content.style.maxHeight = "0";
      });

      // Only close after animation completes
      setTimeout(() => {
        setIsOpen(false);
      }, 300);
    } else {
      // Opening: open first, then animate
      setIsOpen(true);

      // Immediately hide content before it can render
      content.style.maxHeight = "0";
      content.style.overflow = "hidden";
      content.style.transition = "none";

      // Force reflow then animate
      content.offsetHeight;

      requestAnimationFrame(() => {
        const targetHeight = content.scrollHeight;
        content.style.transition = "max-height 1s ease-out";
        content.style.maxHeight = `${targetHeight}px`;
      });
    }
  };

  return (
    <details className="category" open={isOpen} name="categories">
      <summary className="category__header" onClick={handleClick}>
        <div className="category__icon">N</div>
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
        {articles?.map((article, index) => (
          <ArticleItem
            key={`${section}-${index}-${article.url || article.title || index}`}
            article={article}
            category={favoritesCategory}
          />
        ))}
        {articles?.length === 0 && isOpen && (
          <p className="category__empty">No articles in this category</p>
        )}
      </section>
    </details>
  );
}

export default Category;
