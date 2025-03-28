export default function LoadingOverlay() {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-5 rounded-lg flex flex-col items-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary mb-2"></div>
        <p className="text-gray-700">Processing image...</p>
      </div>
    </div>
  );
}
