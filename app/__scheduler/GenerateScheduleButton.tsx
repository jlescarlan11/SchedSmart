import { Button } from "@/components/ui/button";
import { LuDownload } from "react-icons/lu";

// Generate Schedule Button Component
interface GenerateButtonProps {
  onGenerate: () => void;
  canGenerate: boolean;
}

export const GenerateScheduleButton: React.FC<GenerateButtonProps> = ({
  onGenerate,
  canGenerate,
}) => (
  <Button
    onClick={onGenerate}
    disabled={!canGenerate}
    size="lg"
    className="w-full disabled:opacity-50 disabled:cursor-not-allowed"
  >
    <LuDownload className="h-4 w-4 mr-2" />
    Generate Optimal Schedule
    {!canGenerate && (
      <span className="ml-2 text-xs opacity-75">(Add courses first)</span>
    )}
  </Button>
);
