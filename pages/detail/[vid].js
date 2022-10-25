import Head from "next/head";
import styles from "../../styles/detail.module.scss";
import { detail } from "../../utils/data";
import { useEffect, useRef } from "react";
import Link from "next/link";

export default function Detail({ detail }) {
  const videoRef = useRef(null);

  useEffect(() => {
    const Hls = require("cdnbye");
    const video = videoRef.current;
    if (!video) return;
    video.autoplay = false;
    video.controls = true;
    const hls = new Hls();
    hls.loadSource(detail.PlayURL);
    hls.attachMedia(video);
  }, [detail, videoRef]);
  return (
    <>
      <Head>
        <title>{detail.Title}</title>
      </Head>
      <div className={styles.detail}>
        <Link href="/">
          <a className={styles.back}>返回</a>
        </Link>
        <video ref={videoRef} poster={detail.CoverURL} />
      </div>
    </>
  );
}
export const getServerSideProps = async (ctx) => {
  return {
    props: {
      detail: await detail(ctx.params.vid),
    },
  };
};
