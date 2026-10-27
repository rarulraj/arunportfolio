import Image from "next/image";
import { Column, Heading, SmartLink, Text } from "@/once-ui/components";
import { formatSubstackDate, type SubstackPost } from "@/app/resources/substack";
import styles from "./SubstackPosts.module.scss";

export function SubstackPosts({ posts }: { posts: SubstackPost[] }) {
  if (!posts.length) {
    return (
      <Text onBackground="neutral-weak">
        Writing lives on{" "}
        <SmartLink href="https://arunarulraj.substack.com">Substack</SmartLink>.
      </Text>
    );
  }

  const [featured, ...rest] = posts;

  return (
    <Column fillWidth gap="32">
      <a className={styles.featured} href={featured.link} target="_blank" rel="noreferrer">
        {featured.image ? (
          <div className={styles.featuredMedia}>
            <Image src={featured.image} alt="" fill sizes="(max-width: 960px) 100vw, 720px" unoptimized />
          </div>
        ) : null}
        <div className={styles.featuredBody}>
          <Text variant="label-default-s" onBackground="brand-weak">
            Latest on Substack · {formatSubstackDate(featured.publishedAt)}
          </Text>
          <Heading as="h2" variant="heading-strong-l">
            {featured.title}
          </Heading>
          <Text variant="body-default-m" onBackground="neutral-weak">
            {featured.summary}
          </Text>
          <Text variant="label-default-s" className={styles.cta}>
            Read on Substack →
          </Text>
        </div>
      </a>

      <div className={styles.grid}>
        {rest.map((post) => (
          <a key={post.slug} className={styles.card} href={post.link} target="_blank" rel="noreferrer">
            {post.image ? (
              <div className={styles.thumb}>
                <Image src={post.image} alt="" fill sizes="320px" unoptimized />
              </div>
            ) : (
              <div className={styles.thumbEmpty} />
            )}
            <div className={styles.cardBody}>
              <Text variant="label-default-s" onBackground="neutral-weak">
                {formatSubstackDate(post.publishedAt)}
              </Text>
              <Heading as="h3" variant="heading-strong-s">
                {post.title}
              </Heading>
              <Text variant="body-default-s" onBackground="neutral-weak">
                {post.summary}
              </Text>
            </div>
          </a>
        ))}
      </div>
    </Column>
  );
}
