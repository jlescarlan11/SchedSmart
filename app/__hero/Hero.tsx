"use client";

import { motion } from "motion/react";
import Link from "next/link";
import ActivityCarousel from "./ActivityCarousel";
import { Col2, Col3, Grid } from "@/components/layout/grid";
import { Button } from "@/components/ui/button";

const HeroSection = () => {
  return (
    <div className="wrapper section-spacing">
      <Grid>
        <Col2>
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="zen-spacing-lg"
          >
            <div className="zen-spacing-md">
              <h1 className="zen-text-primary">Smart Scheduling with Intention</h1>
              <p className="zen-text-secondary text-lg leading-relaxed">
                Experience mindful planning with our intelligent scheduling tool. 
                Designed for focus, and effortless organization of any activity.
              </p>
            </div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <Link href="/#scheduler" className="flex-1">
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full"
                >
                  <Button size="lg" className="w-full">
                    Schedule Now
                  </Button>
                </motion.div>
              </Link>
              <Link href="/guide" className="flex-1">
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full"
                >
                  <Button variant="outline" size="lg" className="w-full">
                    Learn How
                  </Button>
                </motion.div>
              </Link>
            </motion.div>
          </motion.div>
        </Col2>
        <Col3>
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          >
            <ActivityCarousel />
          </motion.div>
        </Col3>
      </Grid>
    </div>
  );
};

export default HeroSection;
