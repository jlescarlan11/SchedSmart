"use client";

import { motion } from "motion/react";
import React from "react";

import { Col2, Col3, Grid } from "@/components/layout/grid";
import { useScheduler } from "@/hooks/useScheduler";
import { SchedulerProvider } from "@/contexts/SchedulerContext";
import { ActivityForm } from "./components/ActivityForm";
import { ActivityList } from "./components/ActivityList";

const SchedulerSection: React.FC = () => {
  const schedulerData = useScheduler();

  return (
    <SchedulerProvider value={schedulerData}>
      <div id="scheduler" className="wrapper section-spacing min-h-screen py-12">
        {/* Section Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-center mb-16"
        >
          <h2 className="zen-text-accent mb-4">Smart Scheduler</h2>
          <p className="zen-text-secondary max-w-2xl mx-auto">
            Add your activities, set time slots, and let our intelligent algorithm
            create your perfect schedule
          </p>
        </motion.div>

        {/* 2-Column Grid Layout */}
        <Grid>
          {/* Left Column - Activity Form */}
          <Col2>
            <ActivityForm />
          </Col2>

          {/* Right Column - Activity List */}
          <Col3>
            <ActivityList />
          </Col3>
        </Grid>
      </div>
    </SchedulerProvider>
  );
};

export default SchedulerSection;