"use client";
import React, { PropsWithChildren } from "react";
import { motion } from "motion/react";

export const Grid = ({ children }: PropsWithChildren) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
      className="grid grid-cols-1 lg:grid-cols-5 gap-20"
    >
      {children}
    </motion.div>
  );
};

export const Col3 = ({ children }: PropsWithChildren) => {
  return <div className="lg:col-span-3 relative">{children}</div>;
};

export const Col2 = ({ children }: PropsWithChildren) => {
  return <div className="lg:col-span-2 relative ">{children}</div>;
};
