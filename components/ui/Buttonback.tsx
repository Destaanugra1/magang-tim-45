"use client";
import { useRouter } from 'next/navigation';
import React from 'react'

type Props = {
    title: string;
}

export default function ButtonBack({ title }: Props)  {
    const router = useRouter();

    return (
        <button onClick={() => router.back()} className="inline-block mt-8 bg-black text-white px-6 py-3 rounded-xl hover:bg-gray-800 transition cursor-pointer">
            {title}
        </button>
    )
}