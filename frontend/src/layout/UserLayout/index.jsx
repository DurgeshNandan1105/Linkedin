import NavBarComponent from '@/Components/Navbar';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAboutUser } from '@/config/redux/action/authAction';

function UserLayout ({ children }) {
    const dispatch = useDispatch();
    const authState = useSelector((state) => state.auth);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token && !authState.profileFetched) {
            dispatch(getAboutUser({ token }));
        }
    }, [dispatch, authState.profileFetched]);

    return (
        <div>
            <NavBarComponent />
            {children}
        </div>
    )
}

export default UserLayout;