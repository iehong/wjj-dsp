import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import styles from "../styles/list.module.scss";
import { list } from "../utils/data";

export default function Home({ list }) {
  return (
    <>
      <Head>
        <title>建德市卫健系统健康科普知识短视频</title>
      </Head>
      <div className={styles.grid}>
        {list.map((i) => (
          <Link
            href="/detail/[vid]"
            as={`/detail/${i.VideoId}`}
            key={i.VideoId}
          >
            <a className={styles.item}>
              <div className={styles.img}>
                <Image src={i.CoverURL} alt={i.Title} layout="fill" priority />
              </div>
              <span>{i.Title}</span>
            </a>
          </Link>
        ))}
      </div>
    </>
  );
}
export const getServerSideProps = async (ctx) => {
  let temp = await list();
  temp.sort((a, b) => (Math.random() > 0.5 ? -1 : 1));
  return {
    props: {
      list: temp,
    },
  };
};
