const Core = require("@alicloud/pop-core");
const Redis = require("ioredis");

const client = new Core({
  accessKeyId: "LTAIUc****Xstk2",
  accessKeySecret: "5bO6hQvz*******g6xneMBgSl2B",
  endpoint: "https://vod.cn-shenzhen.aliyuncs.com",
  apiVersion: "2017-03-21",
});
const redis = new Redis({
  port: 6379, // Redis port
  host: "101.*****.81", // Redis host
  family: 4, // 4 (IPv4) or 6 (IPv6)
  password: "HF****lyc",
  db: 15,
});

export const list = async () => {
  if (!(await redis.get("wjj:list"))) {
    let {
      VideoList: { Video: videos },
    } = await client.request("GetVideoList", {
      PageSize: 50,
      CateId: 4356,
      Status: "Normal",
    });
    await redis.set(
      "wjj:list",
      JSON.stringify(
        videos.map((i) => {
          return {
            VideoId: i.VideoId,
            Title: /《.+》/.exec(i.Title)[0].slice(1, -1),
            CoverURL: i.CoverURL,
          };
        })
      ),
      "ex",
      60 * 10
    );
  }
  return JSON.parse(await redis.get("wjj:list"));
};

export const detail = async (vid) => {
  if (!(await redis.get("wjj:detail:" + vid))) {
    let {
      VideoBase: video,
      PlayInfoList: { PlayInfo: play },
    } = await client.request("GetPlayInfo", {
      VideoId: vid,
    });
    await redis.set(
      "wjj:detail:" + vid,
      JSON.stringify({
        VideoId: video.VideoId,
        Title: /《.+》/.exec(video.Title)[0].slice(1, -1),
        Company: /市.+（/.exec(video.Title)[0].slice(1, -1),
        Auther: /（.+）/.exec(video.Title)[0].slice(1, -1),
        CoverURL: video.CoverURL,
        PlayURL: play[0].PlayURL,
      }),
      "ex",
      60 * 60 * 24 * 90
    );
  }
  return JSON.parse(await redis.get("wjj:detail:" + vid));
};
