import { Alert, Button, Container } from "react-bootstrap";
import styles from "../assets/login.module.css";
import { BsMusicNoteList } from "react-icons/bs";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useRef } from "react";
import axios from "axios";
import { useState } from "react";
import {
  createUserWithEmailAndPassword,
  getAuth,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { auth } from "../../config/firebase";
import { useAuth } from "../contexts/AuthContext";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { RecaptchaVerifier } from "firebase/auth";
import { useContext } from "react";
import { MainContext } from "../contexts/MainProvider";

export const LogIn = () => {
  const [emailI, setEmailI] = useState("");
  const [passwordI, setPasswordI] = useState("");
  const navigate = useNavigate();
  const { currentUser, setIsLogIn, userId, setUserId } = useAuth();
  const { u, setU } = useContext(MainContext);
  const [error, setError] = useState("");

  const onSubmit = (e) => {
    e.preventDefault();
    const auth = getAuth();

    axios
      .post(`https://music-backend-zz59.onrender.com/login`, {
        email: emailI,
        password: passwordI,
      })
      .then((res) => {

        signInWithEmailAndPassword(auth, emailI, passwordI)
          .then((userCredential) => {
            const user = userCredential.user;
            navigate("/");
            axios
              .get(
                `https://music-backend-zz59.onrender.com/user/` + res.data._id
              )
              .then((res) => {
                setU(res.data);
                window.localStorage.setItem(
                  "APP_USER",
                  JSON.stringify(res.data._id)
                );
              })
              .catch((error) => {
                console.log(error);
              });
          })
          .catch((error) => {
            const errorCode = error.code;
            setError(error.message);
          });
      })
      .catch((error) => {
        toast.error("Invalid username or password");
      });
  };

  return (
    <div className={styles.Container}>
      <ToastContainer /> {/* <Container> */}{" "}
      <Link to="/">
        <div className={styles.logoCont}>
          <BsMusicNoteList className={styles.logo} />
          <span className={styles.logoText}>Invader</span>
        </div>
      </Link>
      <div className={styles.borderContainer}>
        <div className={styles.section1}>
          <span className={styles.section1Texts}>
            Email address or username
          </span>
          <input
            onChange={(e) => setEmailI(e.target.value)}
            value={emailI}
            className={styles.inp}></input>
        </div>
        <div className={styles.section1}>
          <span className={styles.section1Texts}>Password</span>
          <input
            onChange={(e) => setPasswordI(e.target.value)}
            value={passwordI}
            className={styles.inp}
            type="password"></input>
        </div>
        <span className={styles.section2Texts}>Forget your password? </span>
        <div className={styles.section2}>
          <div className={styles.checkCont}>
            <input className={styles.check} type="checkbox" />
            <span className={styles.botText}>Remember me</span>
          </div>

          <Button onClick={onSubmit} className={styles.but} variant="warning">
            LOG IN
          </Button>
        </div>
        <hr></hr>
        <div className={styles.section3}>
          <span className={styles.section3Text}>Don't have an account? </span>
          <Link style={{ width: "100%" }} to="/signup">
            <Button className={styles.but2} variant="light">
              SIGN UP FOR INVADER
            </Button>
          </Link>
        </div>
      </div>
      {/* </Container> */}
    </div>
  );
};
