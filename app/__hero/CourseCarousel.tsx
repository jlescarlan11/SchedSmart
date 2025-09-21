"use client";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import Image from "next/image";

const images = [
  {
    id: 1,
    src: "/dog.webp",
    title: "Weekly Schedule Overview",
    description:
      "View all your courses at a glance with detailed weekly planning",
  },
  {
    id: 2,
    src: "/dog.webp",
    title: "Course Registration",
    description: "Easy course selection and enrollment process for students",
  },
  {
    id: 3,
    src: "/dog.webp",
    title: "Assignment Tracker",
    description: "Keep track of all your assignments and important deadlines",
  },
];

const CourseCarousel = () => {
  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setSelectedImage((prev) => (prev + 1) % images.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full max-w-6xl mx-auto p-6">
      <div className="relative flex justify-center items-start min-h-[300px]">
        {images.map((image, index) => {
          const isActive = index === selectedImage;
          const offset =
            (index - selectedImage + images.length) % images.length;

          if (offset > 1) return null; // Only show 2 cards max

          return (
            <motion.div
              key={image.id}
              animate={{
                y: offset * -24,
                scale: 1 - offset * 0.05,
                opacity: isActive ? 1 : 0.8 - offset * 0.2,
              }}
              transition={{ duration: 0.3 }}
              className="absolute w-full max-w-2xl bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden"
              style={{ zIndex: 30 - offset * 10 }}
            >
              <div className="p-8">
                <h3
                  className={`text-xl font-bold mb-3 ${
                    isActive ? "text-gray-900" : "text-gray-700"
                  }`}
                >
                  {image.title}
                </h3>
                <p
                  className={`text-base leading-relaxed mb-6 ${
                    isActive ? "text-gray-600" : "text-gray-500"
                  }`}
                >
                  {image.description}
                </p>
                <div className="w-full h-48 bg-gray-50 rounded-xl overflow-hidden">
                  <Image
                    src={image.src}
                    alt={image.title}
                    width={700}
                    height={192}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src =
                        "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNzAwIiBoZWlnaHQ9IjE5MiIgdmlld0JveD0iMCAwIDcwMCAxOTIiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI3MDAiIGhlaWdodD0iMTkyIiBmaWxsPSIjZjNmNGY2Ii8+CjxjaXJjbGUgY3g9IjM1MCIgY3k9Ijk2IiByPSIzMCIgZmlsbD0iIzk0YTNiOCIvPgo8dGV4dCB4PSIzNTAiIHk9IjE0MCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0iIzk0YTNiOCIgZm9udC1mYW1pbHk9InNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTQiPkltYWdlPC90ZXh0Pgo8L3N2Zz4=";
                    }}
                  />
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default CourseCarousel;
