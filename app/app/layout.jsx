import { KidProvider } from "../../components/KidState";

export const metadata = { title: "HehuLab: learn and play" };

// The kids' app: a phone-sized column, centered on big screens.
export default function KidAppLayout({ children }) {
  return (
    <KidProvider>
      <div className="min-h-screen bg-soft md:py-8">
        <div className="mx-auto flex min-h-screen w-full max-w-md flex-col bg-white md:min-h-[820px] md:overflow-hidden md:rounded-[36px] md:border-[10px] md:border-ink">
          {children}
        </div>
      </div>
    </KidProvider>
  );
}
