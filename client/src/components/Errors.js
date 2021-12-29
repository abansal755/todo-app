import { useContext } from "react";
import ErrorContext from "../context/ErrorContext";
import ErrorItem from './ui/ErrorItem';

const Errors = () => {
    const errCtx = useContext(ErrorContext);

    return (
        <div className="container mt-5">
            {errCtx.errors.map(err => (
                <ErrorItem text={err.text} key={err._id} />
            ))}
        </div>
    );
}

export default Errors;