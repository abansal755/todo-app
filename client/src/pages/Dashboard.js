import { Fragment, useEffect, useState } from "react";
import TodoItem from "../components/TodoItem";
import useHttp from '../hooks/useHttp';
import TodoForm from "../components/TodoForm";

const Dashboard = () => {
    const [todos,setTodos] = useState([]);
    const http = useHttp();

    useEffect(() => {
        http.sendRequest({
            url: '/api/todos'
        },
        data => {
            data.reverse();
            setTodos(data);
        })
    }, []);
    
    return (
        <Fragment>
            <TodoForm setTodos={setTodos}/>
            {
                todos.map(todo => (
                    <TodoItem
                        _id={todo._id}
                        key={todo._id}
                        text={todo.text}
                        isCompleted={todo.isCompleted}
                        setTodos={setTodos}
                    />
                ))
            }
        </Fragment>
    );
}

export default Dashboard;