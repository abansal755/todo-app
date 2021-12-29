const ErrorItem = props => {
    return (
        <div className="row">
            <div className="col col-lg-6 ms-auto me-auto">
                <div className="alert alert-danger alert-dismissible fade show d-flex justify-content-between">
                    <div>{props.text}</div>
                    <div className="spinner-border"/>
                </div>
            </div>
        </div>
    );
}

export default ErrorItem;