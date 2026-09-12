import React from 'react';
import styles from "./index.module.css";

export default function DashboardLayout({children}) {
  return (
    <div><div className="container">
        <div className={styles.homeContainer}>
          <div className="homeContainer_leftBar">
           

          </div>
         
          
          <div className="homeContainer_feedContainer">
             {children}
          </div>
          <div className="homeContainer_extraContainer">

          </div>

         </div>
        </div>
        </div>
  )
}
