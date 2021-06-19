import { useEffect, useState } from "react";
import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";

import html2canvas from "html2canvas";
import birthdayList from "../birthday.json";

export default function Home() {
  const [imageUrl, setImageUrl] = useState("");
  const [date, setDate] = useState();
  const [birthday, setBirthday] = useState([]);
  useEffect(async () => {
    html2canvas(document.getElementById("input"), {
      allowTaint: true,
      useCORS: true,
      logging: true,
      taintTest: false,
    }).then(function (canvas) {
      canvas.toBlob(function (blob) {
        let link = URL.createObjectURL(blob);
        setImageUrl(link);
      }, "image/png");
    });
    const todayDate = new Date()
      .toLocaleDateString("en-GB")
      .split("/")
      .splice(0, 2)
      .join("-");
    setDate(todayDate);
  }, []);
  useEffect(() => {
    if (date) {
      const todayBirthday = birthdayList.filter((s) => s.date == date);
      setBirthday(todayBirthday);
    }
  }, [date]);
  return (
    <>
      <div className={styles.container}>
        <div className={styles.mainDiv} id="input">
          <Head>
            <title>Create Next App</title>
            <meta name="description" content="Birthday Wishes" />
            <link rel="icon" href="/favicon.ico" />
            <link rel="preconnect" href="https://fonts.gstatic.com" />
            <link
              href="https://fonts.googleapis.com/css2?family=Lobster&display=swap"
              rel="stylesheet"
            />
            <link
              href="https://fonts.googleapis.com/css2?family=Monoton&display=swap"
              rel="stylesheet"
            ></link>
            <link rel="stylesheet" href="/images/icofont.min.css"></link>
            <link
              href="https://fonts.googleapis.com/css2?family=Righteous&display=swap"
              rel="stylesheet"
            ></link>
          </Head>
          <div className={styles.content}>
            <h1 className={styles.title}>Happy &nbsp; Birthday</h1>
            {birthday.length > 0 ? (
              <div className={styles.imageDiv}>
                {birthday.map((s) => {
                  return (
                    <img
                      key={s.id}
                      className={styles.image}
                      src="/images/sample.png"
                      width="120"
                      height="auto"
                    />
                  );
                })}
              </div>
            ) : (
              <h1 className={styles.name} style={{fontSize:'7rem',paddingTop:'8rem',paddingBottom:'8rem'}}>
                No Birthday Today
              </h1>
            )}
            {birthday.length > 0
              ? birthday.map((s) => {
                  return (
                    <h1 key={s.id} className={styles.name}>
                      {s.name}
                    </h1>
                  );
                })
              : null}
            <h1 className={styles.school}>BEM HSS Vadakara</h1>
            <h1 className={styles.class}>X - D</h1>
          </div>
        </div>
      </div>
      <a
        className={styles.download}
        href={imageUrl}
        target="_blank"
        rel="noopener noreferrer"
        download={`birthday_${date}`}
      >
        <i
          className="icofont-download"
          style={{ fontSize: "5rem", color: "crimson" }}
        ></i>
      </a>
    </>
  );
}
