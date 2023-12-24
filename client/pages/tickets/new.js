import { useState } from "react";
import useRequest from '../../hooks/user-request';

const NewTicket = () => {
    const [ title, setTitle] = useState(''); 
    const [ price, setPrice] = useState(''); 

    const { doRequest, errors } = useRequest({
        url: '/api/tickets',
        method: 'post',
        body: {
            title, price
        },
        onSuccess: (data) => console.log(data)
    });

    const onSubmit = (event) => {
        event.preventDefault();

        doRequest();
    }

    const onBlur = () => {
        const value = parseFloat(price);

        if(isNaN(value)){
            return;
        }else{
            setPrice(value.toFixed(2));
        }
    };

    return (
        <div>
            <h1>Create a Ticket</h1>
            <form onSubmit={ onSubmit }>
                <div className="form-group">
                    <lable>Title</lable>
                    <input value={ title } onChange={(e) => setTitle(e.target.value)} className="form-control"/>
                </div>
                <div className="form-group">
                    <lable>Price</lable>
                    <input 
                        value={ price } 
                        onBlur={ onBlur }
                        onChange={(e) => setPrice(e.target.value)} 
                        className="form-control"
                    />
                </div>
                { errors }
                <button className="btn btn-primary">Submit</button>
            </form>
        </div>
    );
}

export default NewTicket;