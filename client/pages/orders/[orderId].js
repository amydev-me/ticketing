import { useEffect, useState } from 'react';
import StripeCheckout from 'react-stripe-checkout';
import userRequest from '../../hooks/user-request';

const OrderShow = ({ order, currentUser }) => {
    const [timeLeft, setTimeLeft] = useState('');
    const { doRequest, errors } = userRequest({
        url: '/api/payments',
        method: 'post',
        body: {
            orderId: order.id
        },
        onSuccess: (payment) = console.log(payment)
    })
    useEffect(() => {
        const findTimeLeft = () => {
            const msLeft = new Date(order.expiresAt) - new Date();
            setTimeLeft(Math.round(msLeft / 1000));
        }

        findTimeLeft();
        const timerId = setInterval(findTimeLeft, 1000);

        return () => {
            clearInterval(timerId);
        }
    }, [order])

    if(timeLeft < 0){
        return <div>Order Expired</div>
    }


    return (
        <div>
            Time left to pay: {timeLeft} seconds
            <StripeCheckout 
                token={({ id }) => doRequest({token: id})}
                stripeKey='pk_test_51OQW86G7z7yHZmvo7dXIilcsqzIUZcOu9o2uUmg9ciUFuqRH5aDTwUfCzo6e9aOQhP0Cp91YcpGrYUPHTXrxHaN500Cl8eGXwD'
                amount={order.ticket.price * 100}
                email={currentUser.email}
            />
            {errors}
        </div>
    );
}

OrderShow.getInitialProps = async (context, client) => {
    const { orderId } = context.query;
    const { data } = await client.get(`/api/orders/${orderId}`);

    return { order: data };
}

export default OrderShow;