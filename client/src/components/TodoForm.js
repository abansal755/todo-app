import { useContext, useState } from "react";
import ErrorContext from "../context/ErrorContext";
import useHttp from "../hooks/useHttp";

const TodoForm = props => {
    const [text,setText] = useState('');
    const textInputHandler = e => setText(e.target.value);

    const http = useHttp();
    const errCtx = useContext(ErrorContext);
    
    const formSubmitHandler = e => {
        e.preventDefault();
        e.stopPropagation();
        if(!e.target.checkValidity()){
            e.target.classList.add('was-validated');
            return;
        }
        http.sendRequest({
            url: '/api/todos',
            method: 'POST',
            data: {
                text
            }
        },
        data => {
            props.setTodos(prev => {
                return [data,...prev];
            })
            setText('');
        },
        data => {
            errCtx.addError(data.error.message);
        })
        e.target.classList.remove('was-validated');
    }

    return (
        <div className="row mb-3">
            <div className="col col-lg-6 ms-auto me-auto">
                <div className="card">
                    <form className="card-body" onSubmit={formSubmitHandler} noValidate>
                        <textarea className="form-control" placeholder="Enter text" onInput={textInputHandler} value={text} required/>
                        <div className="invalid-feedback">
                            Todo text must be atleast 1 character long
                        </div>
                        <div className="mt-2 d-flex">
                            {http.isComplete === false && (
                                <div className="spinner-border text-secondary"></div>
                            )}
                            <button className="btn btn-primary ms-auto" disabled={http.isComplete === false}>Add</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default TodoForm;