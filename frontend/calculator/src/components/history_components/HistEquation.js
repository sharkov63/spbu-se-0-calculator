import "./HistEquation.css";

const HistEquation = ({ value, onClick }) => {
    return (
      <div className="hist-equation" onClick={onClick}>
        {value}
      </div>
    );
}

export default HistEquation;