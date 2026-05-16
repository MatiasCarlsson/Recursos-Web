import "@/styles/global.css";
import Header from "@/components/page/Header";
import Footer from "@/components/page/Footer";
import StartupNotice from "@/components/page/StartupNotice";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-dvh flex flex-col">
        <div className="flex-1 pt-16">
          <Header />
          <StartupNotice />
          {children}
        </div>
        <Footer />
      </body>
    </html>
  );
}
