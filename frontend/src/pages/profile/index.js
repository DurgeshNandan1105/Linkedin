import { getAboutUser } from '@/config/redux/action/authAction'
import DashboardLayout from '@/layout/DashboardLayout'
import UserLayout from '@/layout/UserLayout'
import React, { useEffect, useState } from 'react'
import styles from "./index.module.css"
import { BASE_URL, clientServer } from '@/config'
import { useDispatch, useSelector } from 'react-redux'
import { getAllPosts } from '@/config/redux/action/postAction'



export default function ProfilePage() {
    const authState = useSelector((state) => state.auth)
    const postReducer = useSelector((state) => state.postReducer);
    const [userProfile, setUserProfile] = useState({})
    const [userPosts, setUserPosts] = useState([])
    
   
  const dispatch = useDispatch();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [inputData, setInputData] = useState({ company: '', position: '', years: ''});
  const handleWorkInputChange = (e) => {
    const {name, value} = e.target;
    setInputData({ ...inputData, [name]: value });

  }
  

    useEffect(() => {
        dispatch(getAboutUser({ token: localStorage.getItem("token")}))
        dispatch(getAllPosts())
    }, [])

    useEffect(() => {
    
     if (authState.user != undefined) {
         setUserProfile(authState.user)
          const posts = (postReducer.posts || []).filter((post) => {
            return post.userId?.username === authState.user?.userId?.username;
          });
          setUserPosts(posts);
        }
          
        
    }, [authState.user, postReducer.posts])

    
const updateProfilePicture = async (file) => {
    if (!file) return;
    const formData = new FormData();
    formData.append("profile_picture", file);
    formData.append("token", localStorage.getItem("token"));

    await clientServer.post("/update_profile_picture", formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });

    dispatch(getAboutUser({token: localStorage.getItem("token")}));
}

const updateCoverPicture = async (file) => {
    if (!file) return;
    const formData = new FormData();
    formData.append("cover_picture", file);
    formData.append("token", localStorage.getItem("token"));

    await clientServer.post("/update_cover_picture", formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });

    dispatch(getAboutUser({token: localStorage.getItem("token")}));
}

const updateProfileData = async () => {
    try {
        await clientServer.post("/user_update", {
            token: localStorage.getItem("token"),
            name: userProfile?.userId?.name || "",
        });

        await clientServer.post("/update_profile_data", {
            token: localStorage.getItem("token"),
            bio: userProfile.bio || "",
            currentPost: userProfile.currentPost || "",
            pastWork: Array.isArray(userProfile.pastWork) ? userProfile.pastWork : [],
            education: Array.isArray(userProfile.education) ? userProfile.education : []
        });
        dispatch(getAboutUser({ token: localStorage.getItem("token")}));
    } catch (error) {
        console.error("Error updating profile:", error);
    }
}

  return (
    <UserLayout>
      <DashboardLayout>
        {authState.user && userProfile?.userId &&
        <div className={styles.container}>
          <div 
            className={styles.backDropContainer}
            style={{
              backgroundImage: userProfile?.coverPicture 
                ? `url(${BASE_URL}/${userProfile.coverPicture})` 
                : undefined
            }}
          >
            <label htmlFor="coverPictureUpload" className={styles.coverEditBtn}>
              <p>Edit Cover</p>
            </label>
            <input onChange={(e) => {
                updateCoverPicture(e.target.files[0])
            }} hidden type="file" id="coverPictureUpload"></input>

            <label htmlFor="profilePictureUpload" className={styles.backDrop_overlay}>
                <p>Edit</p>
            </label>
            <input onChange={(e) => {
                updateProfilePicture(e.target.files[0])
            }} hidden type="file" id="profilePictureUpload"></input>

            <img
              src={`${BASE_URL}/${userProfile?.userId?.profilePicture}`}
              alt="avatar"
            />
          </div>

          <div className={styles.profileContainer_details}>
            <div className={styles.profileFlexContainer}>
              <div className={styles.profileDetailsLeft}>
                <div className={styles.nameUsernameContainer}>
                  <input className={styles.nameEdit} type="text" value={userProfile?.userId?.name || ''} onChange={(e) => {
                    setUserProfile({...userProfile, userId: {...(userProfile?.userId || {}), name: e.target.value} })
                  }} />
                  <p className={styles.usernameText}>
                    @{userProfile?.userId?.username}
                  </p>
                </div>

                
                
                <div>
                  <textarea value={userProfile.bio || ''}
                  onChange={(e) => {
                    setUserProfile({...userProfile, bio: e.target.value});
                  }}
                  rows={Math.max(3, Math.ceil((userProfile.bio || '').length / 80))}
                  />
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
              {userProfile.pastWork && userProfile.pastWork.map((work, index) => {
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

              <button className={styles.addWorkButton} onClick={() => {
                 setIsModalOpen(true)
              }}>Add Work</button>
            </div>
          </div>
          <div onClick={updateProfileData} className={styles.updateProfileBtn}>
            Update Profile
          </div>
        </div>
}
  {
           isModalOpen &&
            <div 
            onClick={() => {
              setIsModalOpen(false)}}
              className={styles.commentsContainer}>
              <div 
              onClick={(e) => {
                e.stopPropagation()
              }}
              className={styles.allCommentsContainer}>
               <input onChange={handleWorkInputChange} name='company' className={styles.inputField} type="text" placeholder="Enter Company"/>
               <input onChange={handleWorkInputChange} name='position' className={styles.inputField} type="text" placeholder="Enter Position"/>
               <input onChange={handleWorkInputChange} name='years' className={styles.inputField} type="number" placeholder="years"/>
               <div  onClick={() => {
                setUserProfile({...userProfile, pastWork: [...(userProfile.pastWork || []), inputData]})
                setIsModalOpen(false)
               }}className={styles.updateProfileBtn}>Add Work</div>
                
              </div>
            </div>
          }
        </DashboardLayout>  
    </UserLayout>
  )
}
