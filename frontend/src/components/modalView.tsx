// components/Modal.tsx
import { ReactNode } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
}

export default function ModalView({ isOpen, onClose, children }: ModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/10">
      <div className="bg-white rounded-2xl shadow-md border border-gray-200 w-full max-w-md min-h-[220px] px-6 py-4 flex flex-col justify-center items-center">
        {children}
      </div>
    </div>
  );
}
