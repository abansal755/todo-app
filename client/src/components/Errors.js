import { Fragment, useContext } from "react";
import ErrorContext from "../context/ErrorContext";

const Errors = () => {
    const errCtx = useContext(ErrorContext);

    return (
        <div className="container mt-5">
            {errCtx.errors.map(err => (
                <div className="row" key={err._id}>
                    <div className="col col-lg-6 ms-auto me-auto">
                        <div className="alert alert-danger alert-dismissible fade show d-flex justify-content-between">
                            <div>{err.text}</div>
                            <div className="spinner-border"/>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}

export default Errors;