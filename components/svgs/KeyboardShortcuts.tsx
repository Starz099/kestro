export default function KeyboardShortcuts({
  className,
}: {
  className?: string;
}) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M13 2m0 1a1 1 0 0 1 1 -1h2.5a1 1 0 0 1 1 1v2.5a1 1 0 0 1 -1 1h-2.5a1 1 0 0 1 -1 -1z" />
      <path d="M13 8m0 1a1 1 0 0 1 1 -1h2.5a1 1 0 0 1 1 1v2.5a1 1 0 0 1 -1 1h-2.5a1 1 0 0 1 -1 -1z" />
      <path d="M13 14m0 1a1 1 0 0 1 1 -1h2.5a1 1 0 0 1 1 1v2.5a1 1 0 0 1 -1 1h-2.5a1 1 0 0 1 -1 -1z" />
      <path d="M8 8m0 1a1 1 0 0 1 1 -1h2.5a1 1 0 0 1 1 1v2.5a1 1 0 0 1 -1 1h-2.5a1 1 0 0 1 -1 -1z" />
      <path d="M8 14m0 1a1 1 0 0 1 1 -1h2.5a1 1 0 0 1 1 1v2.5a1 1 0 0 1 -1 1h-2.5a1 1 0 0 1 -1 -1z" />
      <path d="M8 20m0 1a1 1 0 0 1 1 -1h2.5a1 1 0 0 1 1 1v1.5a1 1 0 0 1 -1 1h-2.5a1 1 0 0 1 -1 -1z" />
      <path d="M3 14m0 1a1 1 0 0 1 1 -1h2.5a1 1 0 0 1 1 1v2.5a1 1 0 0 1 -1 1h-2.5a1 1 0 0 1 -1 -1z" />
      <path d="M3 20m0 1a1 1 0 0 1 1 -1h7.5a1 1 0 0 1 1 1v1.5a1 1 0 0 1 -1 1h-7.5a1 1 0 0 1 -1 -1z" />
      <path d="M14 20l0 2" />
      <path d="M17.5 20l0 2" />
      <path d="M20.5 20l0 1" />
    </svg>
  );
}
