import { useState } from "react";
import "../assets/style/input.css";

const Input = (props) => {
    const [focused, setFocused] = useState(false);
    const { id, label, errorMessage, onChange, forwordref, ...inputProps } = props;

    const handleFocus = (e) => {
        setFocused(true);
    };

    
    return (
        <div className="ipt-group">
            <label>{label}</label>
            <input className="tpfield"
            ref={el => (forwordref.current[id] = el)}
            {...inputProps}
            onChange={onChange}
            onBlur={handleFocus}
            focused={focused.toString()}
            />
            <span>{errorMessage}</span>
        </div>
    )
}

export default Input;