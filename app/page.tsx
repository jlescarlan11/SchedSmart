import FeatureSection from "./__feature/Feature";
import HeroSection from "./__hero/Hero";
import SchedulerSection from "./__scheduler/Scheduler";

export default function Home() {
  return (
    <div className="zen-spacing-xl">
      <HeroSection />
      <FeatureSection />
      <SchedulerSection />
    </div>
  );
}
