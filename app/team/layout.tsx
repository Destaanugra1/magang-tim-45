import Balatro from "@/components/Balatro";

export default function TeamLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[#f8f8f6]">
      <div className="fixed inset-0 -z-10">
        <Balatro
          isRotate
          mouseInteraction
          pixelFilter={1160}
          color1="#fff"
          color2="#fff"
          color3="#6bd5e8"
        />
      </div>
      <div className="relative z-10">{children}</div>
    </div>
  );
}
