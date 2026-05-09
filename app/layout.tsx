import type { Metadata, Viewport } from 'next';
import { Plus_Jakarta_Sans, Outfit } from 'next/font/google'
import './globals.css';
import { Providers } from "./providers";

const plusJakarta = Plus_Jakarta_Sans({ 
  subsets: ['latin'],
  variable: '--font-sans',
})

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-display',
})

export const viewport: Viewport = {
  themeColor: '#4CAF85',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export const metadata: Metadata = {
  title: 'Flowance',
  description: 'Sleek Personal Finance',
  icons: {
    apple: 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png',
  },
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="id" className={`${plusJakarta.variable} ${outfit.variable}`}>
       <body suppressHydrationWarning className="font-sans antialiased text-slate-900 bg-[#F9FAFB]">
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
