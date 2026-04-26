import "@/styles/global.css";
import Header from "@/components/page/Header";
import Footer from "@/components/page/Footer";

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
          {children}
        </div>
        <Footer />
      </body>
    </html>
  );
}
