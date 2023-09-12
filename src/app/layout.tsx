import Script from "next/script";
import { Providers } from "./providers";
import { Header } from "@/components/Header";
import "./global.css";
import { Metadata } from "next";

const title = "GPU and TPU Cost and Availability Comparison Tool";
const description =
  "A free tool to compare NVIDIA GPU instance and TPU instance prices and availability across cloud providers for machine learning and AI.";

export const metadata: Metadata = {
  title,
  description,
  openGraph: {
    title,
    description,
    images: ["https://gpucost.com/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <Script src="https://www.googletagmanager.com/gtag/js?id=G-WH8KX9Z28K" />
      <Script id="google-analytics">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());

          gtag('config', 'G-WH8KX9Z28K');
        `}
      </Script>
      <body>
        <Providers>
          <Header />
          {children}
        </Providers>
      </body>
    </html>
  );
}
