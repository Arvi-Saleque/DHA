export default function Header({ title }: { title: string }) {
  return (
    <header className="w-full border-b bg-white">
      <div className="mx-auto max-w-5xl px-4 py-6">
        <h1 className="text-2xl font-bold">{title}</h1>
      </div>
    </header>
  );
}
