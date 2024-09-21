"use client";

import React, { useState, useRef } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { useTheme } from 'next-themes';
import { cn } from "@/lib/utils";
import { Play, Pause, SkipBack, SkipForward } from 'lucide-react';

export function AudioPlayer() {
    const { theme } = useTheme();
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const audioRef = useRef<HTMLAudioElement | null>(null);
  
  const togglePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleSeek = (value: number[]) => {
    if (audioRef.current) {
      audioRef.current.currentTime = value[0];
      setCurrentTime(value[0]);
    }
  };

  const seekTime = (delta: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime += delta;
    }
  };

  return (
    <Card className={cn(
      "shadow-sm",
      theme === "dark" 
        ? "bg-gray-800 text-gray-100" 
        : "bg-white text-gray-800"
    )}>
      <CardContent className="p-4">
        <audio
          ref={audioRef}
          src="/path-to-your-audio-file.mp3"
          onTimeUpdate={handleTimeUpdate}
          onEnded={() => setIsPlaying(false)}
        />
        <div className="flex items-center justify-between mb-4">
          <Button variant="outline" size="icon" onClick={() => seekTime(-10)}>
            <SkipBack className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={togglePlayPause}>
            {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          </Button>
          <Button variant="outline" size="icon" onClick={() => seekTime(10)}>
            <SkipForward className="h-4 w-4" />
          </Button>
        </div>
        <Slider
          value={[currentTime]}
          max={audioRef.current?.duration || 100}
          step={1}
          onValueChange={handleSeek}
        />
      </CardContent>
    </Card>
  );
}