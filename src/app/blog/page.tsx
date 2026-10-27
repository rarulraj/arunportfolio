import { Column, Heading, SmartLink, Text } from "@/once-ui/components";
import { baseURL } from "@/app/resources";
import { blog, person } from "@/app/resources/content";
import { getSubstackPosts } from "@/app/resources/substack";
import { SubstackPosts } from "@/components/blog/SubstackPosts";
import { Meta, Schema } from "@/once-ui/modules";

export async function generateMetadata() {
  return Meta.generate({
    title: blog.title,
    description: blog.description,
    baseURL: baseURL,
    image: `${baseURL}/og?title=${encodeURIComponent(blog.title)}`,
    path: blog.path,
  });
}

export default async function Blog() {
  const posts = await getSubstackPosts();

  return (
    <Column maxWidth="m" gap="24">
      <Schema
        as="blog"
        baseURL={baseURL}
        title={blog.title}
        description={blog.description}
        path={blog.path}
        image={`${baseURL}/og?title=${encodeURIComponent(blog.title)}`}
        author={{
          name: person.name,
          url: `${baseURL}/blog`,
          image: `${baseURL}${person.avatar}`,
        }}
      />
      <Column gap="12" maxWidth="s">
        <Heading variant="display-strong-s">{blog.title}</Heading>
        <Text onBackground="neutral-weak" variant="body-default-l">
          Essays on industrial AI, agents, and building — pulled live from{" "}
          <SmartLink href="https://arunarulraj.substack.com">
            arunarulraj.substack.com
          </SmartLink>
          .
        </Text>
      </Column>
      <SubstackPosts posts={posts} />
    </Column>
  );
}
