export default function ModelPage({
  params,
}: {
  params: { modelId: string };
}) {
  return (
    <main className="flex min-h-full items-center justify-center bg-[#262624] px-6 text-[#f0f0f5]">
      <div className="text-center">
        <p className="text-sm uppercase tracking-[0.2em] text-[#a1a19d]">Model</p>
        <h1 className="mt-3 text-3xl font-semibold">{params.modelId}</h1>
      </div>
    </main>
  );
}
