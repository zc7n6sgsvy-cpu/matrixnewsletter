import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-6">
      <div className="text-center">
        <div className="font-mono text-[#54f0a0] text-sm tracking-[4px]">SIGNAL LOST</div>
        <h1 className="mt-2 text-7xl font-semibold tracking-[-3px]">404</h1>
        <p className="mt-4 text-[#aecabb] max-w-xs mx-auto">This transmission does not exist in the archive.</p>
        <Link href="/" className="mt-8 inline-block font-mono text-sm border border-[#54f0a0] px-6 py-3 hover:bg-[#54f0a0] hover:text-[#031208] transition">
          RETURN TO BASE
        </Link>
      </div>
    </div>
  );
}
