import { createContext, useState } from "react";
import {v4 as uuidv4} from 'uuid';
import {cloneDeep} from 'lodash';

const ErrorContext = createContext({
    errors: [],
    addError: text => {},
    removeError: _id => {}
});

export const ErrorContextProvider = props => {
    const [errors,setErrors] = useState([]);

    const addError = text => {
        const _id = uuidv4();
        setErrors(prev => {
            return [
                {
                    _id,
                    text
                },
                ...prev
            ]
        });
        setTimeout(() => {
            removeError(_id);
        }, 3000);
    }

    const removeError = _id => {
        setErrors(prev => {
            const newErrors = cloneDeep(prev);
            let idx = -1;
            for(let i = 0; i < newErrors.length; i++){
                if(newErrors[i]._id === _id){
                    idx = i;
                    break;
                }
            }
            newErrors.splice(idx,1);
            return newErrors;
        })
    }
    
    return (
        <ErrorContext.Provider value={{
            errors,
            addError,
            removeError
        }}>
            {props.children}
        </ErrorContext.Provider>
    );
}

export default ErrorContext;