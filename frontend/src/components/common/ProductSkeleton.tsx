'use client';

type ProductSkeletonProps = {
  className?: string;
};

export default function ProductSkeleton({ className = '' }: ProductSkeletonProps) {
  return (
    <div className={`rounded-xl border bg-white/80 dark:bg-white/10 p-4 shadow-md ${className}`}>
      <div className="h-36 rounded-lg bg-gray-200/70 dark:bg-white/10 animate-pulse" />
      <div className="mt-3 h-4 w-3/4 rounded bg-gray-200/70 dark:bg-white/10 animate-pulse" />
      <div className="mt-2 h-3 w-1/2 rounded bg-gray-200/70 dark:bg-white/10 animate-pulse" />
      <div className="mt-4 h-8 w-full rounded bg-gray-200/70 dark:bg-white/10 animate-pulse" />
    </div>
  );
}
