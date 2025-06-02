import { IconType } from "react-icons";
import { useEffect } from "react";

export function Modal({
  message,
  onClose,
  icon: Icon,
}: {
  message: string;
  onClose: () => void;
  icon: IconType;
}) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 1000);

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-lg shadow-lg p-6 max-w-sm w-full flex flex-col items-center">
        <Icon className="text-blue-600 mr-2 text-6xl" />
        <h3 className="text-sm text-gray-700">{message}</h3>
      </div>
    </div>
  );
}
