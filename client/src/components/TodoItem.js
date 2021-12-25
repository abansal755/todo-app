import { useState } from "react";
import {cloneDeep} from 'lodash';
import useHttp from "../hooks/useHttp";

const TodoItem = props => {
    const [text,setText] = useState(props.text);
    const textInputHandler = e => setText(e.target.value);

    const http = useHttp();

    const textChangeHandler = () => {
        http.sendRequest({
            url: `/api/todos/${props._id}`,
            method: 'PATCH',
            data: {
                text
            }
        },
        () => {
            props.setTodos(prev => {
                const newTodos = cloneDeep(prev);
                for(let i = 0; i < newTodos.length; i++){
                    if(newTodos[i]._id !== props._id) continue;
                    newTodos[i].text = text;
                    break;
                }
                return newTodos;
            })
        })
    }

    const completeChangeHandler = () => {
        http.sendRequest({
            url: `/api/todos/${props._id}`,
            method: 'PATCH',
            data: {
                isCompleted: !props.isCompleted
            }
        },
        () => {
            props.setTodos(prev => {
                const newTodos = cloneDeep(prev);
                for(let i = 0; i < newTodos.length; i++){
                    if(newTodos[i]._id !== props._id) continue;
                    newTodos[i].isCompleted = !props.isCompleted;
                    break;
                }
                return newTodos;
            })
        })
    }

    const deleteTodoHandler = () => {
        http.sendRequest({
            url: `/api/todos/${props._id}`,
            method: 'DELETE'
        },
        () => {
            props.setTodos(prev => {
                const newTodos = cloneDeep(prev);
                let idx = -1;
                for(let i = 0; i < newTodos.length; i++){
                    if(newTodos[i]._id === props._id){
                        idx = i;
                        break;
                    }
                }
                newTodos.splice(idx,1);
                return newTodos;
            })
        })
    }

    return (
        <div className="row mb-3">
            <div className="col col-lg-6 ms-auto me-auto">
                <div className="card">
                    <form className='card-body'>
                        <textarea className="form-control" value={text} onInput={textInputHandler} disabled={props.isCompleted}/>
                        <div className="d-flex mt-2">
                            {http.isComplete === false && (
                                <div className="spinner-border text-secondary"></div>
                            )}
                            <button className="btn btn-success ms-auto me-2" disabled={props.isCompleted || http.isComplete === false} type='button' onClick={textChangeHandler}>Save</button>
                            <button className="btn btn-warning me-2" type='button' onClick={completeChangeHandler} disabled={http.isComplete === false}>
                                Mark as {props.isCompleted ? 'incomplete' : 'complete'}
                            </button>
                            <button className="btn btn-danger me-2" type='button' onClick={deleteTodoHandler} disabled={http.isComplete === false}>Delete</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default TodoItem;