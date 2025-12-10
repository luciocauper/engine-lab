"use client";

import {
  HomeIcon,
  BeakerIcon,
  NewspaperIcon,
  InformationCircleIcon,
  UserGroupIcon,
} from "@heroicons/react/24/outline";
import clsx from "clsx";
import { usePathname } from "next/navigation";
import Link from "next/link";

export const links = [
  { name: "Home", href: "/", icon: HomeIcon },
  { name: "Pesquisa", href: "/pesquisa", icon: BeakerIcon },
  { name: "Notícias", href: "/noticias", icon: NewspaperIcon },
  { name: "Membros", href: "/membros", icon: UserGroupIcon },
  { name: "Sobre", href: "/sobre", icon: InformationCircleIcon },
];

export default function NavLinks() {
  const pathname = usePathname();
  return (
    // Container horizontal e centralizado
    <div className="flex flex-row items-center justify-center gap-2">
      {links.map((link) => {
        const LinkIcon = link.icon;
        return (
          <Link
            key={link.name}
            href={link.href}
            className={clsx(
              "flex items-center px-3 h-[48px] rounded-full hover:font-medium hover:text-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-900 transition-colors",
              {
                "bg-emerald-50 dark:bg-emerald-900 text-emerald-600 dark:text-emerald-50 font-medium":
                  pathname === link.href,
              }
            )}
          >
            <LinkIcon className="w-5 h-5" />
            <p className="capitalize ml-2">{link.name}</p>
          </Link>
        );
      })}
    </div>
  );
}
