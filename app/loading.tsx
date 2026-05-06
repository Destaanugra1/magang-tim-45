"use client"
import { useEffect, useState } from "react";

export default function Loading() {

  const [show, setShow] = useState(false);
 
   useEffect(() => {
     const timer = setTimeout(() => {
       setShow(true);
     }, 5000); // 5 detik
 
     return () => clearTimeout(timer);
   }, []);
  
   if (!show) {
       return (
         <div className="flex min-h-screen items-center justify-center bg-white">
           <div className="relative h-[320px] w-[200px]">
             {[...Array(8)].map((_, i) => (
               <div
                 key={i}
                 className="absolute h-12 w-12 animate-bounce rounded-md bg-blue-500"
                 style={{
                   left: `${(i % 3) * 60}px`,
                   top: `${Math.floor(i / 3) * 60}px`,
                   animationDelay: `${i * 0.12}s`,
                 }}
               />
             ))}
           </div>
         </div>
       );
     }
   
     return null;
}