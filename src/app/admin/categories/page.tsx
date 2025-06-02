import dbConnect from "@/app/lib/mongodbConnection";
import Category from "@/models/category";

export default async function Categories() {
  await dbConnect();
  const categories = await Category.find({});

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Categories</h1>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
        {categories.map((category) => (
          <div
            key={category._id}
            className="p-6 border rounded-xl shadow hover:shadow-lg transition bg-white"
          >
            <h2 className="text-lg font-semibold">{category.name}</h2>
            <p>{category.slug}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
