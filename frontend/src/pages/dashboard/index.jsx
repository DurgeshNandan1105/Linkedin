
import { getAboutUser, getAllUsers } from "@/config/redux/action/authAction";
import { getAllPosts } from "@/config/redux/action/postAction";

import DashboardLayout from "@/layout/DashboardLayout";
import UserLayout from "@/layout/UserLayout";

import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";

import { useDispatch, useSelector } from "react-redux";
import styles from "./index.module.css";
import { BASE_URL } from "@/config";

export default function Dashboard() {
    const router = useRouter();
    const dispatch = useDispatch();

    const authState = useSelector((state) => state.auth);

    useEffect(() => {
        if (authState.isTokenThere) {
            dispatch(getAllPosts());
            if (!authState.profileFetched) {
                const token = localStorage.getItem('token');
                if (token) {
                    dispatch(getAboutUser({ token }));
                }
            }
        }
        if (!authState.all_profiles_fetched) {
            dispatch(getAllUsers());
        }
    }, [dispatch, authState.isTokenThere, authState.profileFetched, authState.all_profiles_fetched]);

   
if (authState.user){
    return (
        <UserLayout>
            <DashboardLayout>
               <div className="scrollComponent">
                <div className={styles.createPostContainer}>
                   <img width={200}src={`${BASE_URL}/${authState.user?.userId?.profilePicture}`} alt=""/>
                   <textarea name="" id=""></textarea>
                   <label htmlFor="fileUpload">
                   <div className={styles.Fab}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
</svg>

                   </div>
                   </label>
                   <input type="file" hidden id="fileUpload"/>
                </div>

               </div>
                
            </DashboardLayout>
        </UserLayout>
    )
}else {
    return (
        <UserLayout>
            <DashboardLayout>
                <h2>Loading...</h2>
            </DashboardLayout>
        </UserLayout>
    )
}

}