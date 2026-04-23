"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

type BookCardProps = {
  id: string;
  title: string;
  coverImage: string;
};

export default function BookCard({ id, title, coverImage }: BookCardProps) {
  const [hidden, setHidden] = useState(false);

  if (hidden) return null;
  if (!id || !title) return null;
  if (typeof coverImage !== "string" || !coverImage.trim()) return null;

  return (
    <Link href={`/books/${id}`}>
      <Image
        src={coverImage}
        alt={title}
        width={200}
        height={300}
        onError={() => setHidden(true)}
      />
      <div className=" "><h1 className="">{title}</h1></div>
      
    </Link>
  );
}
