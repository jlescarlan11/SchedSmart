import Link from "next/link";

const Logo = () => {
  return (
    <Link href="/" className="flex items-center gap-2 lg:gap-4">
      <span className="text-lg font-semibold tracking-wider">SmartSched</span>
    </Link>
  );
};

export default Logo;
