import { Fragment, useContext, useEffect, useState } from "react";
import TodoItem from "../components/TodoItem";
import useHttp from '../hooks/useHttp';
import TodoForm from "../components/TodoForm";
import ErrorContext from "../context/ErrorContext";
import SpinnerCard from '../components/ui/SpinnerCard';

const Dashboard = () => {
    const [todos,setTodos] = useState([]);
    const http = useHttp();
    const errCtx = useContext(ErrorContext);

    useEffect(() => {
        http.sendRequest({
            url: '/api/todos'
        },
        data => {
            data.reverse();
            setTodos(data);
        },
        data => {
            errCtx.addError(data.error.message);
        })
    }, []);
    
    return (
        <Fragment>
            <TodoForm setTodos={setTodos}/>
            {http.isComplete === false && <SpinnerCard/>}
            {http.isComplete && (
                todos.map(todo => (
                    <TodoItem
                        _id={todo._id}
                        key={todo._id}
                        text={todo.text}
                        isCompleted={todo.isCompleted}
                        setTodos={setTodos}
                    />
                ))
            )}
        </Fragment>
    );
}

export default Dashboard;