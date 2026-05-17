import ButtonBack from "@/components/ui/Buttonback";
import { FadeIn, Stagger, StaggerItem } from "@/components/ui/motion";
import { getbookById } from "@/lib/book";
import Image from "next/image";

type BookTag = {
  name: string;
};

type DetailAnggotaProps = {
  params: {
    id: string;
  };
};

export default async function DetailBooks({ params }: DetailAnggotaProps) {
  const { id } = await params;
  const books = await getbookById(id);

  if (!books) {
    return <h1 className="mt-10 text-center">Book not found</h1>;
  }

  return (
    <div className="max-w-6xl mx-auto mt-12 md:mt-20 p-6">
      <div className="grid grid-cols-1 gap-10 md:grid-cols-2">
        <FadeIn className="relative w-full aspect-3/4 overflow-hidden rounded-2xl shadow-lg">
          <Image
            src={books.cover_image}
            alt={books.title}
            fill
            className="object-cover"
            unoptimized
          />
        </FadeIn>

        <Stagger>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{books.title}</h1>

            <p className="mt-2 text-sm text-gray-500">{books.author?.name}</p>

            <p className="mt-1 text-sm text-gray-500">
              {books.category?.name}
            </p>

            <p className="mt-4 leading-relaxed text-gray-600">
              {books.summary}
            </p>

            <Stagger className="mt-6 space-y-2 text-sm text-gray-600">
              <StaggerItem>{books.details?.price}</StaggerItem>
              <StaggerItem>{books.details?.total_pages}</StaggerItem>
              <StaggerItem>{books.details?.published_date}</StaggerItem>
              <StaggerItem>{books.publisher}</StaggerItem>
            </Stagger>

            <Stagger className="mt-6 flex flex-wrap gap-2">
              {books.tags?.map((tag: BookTag, i: number) => (
                <StaggerItem
                  key={i}
                  className="rounded-full bg-gray-200 px-3 py-1 text-xs"
                >
                  {tag.name}
                </StaggerItem>
              ))}
            </Stagger>

            <div className="mt-6 flex gap-4">
              {books.buy_links?.[0] && (
                <a
                  href={books.buy_links[0].url}
                  target="_blank"
                  className="inline-block mt-8 rounded-xl bg-black px-6 py-3 text-white transition hover:bg-gray-800"
                >
                  Beli Buku
                </a>
              )}
              <ButtonBack title="kembali" />
            </div>
          </div>
        </Stagger>
      </div>
    </div>
  );
}
