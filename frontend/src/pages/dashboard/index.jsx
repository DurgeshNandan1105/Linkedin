import { getAboutUser } from '@/config/redux/action/authAction';
import { getAllPosts } from '@/config/redux/action/postAction';
import DashboardLayout from '@/layout/DashboardLayout';
import UserLayout from '@/layout/UserLayout';
import { useRouter } from 'next/router'
import React, { useEffect } from "react";
import { useDispatch, useSelector } from 'react-redux';

export default function Dashboard() {

    const router = useRouter();
    const dispatch = useDispatch();
    const authState = useSelector((state) => state.auth);

    useEffect(() => {
       const token = localStorage.getItem('token');
       if (token === null) {
         router.push("/login");
       } else {
         dispatch(getAllPosts());
         dispatch(getAboutUser({ token }));
       }
    }, [router, dispatch]);
    
  return (
    <UserLayout>
        {/* Hey {authState.profileFetched && <div>Hey {authState.user.userId.name}</div> } */}

        <DashboardLayout>
          <div>
            <h1>Dashboard</h1>
          </div>
        </DashboardLayout>
    </UserLayout>
  )
}
