import { LuCheckCheck, LuCloudLightning, LuTimer } from "react-icons/lu";

const features = [
  {
    icon: LuCloudLightning,
    description: "Lightning Fast",
  },
  {
    icon: LuCheckCheck,
    description: "Scheduling Makes Simple",
  },
  {
    icon: LuTimer,
    description: "Instant Result",
  },
];

const FeatureSection = () => {
  return (
    <div className="section-spacing flex gap-8 items-center justify-center">
      {features.map((feature, idx) => {
        const Icon = feature.icon;
        return (
          <div
            className="flex flex-col flex-1 items-center justify-center font-semibold gap-2 border text-muted-foreground/80 hover:text-muted-foreground border-muted-foreground/20 hover:border-muted-foreground text-sm rounded-lg py-4 px-8 transition-all duration-300 ease-in-out"
            key={idx}
          >
            <Icon />
            {feature.description}
          </div>
        );
      })}
    </div>
  );
};

export default FeatureSection;
