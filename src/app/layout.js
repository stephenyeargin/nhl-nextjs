import localFont from "next/font/local";
import { config } from '@fortawesome/fontawesome-svg-core'
import '@fortawesome/fontawesome-svg-core/styles.css'
import MainNav from "./components/MainNav";
import "./globals.css";
import TopBarSchedule from "./components/TopBarSchedule";

config.autoAddCss = false

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata = {
  title: "Gamecenter",
  description: "NHL Gamecenter clone in Next.js",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <MainNav />
        <section id="root" className="py-5">
          <TopBarSchedule />
          {children}
        </section>
      </body>
    </html>
  );
}
