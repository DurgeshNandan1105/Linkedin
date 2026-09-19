import { BASE_URL, clientServer } from '@/config';
import { getConnectionsRequest, sendConnectionRequest } from '@/config/redux/action/authAction';
import { getAllPosts } from '@/config/redux/action/postAction';
import DashboardLayout from '@/layout/DashboardLayout';
import UserLayout from '@/layout/UserLayout';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styles from "./index.module.css";

export default function viewProfilePage({ userProfile }) {
  const router = useRouter();
  const postReducer = useSelector((state) => state.postReducer);
  const dispatch = useDispatch();
  const authState = useSelector((state) => state.auth);
  const [userPosts, setUserPosts] = useState([]);
  const [isCurrentUserInConnection, setIsCurrentUserInConnection] = useState(false);

  const getUsersPost = async () => {
    await dispatch(getAllPosts());
    await dispatch(getConnectionsRequest({ token: localStorage.getItem("token") }));
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
    if (authState.connection && userProfile?.userId?._id) {
      const isConnected = authState.connection.some(
        (user) => user?.connectionId?._id === userProfile.userId._id
      );
      setIsCurrentUserInConnection(isConnected);
    }
  }, [authState.connection, userProfile]);

  useEffect(() => {
    getUsersPost();
  }, []);

  return (
    <UserLayout>
      <DashboardLayout>
        <div className={styles.container}>
          <div className={styles.backDropContainer}>
            <img
              className={styles.backDrop}
              src={`${BASE_URL}/${userProfile?.userId?.profilePicture}`}
              alt="backdrop"
            />
          </div>

          <div className={styles.profileContainer_details}>
            <div style={{ display: "flex", gap: "0.7rem", justifyContent: "space-between" }}>
              <div style={{ flex: "0.8" }}>
                <div style={{ display: "flex", width: "fit-content", alignItems: "center", gap: "1.3rem" }}>
                  <h2>{userProfile?.userId?.name}</h2>
                  <p style={{ color: "grey" }}>@{userProfile?.userId?.username}</p>
                </div>

                {isCurrentUserInConnection ? (
                  <button className={styles.connectedButton}>
                    Connect
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
                          })
                        );
                      }
                    }}
                    className={styles.connectBtn}
                  >
                    Connect
                  </button>
                )}

                <p style={{ marginTop: "0.8rem" }}>{userProfile?.bio}</p>
              </div>

              <div style={{ flex: "0.2" }}>
                <h3>Recent Activity</h3>
                {userPosts.map((post) => {
                  return (
                    <div key={post._id} className={styles.postCard}>
                      <div className={styles.card}>
                        <div className={styles.card_profileContainer}>
                          {post.media !== "" ? (
                            <img src={`${BASE_URL}/${post.media}`} alt="" />
                          ) : (
                            <div style={{ width: "3.4rem", height: "3.4rem" }}></div>
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
        </div>
      </DashboardLayout>
    </UserLayout>
  );
}

export async function getServerSideProps(context) {
  try {
    const request = await clientServer.get("/user/get_profile_based_on_username", {
      params: {
        username: context.query.username,
      },
    });
    return { props: { userProfile: request.data.profile } };
  } catch (error) {
    console.error("Error fetching user profile:", error.message);
    return { notFound: true };
  }
}