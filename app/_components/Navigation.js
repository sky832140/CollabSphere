import Link from "next/link";

export default function Navigation() {
  return (
    <nav className="z-10 text-xl">
      <ul className="flex gap-16 items-center">
      <li>
        <Link href="/" className="hover:text-accent-400 transition-colors">Home</Link>
      </li>
      <li>
        <Link href="/about" className="hover:text-accent-400 transition-colors">About</Link>
      </li>
      <li>
        <Link href="/dashboard" className="hover:text-accent-400 transition-colors">Dashboard</Link>
      </li>
      <li>
        <Link href="/account" className="hover:text-accent-400 transition-colors">Account</Link>
      </li>
    </ul>
    </nav>
  );
}
