import { Button } from "@/components/ui/button";
import Link from "next/link";
import CourseCarousel from "./CourseCarousel";
import { Col2, Col3, Grid } from "@/components/layout/grid";

const HeroSection = () => {
  return (
    <div className="section-spacing">
      <Grid>
        <Col2>
          <div className="flex flex-col gap-8">
            <h1>Schedule Courses in One Tap</h1>
            <p>
              Join 20 million students using the #1 course scheduling tool for
              effortless academic planning.
            </p>
            <div className="flex flex-col md:flex-row md:items-center gap-4">
              <Link href="/schedule">
                <Button size="lg" className="w-full">
                  Schedule Now
                </Button>
              </Link>
              <Link href="/guide">
                <Button size="lg" variant="outline" className="w-full">
                  Scheduling Guide
                </Button>
              </Link>
            </div>
          </div>
        </Col2>
        <Col3>
          <CourseCarousel />
        </Col3>
      </Grid>
    </div>
  );
};

export default HeroSection;
