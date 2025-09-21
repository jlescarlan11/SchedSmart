import FeatureSection from "./__feature/Feature";
import HeroSection from "./__hero/Hero";
import SchedulerSection from "./__scheduler/Scheduler";

export default function Home() {
  return (
    <div>
      <HeroSection />
      <FeatureSection />
      <SchedulerSection />
    </div>
  );
}
