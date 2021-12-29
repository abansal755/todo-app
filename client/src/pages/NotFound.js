import { useEffect } from "react";
import { useHistory } from "react-router-dom";
import ErrorItem from "../components/ui/ErrorItem";

const NotFound = () => {
    const history = useHistory();
    
    useEffect(() => {
        setTimeout(() => {
            history.push('/');
        }, 3000);
    }, []);
    
    return <ErrorItem text='Not Found' />;
}

export default NotFound;