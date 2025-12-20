import { fetchUsers } from "@/app/lib/data";
import Image from "next/image";
export default async function Users() {
  const users = await fetchUsers();
  return (
    <div>
      <h1 className="font-extrabold text-6xl tracking-tighter mb-8">Users</h1>
      <div className="flex flex-col gap-y-6">
        {users.map((user) => {
          return (
            <div key={user.name} className="border-b-4">
              <div className="flex justify-center gap-x-4">
                <div className="justify-self-start">
                  <Image
                    src={user.image}
                    width={50}
                    height={50}
                    alt={`${user.name}'s profile image`}
                    className="rounded-full mt-2"
                  />
                </div>
                <div className="grow">
                  <h2 className="text-[1.5rem] tracking-tighter capitalize">
                    {user.name}
                  </h2>
                  <p className="text-[1rem] font-light">Email: {user.email}</p>
                  <p className="text-[1rem] font-light">Role: {user.role}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
