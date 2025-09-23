"use client";

import { motion } from "motion/react";
import { Calendar, Users, Zap, Heart } from "lucide-react";

const values = [
  {
    icon: Calendar,
    title: "Simplicity",
    description: "We believe in removing complexity to reveal the essential. Every feature serves a purpose, every design choice has intention."
  },
  {
    icon: Users,
    title: "Accessibility",
    description: "Scheduling should be accessible to all. Our tools are designed to work for everyone, regardless of technical expertise."
  },
  {
    icon: Zap,
    title: "Efficiency",
    description: "Time is precious. We create tools that help you accomplish more with less effort, focusing on what truly matters."
  },
  {
    icon: Heart,
    title: "Mindfulness",
    description: "Inspired by minimalism, we design with intention, creating space for clarity and focused thinking."
  }
];

const team = [
  {
    name: "John Lester Escarlan",
    role: "Creator & Developer",
    description: "Passionate about creating tools that simplify scheduling and time management through thoughtful design and efficient algorithms."
  }
];

export default function AboutPage() {
  return (
    <div className="wrapper">
      <div className="section-spacing zen-spacing-xl">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center zen-spacing-lg"
        >
          <h1 className="zen-text-primary mb-8">About SmartSched</h1>
          <div className="max-w-3xl mx-auto zen-spacing-md">
            <p className="text-xl zen-text-secondary leading-relaxed text-center">
              SmartSched was born from a simple belief: scheduling should be intuitive, 
              efficient, and stress-free. Inspired by principles of 
              simplicity and purposeful design.
            </p>
          </div>
        </motion.div>

        <div className="zen-divider" />

        {/* Mission Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          className="zen-spacing-lg"
        >
          <div className="zen-surface p-12 zen-shadow-soft">
            <h2 className="text-center mb-12 zen-text-accent">Our Mission</h2>
            <div className="max-w-4xl mx-auto zen-spacing-md">
              <p className="text-center zen-text-secondary text-lg leading-relaxed">
                To create intelligent scheduling tools that eliminate the complexity of time management, 
                allowing people to focus on what matters most: their goals and priorities. We achieve this 
                through clean design, powerful algorithms, and an unwavering commitment to user experience.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Values Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
          className="zen-spacing-lg"
        >
          <h2 className="text-center mb-16 zen-text-accent">Our Values</h2>
          <div className="zen-grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 + index * 0.1, ease: "easeOut" }}
                className="zen-card text-center zen-spacing-sm"
              >
                <div className="zen-flex-center mb-6">
                  <div className="p-4 rounded-2xl bg-primary/5 border border-primary/10">
                    <value.icon className="w-8 h-8 text-primary/70" />
                  </div>
                </div>
                <h3 className="text-lg font-medium zen-text-primary mb-4">{value.title}</h3>
                <p className="zen-text-secondary text-sm leading-relaxed">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Team Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8, ease: "easeOut" }}
          className="zen-spacing-lg"
        >
          <h2 className="text-center mb-16 zen-text-accent">Meet the Team</h2>
          <div className="max-w-2xl mx-auto">
            {team.map((member, index) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 1.0 + index * 0.1, ease: "easeOut" }}
                className="zen-card text-center zen-spacing-sm"
              >
                <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 zen-flex-center">
                  <span className="text-2xl font-light zen-text-primary">
                    {member.name.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
                <h3 className="text-xl font-medium zen-text-primary mb-2">{member.name}</h3>
                <p className="zen-text-accent text-sm font-medium mb-4 tracking-wide uppercase text-center">
                  {member.role}
                </p>
                <p className="zen-text-secondary leading-relaxed text-center">{member.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Philosophy Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.2, ease: "easeOut" }}
          className="zen-spacing-lg"
        >
          <div className="zen-surface p-12 zen-shadow-soft">
            <h2 className="text-center mb-12 zen-text-accent">Design Philosophy</h2>
            <div className="max-w-4xl mx-auto zen-spacing-md">
              <div className="grid md:grid-cols-3 gap-8">
                <div className="text-center zen-spacing-sm">
                  <h3 className="zen-text-primary font-medium mb-4">Reduce</h3>
                  <p className="zen-text-secondary text-sm leading-relaxed">
                    Reduce to the essential. Every element serves a purpose, every interaction has meaning.
                  </p>
                </div>
                <div className="text-center zen-spacing-sm">
                  <h3 className="zen-text-primary font-medium mb-4">Tranquility</h3>
                  <p className="zen-text-secondary text-sm leading-relaxed">
                    Embrace tranquility. Clean interfaces that promote focus and reduce cognitive load.
                  </p>
                </div>
                <div className="text-center zen-spacing-sm">
                  <h3 className="zen-text-primary font-medium mb-4">Aesthetic</h3>
                  <p className="zen-text-secondary text-sm leading-relaxed">
                    Aesthetics through function. Elegant solutions that work seamlessly and intuitively.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
