"use client";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import Image from "next/image";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const images = [
  {
    id: 1,
    src: "/schedule-overview.png",
    title: "Weekly Schedule Overview",
    description:
      "View all your activities at a glance with detailed weekly planning",
  },
  {
    id: 2,
    src: "/smart-organization.png",
    title: "Smart Organization",
    description: "Easy activity selection and intelligent time management",
  },
  {
    id: 3,
    src: "/conflict-resolution.png",
    title: "Conflict Resolution",
    description: "Automatically detect and resolve scheduling conflicts",
  },
];

const ActivityCarousel = () => {
  const [selectedImage, setSelectedImage] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      setSelectedImage((prev) => (prev + 1) % images.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [isPaused]);

  return (
    <div className="w-full max-w-4xl mx-auto p-4 sm:p-6">
      {/* Mobile: Simple carousel */}
      <div className="block md:hidden">
        <motion.div
          key={selectedImage}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <Card className="shadow-lg">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg text-primary">
                {images[selectedImage].title}
              </CardTitle>
              <CardDescription className="text-sm leading-relaxed">
                {images[selectedImage].description}
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="w-full aspect-[16/9] bg-accent/5 rounded-lg overflow-hidden border border-border/20">
                <Image
                  src={images[selectedImage].src}
                  alt={images[selectedImage].title}
                  width={700}
                  height={400}
                  className="w-full h-full object-contain transition-opacity duration-300"
                  onError={(e) => {
                    e.currentTarget.src =
                      "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNzAwIiBoZWlnaHQ9IjQwMCIgdmlld0JveD0iMCAwIDcwMCA0MDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI3MDAiIGhlaWdodD0iNDAwIiBmaWxsPSJjdXJyZW50Q29sb3IiIGZpbGwtb3BhY2l0eT0iMC4xIi8+CjxjaXJjbGUgY3g9IjM1MCIgY3k9IjIwMCIgcj0iNDAiIGZpbGw9ImN1cnJlbnRDb2xvciIgZmlsbC1vcGFjaXR5PSIwLjMiLz4KPHRleHQgeD0iMzUwIiB5PSIyNzAiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9ImN1cnJlbnRDb2xvciIgZmlsbC1vcGFjaXR5PSIwLjUiIGZvbnQtZmFtaWx5PSJzYW5zLXNlcmlmIiBmb250LXNpemU9IjE2Ij5JbWFnZTwvdGV4dD4KPC9zdmc+";
                  }}
                />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Mobile indicators */}
        <div className="flex justify-center mt-4 space-x-2">
          {images.map((_, index) => (
            <Button
              key={index}
              variant="ghost"
              size="icon"
              onClick={() => setSelectedImage(index)}
              className={`w-3 h-3 p-0 rounded-full transition-colors duration-200 ${
                index === selectedImage
                  ? "bg-primary hover:bg-primary/90"
                  : "bg-muted-foreground/30 hover:bg-muted-foreground/50"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Desktop: Stacked cards effect */}
      <div
        className="hidden md:block relative"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        <div className="relative flex justify-center items-start min-h-[400px]">
          {images.map((image, index) => {
            const isActive = index === selectedImage;
            const offset =
              (index - selectedImage + images.length) % images.length;

            // On desktop, show up to 2 cards
            if (offset > 1) return null;

            return (
              <motion.div
                key={image.id}
                animate={{
                  y: offset * -20,
                  scale: 1 - offset * 0.04,
                  rotateX: offset * 2,
                }}
                transition={{
                  duration: 0.8,
                  ease: [0.25, 0.46, 0.45, 0.94],
                  type: "spring",
                  stiffness: 100,
                  damping: 20,
                }}
                className="absolute w-full max-w-2xl"
                style={{
                  zIndex: 30 - offset * 10,
                  transformStyle: "preserve-3d",
                  perspective: "1000px",
                }}
              >
                <Card
                  className={`transition-all duration-300 ${
                    isActive ? "shadow-lg" : "shadow-md"
                  }`}
                >
                  <CardHeader className="pb-3">
                    <CardTitle
                      className={`text-xl transition-colors duration-300 ${
                        isActive ? "text-primary" : "text-muted-foreground"
                      }`}
                    >
                      {image.title}
                    </CardTitle>
                    <CardDescription
                      className={`text-base leading-relaxed transition-opacity duration-300 ${
                        isActive ? "opacity-100" : "opacity-70"
                      }`}
                    >
                      {image.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <motion.div
                      className="w-full aspect-[16/9] bg-accent/5 rounded-lg overflow-hidden border border-border/20"
                      whileHover={{ scale: 1.02 }}
                      transition={{ duration: 0.3, ease: "easeOut" }}
                    >
                      <Image
                        src={image.src}
                        alt={image.title}
                        width={700}
                        height={400}
                        className="w-full h-full object-contain transition-opacity duration-300 hover:opacity-90"
                        onError={(e) => {
                          e.currentTarget.src =
                            "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNzAwIiBoZWlnaHQ9IjQwMCIgdmlld0JveD0iMCAwIDcwMCA0MDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI3MDAiIGhlaWdodD0iNDAwIiBmaWxsPSJjdXJyZW50Q29sb3IiIGZpbGwtb3BhY2l0eT0iMC4xIi8+CjxjaXJjbGUgY3g9IjM1MCIgY3k9IjIwMCIgcj0iNDAiIGZpbGw9ImN1cnJlbnRDb2xvciIgZmlsbC1vcGFjaXR5PSIwLjMiLz4KPHRleHQgeD0iMzUwIiB5PSIyNzAiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9ImN1cnJlbnRDb2xvciIgZmlsbC1vcGFjaXR5PSIwLjUiIGZvbnQtZmFtaWx5PSJzYW5zLXNlcmlmIiBmb250LXNpemU9IjE2Ij5JbWFnZTwvdGV4dD4KPC9zdmc+";
                        }}
                      />
                    </motion.div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ActivityCarousel;
