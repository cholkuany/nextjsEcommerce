import Link from "next/link";
import dbConnect from "@/app/lib/mongodbConnection";
import Category from "@/models/category";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

// React Icons
import {
  FaBoxOpen,
  FaPlusSquare,
  FaChartBar,
  FaUserFriends,
  FaClipboardList,
  FaTags,
} from "react-icons/fa";

export default async function AdminDashboard() {
  await dbConnect();
  const categories = await Category.find({}).sort({ createdAt: -1 });
  const session = await auth();
  if (!session) {
    redirect("/signin");
  }
  if (session?.user?.role !== "admin") {
    redirect("/");
  }
  return (
    <div className="space-y-8 max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center">
        Welcome, {session?.user.name}
      </h1>

      <section>
        <h2 className="text-xl font-semibold mb-4">Quick Links</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {cardContents.map((card) => (
            <DashboardCard key={card.title} {...card} />
          ))}
        </div>
      </section>
    </div>
  );
}

function DashboardCard({
  title,
  href,
  Icon,
}: {
  title: string;
  href: string;
  Icon: React.ElementType;
}) {
  return (
    <Link href={href}>
      <div className="flex items-center gap-4 p-6 border rounded-xl shadow hover:shadow-md transition bg-white hover:bg-zinc-50 cursor-pointer">
        <Icon className="w-6 h-6 text-green-600" />
        <h3 className="text-lg font-medium">{title}</h3>
      </div>
    </Link>
  );
}

const cardContents = [
  { title: "Products", href: "/admin/products", Icon: FaBoxOpen },
  {
    title: "Create Product",
    href: "/admin/products/create",
    Icon: FaPlusSquare,
  },
  { title: "Orders", href: "/admin/orders", Icon: FaClipboardList },
  { title: "Users", href: "/admin/users", Icon: FaUserFriends },
  { title: "Categories", href: "/admin/categories", Icon: FaTags },
  { title: "Analytics", href: "/admin/analytics", Icon: FaChartBar },
];
