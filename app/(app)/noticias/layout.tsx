export default function noticiasLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section className="flex flex-col items-center justify-center p-4 mt-16">
      <div className="inline-block max-w-9/10 text-center justify-center">
        {children}
      </div>
    </section>
  );
}
