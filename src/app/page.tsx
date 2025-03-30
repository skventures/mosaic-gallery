import { AssetsSection } from "@/components/sections/AssetsSection";
import { BoardsSection } from "@/components/sections/BoardsSection";


export default function Home() {
  return (
    <main className="min-h-screen w-full">
      <div className="mx-4 px-4 py-8">
        <h1 className="text-2xl font-bold mb-8">Air Gallery</h1>
        <BoardsSection />
        <AssetsSection />
      </div>
    </main>
  );
}
