import { useEffect, useState } from 'react';
import { _setHandler } from '../utils/notify';

const ICONS = {
  success: (
    <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    </svg>
  ),
  error: (
    <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
  ),
  warning: (
    <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
    </svg>
  ),
  info: (
    <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
};

const COLORS = {
  success: 'border-l-emerald-500 text-emerald-400',
  error:   'border-l-red-500    text-red-400',
  warning: 'border-l-amber-500  text-amber-400',
  info:    'border-l-blue-500   text-blue-400',
};

export default function NotificationContainer() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    _setHandler((event) => {
      if (event.type === '_dismiss_all') {
        setItems([]);
        return;
      }
      const { type, message, id, autoClose } = event;
      setItems((prev) => {
        const exists = prev.find((n) => n.id === id);
        if (exists) {
          return prev.map((n) => (n.id === id ? { ...n, type, message } : n));
        }
        return [...prev, { id, type, message, autoClose }];
      });
      if (autoClose !== false) {
        setTimeout(() => {
          setItems((prev) => prev.filter((n) => n.id !== id));
        }, autoClose);
      }
    });
    return () => _setHandler(null);
  }, []);

  if (!items.length) return null;

  return (
    <div className="fixed top-20 right-4 z-[99999] flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {items.map(({ id, type, message }) => (
        <div
          key={id}
          className={`flex items-start gap-3 px-4 py-3 rounded-lg border-l-4 bg-gray-900/95 backdrop-blur-sm shadow-xl pointer-events-auto transition-all duration-300 ${COLORS[type] ?? COLORS.info}`}
        >
          <span className={COLORS[type] ?? COLORS.info}>{ICONS[type] ?? ICONS.info}</span>
          <p className="text-sm text-gray-200 leading-snug">{message}</p>
          <button
            onClick={() => setItems((prev) => prev.filter((n) => n.id !== id))}
            className="ml-auto text-gray-500 hover:text-gray-300 transition-colors shrink-0"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      ))}
    </div>
  );
}
