import Category from "../components/category/category";
import { useSettingsStore } from "../store/settings_store";

function Popular() {
  const { isCategoryEnabled } = useSettingsStore();

  return (
    <main className="popular">
      {isCategoryEnabled("popular-today") && (
        <Category
          type="popular"
          section="1"
          title="TODAY"
          categoryName="popular-today"
        />
      )}

      {isCategoryEnabled("popular-week") && (
        <Category
          type="popular"
          section="7"
          title="THIS WEEK"
          categoryName="popular-week"
        />
      )}

      {isCategoryEnabled("popular-month") && (
        <Category
          type="popular"
          section="30"
          title="THIS MONTH"
          categoryName="popular-month"
        />
      )}
    </main>
  );
}

export default Popular;
