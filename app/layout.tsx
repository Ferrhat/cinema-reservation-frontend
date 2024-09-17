import type { Metadata } from "next";
import localFont from "next/font/local";
import "@/styles/globals.css";
import StoreProvider from "./StoreProvider";

const geistSans = localFont({
  src: "../fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "../fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Cinema Reservation",
  description: "Cinema Reservation",
};

export default async function RootLayout({
  children,
  params: {locale}
}: {
  children: React.ReactNode;
  params: {locale: string};
}) {

  return (
    <StoreProvider>
      <html lang={locale}>
        <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
          {children}
        </body>
      </html>
    </StoreProvider>
  );
}
