
import { useEffect, useState } from "react";
import Head from "next/head";
import styles from "../styles/Home.module.css";

import html2canvas from "html2canvas";

export default function Home() {
  const capitalize = words => {
    return words
      .split(' ')
      .map((word) => {
        return word[0].toUpperCase() + word.substring(1);
      })
      .join(" ");
  }

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
  }, [birthday]);
  useEffect(async () => {
    const todayDate = new Date()
      .toLocaleDateString("en-GB")
      .split("/")
      .splice(0, 2)
      .join("-");
    setDate(todayDate);
    const birthdayListJson = await fetch("/api/birthday");
    const birthdayListAll = await birthdayListJson.json();
    if (birthdayListAll) {
      const todayBirthday = birthdayListAll.data.filter(
        (s) => s.date == todayDate
      );
      setBirthday(todayBirthday);
    }
  }, [date]);
  return (
    <>
      <div className={styles.container}>
        <div className={styles.mainDiv} id="input">
          <Head>
            <title>BEM Vadakara - Birthday Wishes</title>
            <meta name="description" content="BEM Vadakara - Birthday Wishes" />
            {/* <meta
              property="og:title"
              content={`Happy Birthday ${birthday[0] ? birthday[0].name : 'Student'}`}
            />
            <meta
              property="og:description"
              content="BEM Vadakara Wishes you a Happy Birthday"
            />
            <meta property="og:url" content="/" />
            <meta
              property="og:image"
              content={`/images/students/${
                birthday[0] ? birthday[0].id : null
              }.jpg`}
            /> */}
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
                      src={`/images/students/${s.id}.jpg`}
                      width="120"
                      height="auto"
                    />
                  );
                })}
              </div>
            ) : (
              <h1
                className={styles.name}
                style={{
                  fontSize: "7rem",
                  paddingTop: "8rem",
                  paddingBottom: "8rem",
                }}
              >
                No Birthday Today
              </h1>
            )}
            {birthday.length > 0
              ? birthday.map((s) => {
                  return (
                    <h1 key={s.id} className={styles.name}>
                      {capitalize(s.name.toLowerCase())}
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
        <img src="/images/download.svg" style={{ fontSize: "1rem" }}></img>
      </a>
    </>
  );
}
