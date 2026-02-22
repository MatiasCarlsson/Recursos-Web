import "@/styles/global.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <main className="h-screen">
          <Header />
          {children}
          <Footer />
        </main>
      </body>
    </html>
  );
}
