export default function CrossIcon({ size = 16, className = "" }) {
  return (
    <svg
      width={size} height={size} viewBox="0 0 24 24" fill="none"
      xmlns="http://www.w3.org/2000/svg" aria-hidden="true" className={className}
    >
      <path d="M6 6L18 18M18 6L6 18" stroke="#22333B" strokeWidth="1.8" strokeLinecap="round"/>
    </svg>
  );
}
