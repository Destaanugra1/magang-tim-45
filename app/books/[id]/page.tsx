import ButtonBack from "@/components/ui/Buttonback";
import { getbookById } from "@/lib/book";
import Image from "next/image";

type DetailAnggotaProps = {
    params: {
        id: string;
    }
}

export default async function DetailBooks({ params }: DetailAnggotaProps) {
  const { id } = await params;
  const books = await getbookById(id);

  if (!books) {
    return <h1 className="text-center mt-10">Book not found</h1>;
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        
        
        <div className="relative w-full aspect-3/4rounded-2xl overflow-hidden shadow-lg">
          <Image
            src={books.cover_image}
            alt={books.title}
            fill
            className="object-cover"
          />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            {books.title}
          </h1>

          <p className="mt-2 text-sm text-gray-500">
             {books.author?.name}
          </p>

          <p className="mt-1 text-sm text-gray-500">
             {books.category?.name}
          </p>

          <p className="mt-4 text-gray-600 leading-relaxed">
            {books.summary}
          </p>

          {/* ✅ DETAILS */}
          <div className="mt-6 space-y-2 text-sm text-gray-600">
            <p> {books.details?.price}</p>
            <p> {books.details?.total_pages}</p>
            <p> {books.details?.published_date}</p>
            <p> {books.publisher}</p>
          </div>

        
          <div className="mt-6 flex flex-wrap gap-2">
            {books.tags?.map((tag: any, i: number) => (
              <span
                key={i}
                className="text-xs bg-gray-200 px-3 py-1 rounded-full"
              >
                {tag.name}
              </span>
            ))}
          </div>

            <div className="gap-4 mt-6 flex">
            {books.buy_links?.[0] && (
            <a
              href={books.buy_links[0].url}
              target="_blank"
              className="inline-block mt-8 bg-black text-white px-6 py-3 rounded-xl hover:bg-gray-800 transition"
            >
              Beli Buku
            </a>
          )}
        <ButtonBack  title="kembali" />
            </div>
          
        </div>
       

      </div>
    </div>
  );
}