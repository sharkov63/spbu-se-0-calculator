import "./HistEquation.css";

const HistEquation = ({ value, onClick }) => {
    return (
      <button className="hist-equation" onClick={onClick}>
        {value}
      </button>
    );
}

export default HistEquation;