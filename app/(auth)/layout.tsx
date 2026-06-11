export default function AuthLayout({ children }: { children: React.ReactNode }) {
  // Auth pages render full-screen without the RMS app shell (no sidebar/topbar).
  return <div className="h-screen w-full overflow-hidden bg-[#FFFDFB]">{children}</div>;
}
