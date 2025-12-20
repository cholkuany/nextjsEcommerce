import { fetchCategories } from "@/app/lib/data";

export default async function Categories() {
  const categories = await fetchCategories();

  return (
    <div>
      <h1 className="font-extrabold text-6xl tracking-tighter mb-8">
        Categories
      </h1>
      <div className="flex flex-col gap-y-6">
        {categories.map((category) => {
          return (
            <div key={category.slug} className="border-b-4">
              <div className="flex flex-col">
                <h2 className="text-[2rem] font-extrabold tracking-tight">
                  {category.name}
                </h2>
                <p className="text-[1rem] font-light">{category.slug}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
