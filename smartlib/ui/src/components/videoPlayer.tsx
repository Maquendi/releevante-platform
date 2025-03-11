'use client'
import { cn } from "@/lib/utils";
import Image from "next/image";
import React, { useRef } from "react";

interface VideoPlayerProps{
    src:string,
    width?:number,
    height?:number,
    className?:string
}

const VideoPlayer = ({ src, height = 750, width = 430, className }: VideoPlayerProps) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);

    const togglePlayPause = () => {
      if (videoRef.current) {
        if (videoRef.current.paused) {
          videoRef.current.play(); 
        } else {
          videoRef.current.pause(); 
        }
      }
    };

    const aspectRatio = `${height}/${width}`

  return (
    <div className="relative">
      <video style={{aspectRatio}}  ref={videoRef} autoPlay muted  className={cn('rounded-[0.6rem] z-20',className)} width={width} height={height} >
        <source src={src} type="video/mp4" />
      </video>
      <button
        onClick={togglePlayPause}
        className="absolute top-2 z-50 right-2  rounded-full  focus:outline-none"
      >
       <Image src="/icons/play.svg" className="w-auto h-auto" width={40} height={40}  alt="play icon"></Image>
      </button>
    </div>
  );
};

export default VideoPlayer;
