import BookCard from "@/components/bookCard";
import { getbooks } from "@/lib/book";

export default async function BooksPage() {
  const data = await getbooks();

  const books = data.books || [];

  return (
    <div className=" bg-white min-h-screen items-center justify-center  py-16 px-6">
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 border  md:p-10 relative w-full aspect-3/4 ">
        {books.map((book: any) => (
          <BookCard
            key={book._id}
            id={book._id}
            title={book.title}
            coverImage={book.cover_image}
          />
        ))}
      </div>
    </div>
  );
}
