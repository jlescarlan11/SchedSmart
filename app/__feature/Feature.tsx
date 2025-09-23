"use client";

import { motion } from "motion/react";
import { LuCheckCheck, LuCloudLightning, LuTimer } from "react-icons/lu";

const features = [
  {
    icon: LuCloudLightning,
    title: "Lightning Fast",
    description: "Instant schedule generation",
  },
  {
    icon: LuCheckCheck,
    title: "Effortless Planning",
    description: "Simplified activity management",
  },
  {
    icon: LuTimer,
    title: "Smart Optimization",
    description: "Conflict-free scheduling",
  },
];

const FeatureSection = () => {
  return (
    <div className="wrapper section-spacing">
      {/* Section Title */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="text-center mb-16"
      >
        <h2 className="zen-text-accent mb-4">Why SmartSched?</h2>
        <p className="zen-text-secondary max-w-2xl mx-auto">
          Experience the perfect balance of simplicity and power in intelligent scheduling
        </p>
      </motion.div>

      {/* Features Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
        className="zen-grid grid-cols-1 md:grid-cols-3"
      >
        {features.map((feature, idx) => {
          const Icon = feature.icon;
          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: idx * 0.1, ease: "easeOut" }}
              className="zen-card text-center zen-spacing-sm group"
            >
              <div className="zen-flex-center mb-6">
                <div className="p-4 rounded-2xl bg-primary/5 border border-primary/10 group-hover:bg-primary/10 group-hover:border-primary/20 transition-all duration-300">
                  <Icon className="w-8 h-8 text-primary/70 group-hover:text-primary transition-colors duration-300" />
                </div>
              </div>
              <h3 className="zen-text-primary font-medium text-lg mb-3">{feature.title}</h3>
              <p className="zen-text-secondary text-sm text-center">{feature.description}</p>
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
};

export default FeatureSection;
