import { StreamVideoClient } from "@stream-io/video-react-sdk"

export const videoClient = new StreamVideoClient({
  apiKey: process.env.NEXT_PUBLIC_STREAM_API_KEY!,
  user: {
    id: "USER_ID", // same as Stream Chat user id
  },
  token: "VIDEO_TOKEN", // from backend
})
