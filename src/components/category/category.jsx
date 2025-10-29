import { useState, useRef, useEffect } from "react";
import ArticleItem from "../article_item/article_item";
import { IoChevronDown } from "react-icons/io5";
import { useNewsArticles } from "../../hooks/use_news_articles/use_news_articles";
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

  // Limit to 10 articles per category (only for home/popular, not archive)
  const displayArticles = providedArticles
    ? articles // Archive - show all provided articles
    : articles?.slice(0, 10); // Home/Popular - limit to 10

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

  const handleClick = (e) => {
    const content = contentRef.current;
    if (!content) return;

    e.preventDefault();
    e.stopPropagation();

    if (isOpen) {
      const currentHeight = content.scrollHeight;
      content.style.maxHeight = `${currentHeight}px`;
      content.style.overflow = "hidden";

      requestAnimationFrame(() => {
        content.style.transition = "max-height 0.3s ease-out";
        content.style.maxHeight = "0";
      });

      // Only close AFTER animation completes (plz work)
      setTimeout(() => {
        setIsOpen(false);
      }, 300);
    } else {
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

  const handleToggle = (e) => {
    const content = contentRef.current;
    if (!content) return;

    const details = e.currentTarget;

    // If details was closed by browser (e.g., another details with same name opened)
    if (!details.open && isOpen) {
      // Animate close
      content.style.transition = "max-height 0.3s ease-out";
      content.style.maxHeight = "0";

      setTimeout(() => {
        setIsOpen(false);
      }, 300);
    }
  };

  return (
    <details
      className="category"
      open={isOpen}
      name="categories"
      onToggle={handleToggle}>
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
        {displayArticles?.map((article, index) => (
          <ArticleItem
            key={`${section}-${index}-${article.url || article.title || index}`}
            article={article}
            category={favoritesCategory}
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
