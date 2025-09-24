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
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const steps = [
  {
    number: "01",
    title: "Add Your Activities",
    icon: BookOpen,
    description:
      "Start by adding all the activities you need to schedule. Think of activities like 'Math Class', 'Study Group', or 'Work Meeting'. Give each one a clear, simple name.",
    details: [
      "Use simple, descriptive names like 'Math 101' or 'Team Meeting'",
      "Avoid symbols like @, #, or spaces in names",
      "Make sure each activity has a unique name",
      "Example: Instead of 'Meeting@3pm', use 'Marketing Meeting'",
    ],
  },
  {
    number: "02",
    title: "Set Available Times",
    icon: Clock,
    description:
      "For each activity, tell SmartSched when it can happen. You can add multiple time options for the same activity.",
    details: [
      "Choose which days the activity is available (Monday, Tuesday, etc.)",
      "Set the start and end times (like 9:00 AM to 10:30 AM)",
      "Add different time options if an activity can happen at various times",
      "Example: Math class could be Monday 9-10 AM or Tuesday 2-3 PM",
    ],
  },
  {
    number: "03",
    title: "Connect Related Activities",
    icon: Link2,
    description:
      "Link activities that belong together or can't happen at the same time. This ensures they're scheduled properly and prevents conflicts.",
    details: [
      "Connect related activities (like a lecture and its lab)",
      "Set up prerequisites (like 'Study' must come before 'Exam')",
      "Mark activities that conflict with each other",
      "Example: Connect 'Math Lecture' with 'Math Lab' so they're scheduled together",
    ],
  },
  {
    number: "04",
    title: "Create Your Schedule",
    icon: Calendar,
    description:
      "Click the generate button and let SmartSched create your perfect schedule. It will find the best times for all your activities.",
    details: [
      "Review your new schedule to make sure it looks right",
      "Check that all your activities are included",
      "Make sure there are no time conflicts",
      "Verify you have enough time between activities",
    ],
  },
  {
    number: "05",
    title: "Save & Share",
    icon: Download,
    description:
      "Download your schedule as an image file that you can print, share, or save to your computer.",
    details: [
      "Download as a high-quality image file",
      "Save different versions if you make changes",
      "Share with teachers, friends, or family",
      "Print a copy to keep with you",
    ],
  },
];

const tips = [
  {
    title: "Start with Everything",
    description:
      "Add all your activities first before connecting them. This gives you a complete picture of what needs to be scheduled.",
    icon: Lightbulb,
  },
  {
    title: "Leave Time Between Activities",
    description:
      "If you need to travel between locations or prepare for the next activity, add buffer time between them.",
    icon: Clock,
  },
  {
    title: "Check Your Connections",
    description:
      "Before generating your schedule, review all the connections between activities to make sure they make sense.",
    icon: CheckCircle,
  },
  {
    title: "Add Backup Times",
    description:
      "If an activity can happen at different times, add multiple time options to give SmartSched more flexibility.",
    icon: Calendar,
  },
];

const faqs = [
  {
    question: "What if an activity can happen at different times?",
    answer:
      "Perfect! Add all the possible time slots for that activity. SmartSched will pick the best times that work with your other activities. For example, if 'Math Class' can be Monday 9-10 AM or Tuesday 2-3 PM, add both options.",
  },
  {
    question: "How do I handle activities that are related to each other?",
    answer:
      "If activities are connected (like a lecture and its lab), add them as separate activities and then connect them. This ensures they're scheduled in the right order and don't conflict with each other.",
  },
  {
    question: "Can I change an activity after I've added it?",
    answer:
      "Absolutely! Click the edit button next to any activity to change its name, times, or connections. You can make changes anytime before or after generating your schedule.",
  },
  {
    question: "What if SmartSched can't create a schedule?",
    answer:
      "Don't worry! SmartSched will tell you what's causing the problem. Usually it's because activities are trying to use the same time slot. Try adjusting the times or removing some connections between activities.",
  },
  {
    question: "How many activities can I add?",
    answer:
      "You can add as many activities as you need! SmartSched works great with 5 activities or 50 activities. Just make sure to give each one a unique name.",
  },
  {
    question: "Can I save my work and come back later?",
    answer:
      "Yes! Your activities and settings are automatically saved in your browser. When you come back, everything will be exactly as you left it.",
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
              Learn how to create perfect schedules with SmartSched in just 5
              simple steps. Our easy-to-follow guide will help you organize your
              activities, avoid conflicts, and make the most of your time.
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
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.4, ease: "easeOut" }}
            >
              <Accordion type="single" collapsible className="zen-surface">
                {faqs.map((faq, index) => (
                  <AccordionItem key={index} value={`item-${index}`} className="border-border/20">
                    <AccordionTrigger className="zen-text-primary text-left font-medium hover:no-underline px-6 py-4">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="zen-text-secondary leading-relaxed px-6 pb-4">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </motion.div>
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
            <h2 className="zen-text-accent mb-6">
              Ready to Create Your Schedule?
            </h2>
            <p className="zen-text-secondary mb-8 max-w-2xl mx-auto leading-relaxed">
              You&apos;re all set! Now it&apos;s time to put what you&apos;ve
              learned into practice. Start by adding your first activity and
              watch SmartSched create your perfect schedule in seconds.
            </p>
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button asChild size="lg">
                <Link href="/">Start Scheduling</Link>
              </Button>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
