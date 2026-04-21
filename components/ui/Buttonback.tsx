"use client";
import { useRouter } from 'next/navigation';
import React from 'react'

type Props = {
    title: string;
}

export default function ButtonBack({ title }: Props)  {
    const router = useRouter();

    return (
        <button onClick={() => router.back()} className='px-5 py-y bg-black text-white rounded-xl cursor-pointer'>{title}</button>
    )
}