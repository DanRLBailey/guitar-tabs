import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";
import TabPage from "./tabPage";

export default function Home() {
  return (
    <div className={styles.container}>
      <TabPage SongName="Have You Ever Seen The Rain - Creedence Clearwater Revival" />
    </div>
  );
}
