export default function TVLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <style>{`html{font-size:max(16px,1.5vw)}`}</style>
      {children}
    </>
  );
}
