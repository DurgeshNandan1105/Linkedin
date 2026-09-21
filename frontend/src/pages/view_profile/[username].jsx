import { BASE_URL, clientServer } from "@/config";
import {
  getConnectionsRequest,
  getMyConnectionRequests,
  sendConnectionRequest,
} from "@/config/redux/action/authAction";
import { getAllPosts } from "@/config/redux/action/postAction";
import DashboardLayout from "@/layout/DashboardLayout";
import UserLayout from "@/layout/UserLayout";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import styles from "./index.module.css";

export default function viewProfilePage({ userProfile }) {
  const router = useRouter();
  const postReducer = useSelector((state) => state.postReducer);
  const dispatch = useDispatch();
  const authState = useSelector((state) => state.auth);
  const [userPosts, setUserPosts] = useState([]);
  const [isCurrentUserInConnection, setIsCurrentUserInConnection] =
    useState(false);
  const [isConnectionNull, setIsConnectionNull] = useState(true);

  const getUsersPost = async () => {
    await dispatch(getAllPosts());
    await dispatch(
      getConnectionsRequest({ token: localStorage.getItem("token") })
    );
     await dispatch(getMyConnectionRequests({token: localStorage.getItem("token")}));
  };
 

  useEffect(() => {
    if (postReducer.posts && router.query.username) {
      const posts = postReducer.posts.filter((post) => {
        return post.userId?.username === router.query.username;
      });
      setUserPosts(posts);
    }
  }, [postReducer.posts, router.query.username]);

  useEffect(() => {
    if (
      authState.connections?.some(
        (user) => user.connectionId?._id === userProfile?.userId?._id,
      )
    ) {
      setIsCurrentUserInConnection(true);
      if (
        authState.connections.find(
          (user) => user.connectionId?._id === userProfile?.userId?._id,
        )?.status_accepted
      ) {
        setIsConnectionNull(false);
      }
    }
    if (authState.connectionRequest.some(user => user.userId._id === userProfile.userId._id)){
      setIsCurrentUserInConnection(true)
      if(authState.connectionRequest.find(user => user.userId._id === userProfile.userId._id).status_accepted === true){
        setIsConnectionNull(false)
      }
    }
  }, [authState.connections, authState.connectionRequest]);

  useEffect(() => {
    getUsersPost();
  }, []);

  return (
    <UserLayout>
      <DashboardLayout>
        <div className={styles.container}>
          <div 
            className={styles.backDropContainer}
            style={{
              backgroundImage: userProfile?.coverPicture 
                ? `url(${BASE_URL}/${userProfile.coverPicture})` 
                : undefined
            }}
          >
            <img
              className={styles.backDrop}
              src={`${BASE_URL}/${userProfile?.userId?.profilePicture}`}
              alt="avatar"
            />
          </div>

          <div className={styles.profileContainer_details}>
            <div className={styles.profileFlexContainer}>
              <div className={styles.profileDetailsLeft}>
                <div className={styles.nameUsernameContainer}>
                  <h2>{userProfile?.userId?.name}</h2>
                  <p className={styles.usernameText}>
                    @{userProfile?.userId?.username}
                  </p>
                </div>

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "1.2rem",
                  }}
                >
                  {isCurrentUserInConnection ? (
                    <button className={styles.connectedButton}>
                      {isConnectionNull ? "Pending" : "Connected"}
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        if (userProfile?.userId?._id) {
                          dispatch(
                            sendConnectionRequest({
                              token: localStorage.getItem("token"),
                              connectionId: userProfile.userId._id,
                              user_id: userProfile.userId._id,
                            }),
                          );
                        }
                      }}
                      className={styles.connectBtn}
                    >
                      Connect
                    </button>
                  )}
                  <div
                    onClick={async () => {
                      try {
                        const response = await clientServer.get(
                          `/user/download_resume?id=${userProfile?.userId?._id}`,
                        );
                        if (response?.data?.message) {
                          window.open(
                            `${BASE_URL}/${response.data.message}`,
                            "_blank",
                          );
                        }
                      } catch (err) {
                        console.error("Error downloading resume:", err);
                      }
                    }}
                    style={{ cursor: "pointer" }}
                  >
                    <svg
                      style={{ width: "1.2em" }}
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="size-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3"
                      />
                    </svg>
                  </div>
                </div>
                <div>
                  <p>{userProfile.bio}</p>
                </div>
              </div>

              <div className={styles.recentActivityRight}>
                <h3>Recent Activity</h3>
                {userPosts.map((post) => {
                  return (
                    <div key={post._id} className={styles.postCard}>
                      <div className={styles.card}>
                        <div className={styles.card_profileContainer}>
                          {post.media !== "" ? (
                            <img src={`${BASE_URL}/${post.media}`} alt="" />
                          ) : (
                            <div
                              style={{ width: "3.4rem", height: "3.4rem" }}
                            ></div>
                          )}
                        </div>
                        <p>{post.body}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
          <div className="workHistory">
            <h4>Work History</h4>
            <div className={styles.workHistoryContainer}>
              {userProfile.pastWork.map((work, index) => {
                return (
                  <div key={index} className={styles.workHistoryCard}>
                    <p
                      style={{
                        fontWeight: "bold",
                        display: "flex",
                        alignItems: "center",
                        gap: "0.8rem",
                      }}
                    >
                      {work.company} - {work.position}
                    </p>
                    <p>{work.years}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </DashboardLayout>
    </UserLayout>
  );
}

export async function getServerSideProps(context) {
  try {
    const request = await clientServer.get(
      "/user/get_profile_based_on_username",
      {
        params: {
          username: context.query.username,
        },
      },
    );
    return { props: { userProfile: request.data.profile } };
  } catch (error) {
    console.error("Error fetching user profile:", error.message);
    return { notFound: true };
  }
}
