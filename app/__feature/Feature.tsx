"use client";

import { motion } from "motion/react";
import { LuCheckCheck, LuCloudLightning, LuTimer } from "react-icons/lu";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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
              className="group"
            >
              <Card className="text-center h-full transition-all duration-300 hover:shadow-md border-border/20 bg-card/50 backdrop-blur-sm">
                <CardHeader className="pb-4">
                  <div className="zen-flex-center mb-2">
                    <div className="p-4 rounded-2xl bg-primary/5 border border-primary/10 group-hover:bg-primary/10 group-hover:border-primary/20 transition-all duration-300">
                      <Icon className="w-8 h-8 text-primary/70 group-hover:text-primary transition-colors duration-300" />
                    </div>
                  </div>
                  <CardTitle className="text-lg font-medium">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="zen-text-secondary text-sm">{feature.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
};

export default FeatureSection;
