"use client"
import React from 'react'
import { motion } from 'framer-motion';
import Home from '@/public/home.png'
import Image from 'next/image';

const Hero = () => {
  return (
    <div>
         <section className="relative w-full max-w-7xl mx-auto px-6 pt-16 md:pt-20 pb-0 flex flex-col items-center text-center overflow-hidden h-screen">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="z-10"
      >
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight leading-tight text-[#0B1120] mb-6">
          Tim Kami <br /> Membangun kerja sama
        </h1>
        
        <p className="text-lg md:text-xl text-gray-500 mb-10 max-w-2xl mx-auto">
          Kami mengerjakan proyek dengan semangat kolaborasi, inovasi, dan dedikasi untuk mencapai hasil terbaik. Bergabunglah dengan kami untuk menciptakan solusi yang berdampak dan membangun masa depan yang lebih baik bersama-sama.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-6 md:mb-0">
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center justify-center bg-[#0B1120] text-white px-8 py-4 rounded-full font-semibold text-base shadow-lg hover:bg-black transition-all"
          >
            join tim saya
            <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </motion.button>

          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center justify-center bg-white text-[#0B1120] px-8 py-4 rounded-full font-semibold text-base border border-gray-200 shadow-sm hover:bg-gray-50 transition-all"
          >
            <div className="w-7 h-7 rounded-full bg-gray-200 overflow-hidden mr-3">
              <img 
                src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" 
                alt="Avatar" 
                className="w-full h-full object-cover"
              />
            </div>
            Explore
          </motion.button>
        </div>
      </motion.div>


      <motion.div 
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="w-full max-w-6xl relative flex-1 -mt-20 md:-mt-28"
      >
        <div className="relative h-full rounded-t-[4rem] overflow-hidden shadow-2xl">
          <Image
            src={Home} 
            alt="Students Community" 
            fill
            sizes="(min-width: 1280px) 1152px, 100vw"
            className="object-cover object-top"
          />
          <div className="absolute inset-0 bg-linear-to-t from-white/10 to-transparent pointer-events-none" />
        </div>
      </motion.div>
    </section>
    </div>
  )
}

export default Hero