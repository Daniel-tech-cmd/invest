"use client";
import React from "react";
import styles from "../styles/signup.module.css";
import styles2 from "../styles/jointrade.module.css";
import Link from "next/link";
export default function Success({ message }) {
  //   const { togglesucces } = useContext(openseccon);

  return (
    <>
      <div className={`${styles2.model} `}>
        <div
          className={`${styles2.innermodel} ${styles.cont}`}
          style={{ background: "#fff", color: "gray" }}
        >
          <h5>{message}</h5>
          <div
            style={{
              marginTop: "25px",
              fontFamily: "sans-serif",
              textAlign: "center",
              width: "100%",
              height: "100px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: "0.625rem",
              padding: "1rem 1.5rem",
              marginBottom: "1rem",
              border: " 1px solid transparent",
              color: "green",
            }}
            className={styles.good}
          ></div>
          <Link
            href={`/login/`}
            className={styles.link}
            // onClick={togglesucces}
          >
            Login
          </Link>
        </div>
      </div>
    </>
  );
}
