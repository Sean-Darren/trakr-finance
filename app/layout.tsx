import type { Metadata } from "next";
import { Merriweather } from "next/font/google";
import "./globals.css";

const merriWeather = Merriweather({
  subsets: ["latin"],
});


export const metadata: Metadata = {
  title: "Trakr Finance",
  description: "Managing your Personal Finance",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <link rel="icon" href="/favicon.ico" sizes="any" />
      <body
        className={`${merriWeather.className} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
