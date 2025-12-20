"use client";

import Link from "next/link";
import { MdKeyboardArrowRight } from "react-icons/md";
import clsx from "clsx";

interface Breadcrumb {
  label: string;
  href: string;
  active?: boolean;
}

export default function Breadcrumbs({
  breadcrumbs,
}: {
  breadcrumbs: Breadcrumb[];
}) {
  return (
    <nav aria-label="Breadcrumb" className="mb-6 block">
      <ol className="flex text-xl md:text-2xl">
        {breadcrumbs.map((breadcrumb, index) => (
          <li
            key={breadcrumb.href}
            aria-current={breadcrumb.active}
            className={
              breadcrumb.active ? "text-gray-500 pointer-none" : "text-gray-700"
            }
          >
            <Link
              href={breadcrumb.href}
              aria-disabled={breadcrumb.active}
              className={clsx("capitalize", {
                "cursor-not-allowed pointer-events-none": breadcrumb.active,
              })}
            >
              {breadcrumb.label}
            </Link>
            {index < breadcrumbs.length - 1 ? (
              <MdKeyboardArrowRight className="mx-0.5 inline-block" />
            ) : null}
          </li>
        ))}
      </ol>
    </nav>
  );
}
