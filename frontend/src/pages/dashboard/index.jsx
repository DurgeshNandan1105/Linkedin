
import { getAboutUser } from "@/config/redux/action/authAction";
import { getAllPosts } from "@/config/redux/action/postAction";

import DashboardLayout from "@/layout/DashboardLayout";
import UserLayout from "@/layout/UserLayout";

import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";

import { useDispatch, useSelector } from "react-redux";

export default function Dashboard() {
    const router = useRouter();
    const dispatch = useDispatch();

    const authState = useSelector((state) => state.auth);

   

  
    

    // Fetch posts and user data
    useEffect(() => {
        if (isTokenThere) {

            dispatch(getAllPosts());

            dispatch(
                getAboutUser({
                    token: localStorage.getItem('token')}
                )
              }
        
    }, [authState.isTokenThere]);

   

    return (
        <UserLayout>
            <DashboardLayout>
                <div>
                    <h1>Dashboard</h1>
                        </div>
                
            </DashboardLayout>
        </UserLayout>
    );
}