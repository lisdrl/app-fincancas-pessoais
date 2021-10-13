import './style.css';

export function FilterInput({text, name, id, handleChange, value}) {
    return (
        <div className="flex-column">
            <label className="filters-label">{text}</label>
            <input
                className="filters-input"
                name={name}
                id={id}
                type="number"
                onChange={handleChange}
                value={value}
            ></input>
        </div>
    )
};