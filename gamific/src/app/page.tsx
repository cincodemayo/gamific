"use client";
import useSWR from 'swr';

import { getServerSession } from 'next-auth'
import { authOptions } from '../pages/api/auth/[...nextauth]/route'

import { Page } from "@/stories/Page";
import { User } from "@/stories/Header";

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export default async function Home() {
  const session = await getServerSession(authOptions)
  const { data } = useSWR<User>('/api/user', fetcher)
  
  if (session) {
    return (
      <Page newUser={session.user} key="" />
    );
  }
  return (
    <Page newUser={data} key="" />
  );

}
