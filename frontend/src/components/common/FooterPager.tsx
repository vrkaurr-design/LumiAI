import Link from "next/link";

type Props = {
  previousHref?: string;
  previousLabel?: string;
  nextHref?: string;
  nextLabel?: string;
  hideNext?: boolean;
  hidePrevious?: boolean;
};

export default function FooterPager({
  previousHref,
  previousLabel = "Back",
  nextHref,
  nextLabel = "Begin Now",
  hideNext = false,
  hidePrevious = false,
}: Props) {
  return (
    <div className="mt-16 flex items-center justify-between border-t border-white/20 dark:border-white/10 pt-6">
      {hidePrevious
        ? null
        : previousHref
        ? (
          <Link
            href={previousHref}
            className="px-5 py-2.5 rounded-full bg-white/70 dark:bg-white/10 text-dark dark:text-white backdrop-blur hover:bg-white/85 dark:hover:bg-white/20 transition-colors text-sm font-semibold shadow-sm"
          >
            {previousLabel}
          </Link>
        ) : (
          <span className="px-5 py-2.5 rounded-full bg-white/40 dark:bg-white/5 text-gray-400 text-sm font-semibold cursor-not-allowed">
            {previousLabel}
          </span>
        )}

      {hideNext ? null : nextHref ? (
        <Link
          href={nextHref}
          className="px-5 py-2.5 rounded-full bg-primary text-white hover:bg-opacity-90 transition-colors text-sm font-semibold shadow-md"
        >
          {nextLabel}
        </Link>
      ) : (
        <span className="px-5 py-2.5 rounded-full bg-white/40 dark:bg-white/5 text-gray-400 text-sm font-semibold cursor-not-allowed">
          {nextLabel}
        </span>
      )}
    </div>
  );
}
