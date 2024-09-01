// "use client";
// import useSWR from 'swr';

import { getServerSession } from 'next-auth'
import { authOptions } from './lib/auth';

import { Page } from "@/stories/Page";

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export default async function Home() {
  const session = await getServerSession(authOptions)
  // const { data } = useSWR<User>('/api/user', fetcher)
  
  if (session) {
    return (
      <Page newUser={session.user} key="" />
    );
  }
  return (
    <Page newUser={undefined} key="" />
  );

}
