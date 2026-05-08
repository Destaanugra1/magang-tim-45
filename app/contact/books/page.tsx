import BookCard from "@/components/bookCard";
import { FadeIn, Stagger } from "@/components/ui/motion";
import { getbooks } from "@/lib/book";

type BookPreview = {
  _id: string;
  title: string;
  cover_image: string;
};

export default async function BooksPage() {
  const data = await getbooks();

  const books = (data.books || []) as BookPreview[];

  return (
    <div className=" bg-white min-h-screen items-center justify-center  py-16 px-6">
      <FadeIn className="mb-8 text-center">
        <h1 className="text-4xl font-semibold text-slate-900">Koleksi Buku</h1>
        <p className="mt-3 text-slate-600">Telusuri daftar buku dengan animasi yang lebih halus.</p>
      </FadeIn>
      <Stagger className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 border md:p-10 relative w-full">
        {books.map((book) => (
          <BookCard
            key={book._id}
            id={book._id}
            title={book.title}
            coverImage={book.cover_image}
          />
        ))}
      </Stagger>
    </div>
  );
}
