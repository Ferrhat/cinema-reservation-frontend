import type { Metadata } from "next";
import localFont from "next/font/local";
import "@/styles/globals.css";
import StoreProvider from "../StoreProvider";
import {NextIntlClientProvider} from 'next-intl';
import {getMessages} from 'next-intl/server';

const geistSans = localFont({
  src: "../../fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "../../fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Cinema Reservation",
  description: "Cinema Reservation",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const messages = await getMessages();

  return (
    <StoreProvider>
      <html>
        <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
          <NextIntlClientProvider messages={messages}>
            {children}
          </NextIntlClientProvider>
        </body>
      </html>
    </StoreProvider>
  );
}
