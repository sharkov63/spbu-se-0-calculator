import "./HistEquation.css";

const HistEquation = ({ expression, result, onClick }) => {
    return (
      <div className="hist-equation" onClick={onClick}>
          <div className="expression">{expression} = </div>
          <div className="result">{result}</div>
      </div>
    );
}

export default HistEquation;
