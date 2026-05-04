// Drop-in replacement for react-toastify — same API, custom UI
let _handler = null;

export const _setHandler = (fn) => { _handler = fn; };

const dispatch = (type, message, options = {}) => {
  const id = options.toastId || String(Date.now() + Math.random());
  _handler?.({ type, message: String(message ?? ''), id, autoClose: options.autoClose ?? 3000 });
  return id;
};

const toast = {
  success: (msg, opts) => dispatch('success', msg, opts),
  error:   (msg, opts) => dispatch('error',   msg, opts),
  warning: (msg, opts) => dispatch('warning', msg, opts),
  warn:    (msg, opts) => dispatch('warning', msg, opts),
  info:    (msg, opts) => dispatch('info',    msg, opts),
  dismiss: () => _handler?.({ type: '_dismiss_all' }),
  update:  (id, opts) => {
    if (!opts) return;
    const type = opts.type ?? 'info';
    const msg  = opts.render ?? opts.message ?? '';
    dispatch(type, msg, { toastId: id, autoClose: opts.autoClose ?? 3000 });
  },
};

export default toast;
