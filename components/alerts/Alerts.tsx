import React, { useState, useEffect } from 'react';

export type AlertType = 'error' | 'success';

interface AlertProps {
    type: AlertType;
    message: string;
    autoClose?: boolean;
    duration?: number;
}

const Alert: React.FC<AlertProps> = ({ type, message, autoClose = false, duration = 5000 }) => {
    const [show, setShow] = useState(true);

    useEffect(() => {
        if (autoClose) {
            const timer = setTimeout(() => {
                setShow(false);
            }, duration);

            return () => {
                clearTimeout(timer);
            };
        }
    }, [autoClose, duration]);

    const handleClose = () => {
        setShow(false);
    };

    return (
        <>
            {show && (
                <div
                    className={`${
                        type === 'error' ? 'bg-red-500' : 'bg-green-500'
                    } text-white px-4 py-2 rounded-md flex justify-between items-center`}
                >
                    <span>{message}</span>
                    <button className="text-white" onClick={handleClose}>
                        X
                    </button>
                </div>
            )}
        </>
    );
};

export default Alert;
