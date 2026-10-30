import Link from "next/link";
import { KidProvider } from "../../components/KidState";
import KidTopBar from "../../components/KidTopBar";

export const metadata = { title: "HehuLab: learn and play" };

// The kids' app on the web: a top bar with the child's language, stars and menu, then a wide page.
export default function KidAppLayout({ children }) {
  return (
    <KidProvider>
      <div className="min-h-screen bg-soft">
        <KidTopBar />
        <div className="wrap py-8">{children}</div>
        <footer className="wrap pb-8 text-sm text-muted">
          <Link href="/" className="hover:text-brand">HehuLab</Link> · Rodas and the animal friends are AI teachers. Every
          voice is a real family voice.
        </footer>
      </div>
    </KidProvider>
  );
}
