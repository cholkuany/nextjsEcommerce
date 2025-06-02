export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen flex items-center justify-center text-center p-4">
      <div>
        <h1 className="text-4xl font-bold mb-4">Access Denied</h1>
        <p className="text-lg text-gray-600">
          You do not have permission to view this page.
        </p>
      </div>
    </div>
  );
}
