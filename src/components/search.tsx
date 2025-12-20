"use client";

import { SlMagnifier } from "react-icons/sl";
import { useSearchParams, usePathname, useRouter } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";

export default function Search({ placeholder }: { placeholder: string }) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const handleSearch = useDebouncedCallback((term: string) => {
    const currentQuery = searchParams.get("query")?.trim() || "";
    const newQuery = term.trim();

    // Prevent unnecessary replace
    if (currentQuery === newQuery) return;

    const params = new URLSearchParams(searchParams);
    params.set("page", "1");
    if (term.trim()) {
      params.set("query", newQuery);
    } else {
      params.delete("query");
    }
    replace(`${pathname}?${params.toString()}`);
    // 
  }, 300);

  return (
    <div className="relative flex max-w-96">
      <label htmlFor="search" className="sr-only">
        Search
      </label>
      <input
        id="search"
        className="peer outline-0 border border-gray-200 block w-full rounded-md py-[9px] pl-10 text-sm placeholder:text-gray-500 focus:border-blue-700"
        placeholder={placeholder}
        onChange={(e) => {
          handleSearch(e.target.value);
        }}
        defaultValue={searchParams.get("query")?.toString()}
      />
      <SlMagnifier className="absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
    </div>
  );
}
