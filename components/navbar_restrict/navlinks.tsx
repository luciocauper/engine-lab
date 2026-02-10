"use client";

import {
  LayoutDashboard,
  Users,
  Newspaper,
  FolderKanban,
} from "lucide-react";
import clsx from "clsx";
import { usePathname } from "next/navigation";
import Link from "next/link";

export const links = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Membros", href: "/pessoas", icon: Users },
  { name: "Notícias", href: "/g_noticias", icon: Newspaper },
  { name: "Projetos", href: "/projetos", icon: FolderKanban },
];

export default function NavLinks() {
  const pathname = usePathname();

  return (
    <div className="flex flex-row items-center justify-center gap-2">
      {links.map((link) => {
        const Icon = link.icon;

        const isActive = pathname === link.href;

        return (
          <Link
            key={link.name}
            href={link.href}
            className={clsx(
              "flex items-center px-3 h-[48px] rounded-full transition-colors",
              "hover:font-medium hover:text-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-900",
              {
                "bg-emerald-50 dark:bg-emerald-900 text-emerald-600 dark:text-emerald-50 font-medium":
                  isActive,
              }
            )}
          >
            <Icon className="w-5 h-5" />
            <span className="ml-2 capitalize">{link.name}</span>
          </Link>
        );
      })}
    </div>
  );
}
