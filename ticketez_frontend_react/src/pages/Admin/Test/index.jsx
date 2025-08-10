import { useEffect, useState } from 'react';

function Test() {
    const [obj, setObj] = useState({
        seatType: { seat: [] },
    });
    const test = () => {
        const newObj = { ...obj };
        for (let index = 0; index < 3; index++) {
            newObj.seatType['normal' + (index + 1)] = ['A1', 'A2'];
        }
        setObj(newObj);
    };
    useEffect(() => {
        test();
        console.log(obj);
    }, []);
    return <>s</>;
}

export default Test;
