export default function Unauthorized() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center">
      <h1 className="text-4xl font-bold text-red-600 mb-4">⛔ Unauthorized</h1>
      <p className="text-gray-700 text-lg">
        You don’t have permission to access this page.
      </p>
    </div>
  );
}
