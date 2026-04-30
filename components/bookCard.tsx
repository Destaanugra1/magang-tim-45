"use client";

import { motion } from "framer-motion";
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
    <motion.div
      variants={{
        initial: { opacity: 0, y: 20 },
        animate: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] },
        },
      }}
      whileHover={{ y: -6 }}
    >
    <Link href={`/books/${id}`} className="block overflow-hidden rounded-2xl border bg-white p-3 shadow-sm">
      <Image
        src={coverImage}
        alt={title}
        width={200}
        height={300}
        className="h-auto w-full rounded-xl object-cover"
        onError={() => setHidden(true)}
      />
      <div className="mt-3">
        <h1 className="line-clamp-2 text-sm font-medium text-slate-900">{title}</h1>
      </div>
      
    </Link>
    </motion.div>
  );
}
