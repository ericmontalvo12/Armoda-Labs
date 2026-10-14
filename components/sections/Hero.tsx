import Image from "next/image";
import Link from "next/link";

export function Hero() {
  return (
    <section className="relative overflow-hidden mt-[100px] sm:mt-[110px]">
      <h1 className="sr-only">Built for Men Who Read Labels — Research-backed testosterone support</h1>

      {/* Mobile — text baked into image, whole hero links to product */}
      <Link href="/product" className="sm:hidden relative w-full aspect-square block">
        <Image
          src="/hero-mobile.jpg"
          alt="Peak Performance — Built for Men Who Read Labels. Shop Now."
          fill
          sizes="100vw"
          className="object-cover object-center"
          priority
        />
      </Link>

      {/* Desktop — text baked into image, whole hero links to product */}
      <Link href="/product" className="hidden sm:block relative w-full" style={{ aspectRatio: "2172 / 724" }}>
        <Image
          src="/hero-mountain.jpg"
          alt="Peak Performance — Built for Men Who Read Labels. Shop Now."
          fill
          sizes="100vw"
          className="object-cover object-center"
          priority
        />
      </Link>
    </section>
  );
}
