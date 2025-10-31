import { useFavoritesStore } from "../../store/favorites_store/favorites_store";
import Category from "../../components/category/category";
import "../../styles/pages/archive.scss";

function Archive() {
  const { favorites, getAllCategories } = useFavoritesStore();
  const categories = getAllCategories();

  if (favorites.length === 0) {
    return (
      <div className="archive archive--empty">
        <p>No favorited articles yet</p>
      </div>
    );
  }

  return (
    <main className="archive">
      {categories.map((category) => {
        const categoryFavorites = favorites.filter(
          (fav) => fav.category === category
        );

        return (
          <Category
            key={category}
            section={category}
            title={category.toUpperCase()}
            articles={categoryFavorites}
            isArchivePage={true}
          />
        );
      })}
    </main>
  );
}

export default Archive;
