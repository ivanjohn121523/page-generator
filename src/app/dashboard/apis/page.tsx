export default function Apis() {
  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="pt-8 md:pt-0">
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">APIs</h1>
        <p className="mt-2 text-sm text-gray-600">
          Connect site generation to your own content sources. Keys can be added later.
        </p>
      </div>
      <div className="mt-8 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <p className="text-sm font-medium text-gray-900">No API keys yet</p>
        <p className="mt-1 text-sm text-gray-500">
          This workspace is ready for keys when you wire up a backend.
        </p>
      </div>
    </div>
  );
}
