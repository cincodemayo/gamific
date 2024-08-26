"use client";
import useSwr from 'swr';

import { Page } from "@/stories/Page";
import { User } from "@/stories/Header";

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export default function Home() {
  const { data, error } = useSwr('/api/user', fetcher)
  if (error) return <div>Failed to load users</div>
  if (!data) return <div>Loading...</div>
  return (
    <div>
      {/* {data.map((user?: User) => ( */}
        <Page newUser={{name: "John Doe", avatar: {type: "initials", text: "JD"}}} key="hi" />
      {/* ))} */}
    </div>
  );
}
