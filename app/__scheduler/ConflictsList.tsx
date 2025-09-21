"use client";

import React from "react";
import { motion } from "framer-motion";
import { AlertCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface ConflictsListProps {
  conflicts: string[];
}

export const ConflictsList: React.FC<ConflictsListProps> = ({ conflicts }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-red-600 dark:text-red-400">
          <AlertCircle className="h-4 w-4" />
          Scheduling Conflicts ({conflicts.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            {conflicts.map((conflict, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="p-3 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-lg"
              >
                <div className="text-sm text-red-700 dark:text-red-300">
                  {conflict}
                </div>
              </motion.div>
            ))}
          </div>

          <Alert className="border-amber-200 dark:border-amber-800">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Some courses couldn&apos;t be scheduled due to time conflicts.
              Consider adding more time slot options or adjusting existing ones.
            </AlertDescription>
          </Alert>
        </div>
      </CardContent>
    </Card>
  );
};
