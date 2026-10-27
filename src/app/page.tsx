import React from "react";

import { Heading, Column, RevealFx, SmartLink, Text } from "@/once-ui/components";
import { Projects } from "@/components/work/Projects";
import { Hero } from "@/components/Hero";
import { GitHubProjects } from "@/components/GitHubProjects";
import { SubstackPosts } from "@/components/blog/SubstackPosts";

import { baseURL, routes } from "@/app/resources";
import { home, about, person, blog } from "@/app/resources/content";
import { getSubstackPosts } from "@/app/resources/substack";
import { Meta, Schema } from "@/once-ui/modules";

export async function generateMetadata() {
  return Meta.generate({
    title: home.title,
    description: home.description,
    baseURL: baseURL,
    path: home.path,
  });
}

export default async function Home() {
  const posts = routes["/blog"] ? (await getSubstackPosts()).slice(0, 5) : [];

  return (
    <Column maxWidth="m" gap="xl" horizontal="center">
      <Schema
        as="webPage"
        baseURL={baseURL}
        path={home.path}
        title={home.title}
        description={home.description}
        image={`${baseURL}/og?title=${encodeURIComponent(home.title)}`}
        author={{
          name: person.name,
          url: `${baseURL}${about.path}`,
          image: `${baseURL}${person.avatar}`,
        }}
      />
      <Hero />
      <RevealFx translateY="16" delay={0.15}>
        <Column fillWidth gap="24">
          <Heading as="h2" variant="display-strong-xs" wrap="balance" style={{ paddingLeft: "1.5rem" }}>
            TDengine case studies
          </Heading>
          <Projects range={[1, 2]} />
        </Column>
      </RevealFx>
      <RevealFx translateY="16" delay={0.25}>
        <Projects range={[3]} />
      </RevealFx>
      {posts.length > 0 && (
        <RevealFx translateY="16" delay={0.28}>
          <Column fillWidth gap="20" paddingX="l">
            <Column gap="8">
              <Heading as="h2" variant="display-strong-xs">
                From the blog
              </Heading>
              <Text onBackground="neutral-weak">
                Latest from{" "}
                <SmartLink href="https://arunarulraj.substack.com">Substack</SmartLink>
                {" · "}
                <SmartLink href={blog.path}>See all writing</SmartLink>
              </Text>
            </Column>
            <SubstackPosts posts={posts} />
          </Column>
        </RevealFx>
      )}
      <RevealFx translateY="16" delay={0.3}>
        <GitHubProjects />
      </RevealFx>
    </Column>
  );
}
