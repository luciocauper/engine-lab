import {
  Fira_Code as FontMono,
  Space_Grotesk as FontSans,
  Syne as Brand,
  Bricolage_Grotesque as Bricolage,
} from "next/font/google";

export const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const fontMono = FontMono({
  subsets: ["latin"],
  variable: "--font-mono",
});

export const fontBrand = Brand({
  subsets: ["latin"],
  variable: "--font-brand",
});

export const fontBricolage = Bricolage({
  subsets: ["latin"],
  variable: "--font-bricolage",
});
