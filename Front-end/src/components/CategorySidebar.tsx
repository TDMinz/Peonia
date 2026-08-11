import { Flower2 } from "lucide-react";



type CategorySidebarProps = {
  categories: {
    id: string;
    name: string;
    slug: string;
    parentSlug: string;
  }[];
  activeSlug?: string;
};

export default function CategorySidebar({
  categories,
  activeSlug,
}: CategorySidebarProps) {

  return (
    <div className="rounded-[2rem] bg-white p-6 shadow-sm">

      <h3 className="mb-6 text-lg font-semibold uppercase tracking-[0.15em] text-foreground">
        Danh mục
      </h3>

      <div className="space-y-1">
  {categories.map((item) => (
    <button
      key={item.id}
      type="button"
      onClick={() => {
    window.history.pushState(
      {},
      "",
      `/${item.parentSlug}/${item.slug}`
    );

    window.dispatchEvent(new PopStateEvent("popstate"));
  }}
      className={`
        flex items-center gap-3
        rounded-xl
        px-3 py-3
        transition-all duration-200
        ${
          activeSlug === item.slug
            ? "bg-[#f3ece3] text-[#6F4E37]"
            : "text-[#404040] hover:bg-[#f8f4ef]"
        }
      `}
    >
      <Flower2
        className={`h-4 w-4 ${
          activeSlug === item.slug
            ? "text-[#C49A6C]"
            : "text-[#9f9f9f]"
        }`}
      />

      <span className="text-sm font-medium">
        {item.name}
      </span>
    </button>
  ))}
</div>

    </div>
  );
}