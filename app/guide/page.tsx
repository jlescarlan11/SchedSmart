"use client";

import { motion } from "motion/react";
import Link from "next/link";
import {
  BookOpen,
  Clock,
  Link2,
  Calendar,
  Download,
  Lightbulb,
  CheckCircle,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

const steps = [
  {
    number: "01",
    title: "Add Your Activities",
    icon: BookOpen,
    description:
      "Start by entering your activity names. Each activity needs a unique identifier like 'Meeting-A' or 'Class-101'.",
    details: [
      "Use clear, descriptive activity names",
      "Avoid special characters or spaces",
      "Keep names consistent and meaningful",
    ],
  },
  {
    number: "02",
    title: "Define Time Slots",
    icon: Clock,
    description:
      "For each activity, add available time slots including days, start time, and end time.",
    details: [
      "Select the days when the activity is available",
      "Set precise start and end times",
      "Add multiple time slots if the activity has different options",
      "Consider break times between activities",
    ],
  },
  {
    number: "03",
    title: "Set Dependencies",
    icon: Link2,
    description:
      "Link activities that cannot overlap in time, such as prerequisite activities or conflicting schedules.",
    details: [
      "Add prerequisite relationships",
      "Mark activities that cannot happen simultaneously",
      "Consider related session conflicts",
      "Review all dependencies before generating",
    ],
  },
  {
    number: "04",
    title: "Generate Schedule",
    icon: Calendar,
    description:
      "Let SmartSched create optimized schedules that respect all your constraints and preferences.",
    details: [
      "Review the generated schedule carefully",
      "Check for any conflicts or issues",
      "Verify all activities are included",
      "Ensure break times are adequate",
    ],
  },
  {
    number: "05",
    title: "Export & Save",
    icon: Download,
    description:
      "Download your schedule as an image or save it for future reference and planning.",
    details: [
      "Export as high-quality image",
      "Save multiple schedule versions",
      "Share with advisors or peers",
      "Print for offline reference",
    ],
  },
];

const tips = [
  {
    title: "Plan Ahead",
    description:
      "Add all your activities before setting dependencies to get a complete view of your schedule.",
    icon: Lightbulb,
  },
  {
    title: "Consider Travel Time",
    description:
      "Leave buffer time between activities in different locations or requiring setup time.",
    icon: Clock,
  },
  {
    title: "Review Dependencies",
    description:
      "Double-check all activity dependencies to ensure your schedule is conflict-free.",
    icon: CheckCircle,
  },
  {
    title: "Multiple Options",
    description:
      "Add alternative time slots for activities to increase scheduling flexibility.",
    icon: Calendar,
  },
];

const faqs = [
  {
    question: "What if I have activities with multiple time options?",
    answer:
      "Add all available time slots for each activity. SmartSched will choose the best combination to create an optimal schedule without conflicts.",
  },
  {
    question: "How do I handle related sessions or sub-activities?",
    answer:
      "Treat related sessions as separate activities if they have different time slots, or add dependencies between related activities to ensure proper scheduling.",
  },
  {
    question: "Can I modify an activity after adding it?",
    answer:
      "Yes! Click the edit button next to any activity to modify its details, time slots, or dependencies at any time.",
  },
  {
    question: "What happens if no valid schedule exists?",
    answer:
      "SmartSched will notify you of conflicts and suggest which constraints to review. Consider adjusting time slots or dependencies.",
  },
];

export default function GuidePage() {
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
          <h1 className="zen-text-primary mb-8">Scheduling Guide</h1>
          <div className="max-w-3xl mx-auto zen-spacing-md">
            <p className="text-xl zen-text-secondary leading-relaxed">
              Learn how to create perfect schedules with SmartSched. Follow our
              step-by-step guide to master intelligent scheduling and optimize
              your time management.
            </p>
          </div>
        </motion.div>

        <Separator className="my-16" />

        {/* Steps Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          className="zen-spacing-lg"
        >
          <h2 className="text-center mb-16 zen-text-accent">
            How to Use SmartSched
          </h2>
          <div className="zen-spacing-lg">
            {steps.map((step, index) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{
                  duration: 0.6,
                  delay: 0.4 + index * 0.1,
                  ease: "easeOut",
                }}
                className="zen-card"
              >
                <div className="flex flex-col lg:flex-row gap-8">
                  <div className="flex-shrink-0">
                    <div className="zen-flex-center w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20">
                      <step.icon className="w-8 h-8 text-primary/70" />
                    </div>
                  </div>
                  <div className="flex-1 zen-spacing-sm">
                    <div className="flex items-center gap-4 mb-4">
                      <Badge
                        variant="outline"
                        className="zen-text-accent text-xs font-mono"
                      >
                        {step.number}
                      </Badge>
                      <h3 className="text-xl font-medium zen-text-primary">
                        {step.title}
                      </h3>
                    </div>
                    <p className="zen-text-secondary mb-6 leading-relaxed">
                      {step.description}
                    </p>
                    <ul className="zen-spacing-xs">
                      {step.details.map((detail, detailIndex) => (
                        <li
                          key={detailIndex}
                          className="flex items-start gap-3"
                        >
                          <CheckCircle className="w-4 h-4 text-primary/60 mt-0.5 flex-shrink-0" />
                          <span className="zen-text-secondary text-sm">
                            {detail}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Tips Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8, ease: "easeOut" }}
          className="zen-spacing-lg"
        >
          <h2 className="text-center mb-16 zen-text-accent">Pro Tips</h2>
          <div className="zen-grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
            {tips.map((tip, index) => (
              <motion.div
                key={tip.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.6,
                  delay: 1.0 + index * 0.1,
                  ease: "easeOut",
                }}
                className="zen-card text-center zen-spacing-sm"
              >
                <div className="zen-flex-center mb-4">
                  <div className="p-3 rounded-xl bg-primary/5 border border-primary/10">
                    <tip.icon className="w-6 h-6 text-primary/70" />
                  </div>
                </div>
                <h3 className="font-medium zen-text-primary mb-3">
                  {tip.title}
                </h3>
                <p className="zen-text-secondary text-sm leading-relaxed">
                  {tip.description}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* FAQ Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.2, ease: "easeOut" }}
          className="zen-spacing-lg"
        >
          <h2 className="text-center mb-16 zen-text-accent">
            Frequently Asked Questions
          </h2>
          <div className="max-w-4xl mx-auto zen-spacing-md">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.6,
                  delay: 1.4 + index * 0.1,
                  ease: "easeOut",
                }}
              >
                <Card className="zen-card">
                  <CardHeader>
                    <CardTitle className="zen-text-primary text-lg font-medium">
                      {faq.question}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="zen-text-secondary leading-relaxed">
                      {faq.answer}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.8, ease: "easeOut" }}
          className="zen-spacing-lg"
        >
          <div className="zen-surface p-12 zen-shadow-soft text-center">
            <h2 className="zen-text-accent mb-6">Ready to Get Started?</h2>
            <p className="zen-text-secondary mb-8 max-w-2xl mx-auto leading-relaxed text-center">
              Now that you know how SmartSched works, it&apos;s time to create
              your perfect schedule. Start by adding your first activity and
              experience the power of intelligent scheduling.
            </p>
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button asChild size="lg">
                <Link href="/">
                  Start Scheduling
                </Link>
              </Button>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
