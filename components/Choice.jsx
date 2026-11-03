// A row of big buttons where one is chosen (language, boy/girl, report language).
// `options` is a list of [id, label, sub]; `sub` is shown in Ge'ez letters next to the label.
export default function Choice({ options, value, onPick }) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map(([id, label, sub]) => (
        <button
          key={id}
          type="button"
          onClick={() => onPick(id)}
          aria-pressed={value === id}
          className={`rounded-2xl border-[3px] px-4 py-2.5 text-left font-extrabold transition ${
            value === id ? "border-brand bg-soft" : "border-line bg-white hover:border-brand/50"
          }`}
        >
          {label}
          {sub && <span className="ml-2 font-geez font-semibold text-muted">{sub}</span>}
        </button>
      ))}
    </div>
  );
}
