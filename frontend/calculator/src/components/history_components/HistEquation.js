import "./HistEquation.css";

const HistEquation = ({ expression, result, onClick }) => {
    return (
      <button className="hist-equation" onClick={onClick}>
          <div className="expression">{expression} = </div>
          <div className="result">{result}</div>
      </button>
    );
}

export default HistEquation;
