import { useState } from "react";
import Category from "../../components/category/category";
import { NYT_SECTIONS } from "../../constants/sections";
import { useSettingsStore } from "../../store/settings_store/settings_store";

import "../../styles/pages/home.scss";

const SECTIONS_PER_PAGE = 4;
const INITIAL_LOAD = 4;

function Home() {
  const [visibleCount, setVisibleCount] = useState(INITIAL_LOAD);
  const { isCategoryEnabled } = useSettingsStore();

  // Filter out disabled categories
  const enabledSections = NYT_SECTIONS.filter(({ section }) =>
    isCategoryEnabled(section)
  );

  const visibleSections = enabledSections.slice(0, visibleCount);
  const hasMore = visibleCount < enabledSections.length;

  const loadMore = () => {
    setVisibleCount((prev) =>
      Math.min(prev + SECTIONS_PER_PAGE, enabledSections.length)
    );
  };

  if (enabledSections.length === 0) {
    return (
      <div className="home home--empty">
        <p>No categories enabled. Enable categories in Settings.</p>
      </div>
    );
  }

  return (
    <main className="home">
      {visibleSections.map(({ section, title }) => (
        <Category
          key={section}
          type="topstories"
          section={section}
          title={title}
        />
      ))}

      {hasMore && (
        <button className="home__load-more" onClick={loadMore}>
          Load More Categories ({enabledSections.length - visibleCount}{" "}
          remaining)
        </button>
      )}
    </main>
  );
}

export default Home;
