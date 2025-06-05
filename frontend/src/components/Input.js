export default function Input({ id, label, type, name, value, onChange, required }) {
    return (
        <div>
            <label htmlFor={id} className="block mb-1 font-medium">
                {label}
            </label>
            <input
                id={id}
                type={type}
                name={name}
                value={value}
                onChange={onChange}
                required={required}
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
        </div>
    );
}
