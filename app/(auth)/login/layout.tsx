import "@/styles/globals.css";
import clsx from "clsx";
import { Providers } from "../../providers";
import { fontBrand, fontBricolage, fontMono, fontSans } from "@/config/fonts";

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
        <Providers themeProps={{ attribute: "class", defaultTheme: "dark" }}>
          {children}
        </Providers>
  );
}
