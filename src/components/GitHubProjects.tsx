"use client";

import { Column, Flex, Heading, SmartLink, Text } from "@/once-ui/components";
import styles from "./GitHubProjects.module.scss";

const repos = [
  {
    name: "Reefly-IOS",
    blurb: "Native Expo iOS for Reefly — tank community companion (acquired product).",
    lang: "TypeScript",
    href: "https://github.com/rarulraj/Reefly-IOS",
  },
  {
    name: "Touchy-",
    blurb: "Interactive product surface — TypeScript app work.",
    lang: "TypeScript",
    href: "https://github.com/rarulraj/Touchy-",
  },
  {
    name: "TheFoundersExperience-",
    blurb: "Startup community product for The Founders Experience.",
    lang: "TypeScript",
    href: "https://github.com/rarulraj/TheFoundersExperience-",
  },
  {
    name: "Voxs",
    blurb: "Online multiplayer voxel shooter — C++ server / playgrounds.",
    lang: "C++",
    href: "https://github.com/rarulraj/Voxs",
  },
  {
    name: "MLAgenticTeacher-",
    blurb: "From-scratch ML + agentic curriculum in Python.",
    lang: "Python",
    href: "https://github.com/rarulraj/MLAgenticTeacher-",
  },
  {
    name: "Operator-",
    blurb: "Operator tooling experiments in TypeScript.",
    lang: "TypeScript",
    href: "https://github.com/rarulraj/Operator-",
  },
  {
    name: "Stacky-",
    blurb: "Stack / product experiments.",
    lang: "TypeScript",
    href: "https://github.com/rarulraj/Stacky-",
  },
  {
    name: "PromptCraft",
    blurb: "Python-powered prompt craft for AI-driven DnD features.",
    lang: "Python",
    href: "https://github.com/rarulraj/PromptCraft",
  },
];

export function GitHubProjects() {
  return (
    <Column fillWidth gap="24" paddingX="l">
      <Flex fillWidth horizontal="space-between" vertical="end" wrap gap="16">
        <Column gap="8" maxWidth={28}>
          <Heading as="h2" variant="display-strong-xs">
            Open source & builds
          </Heading>
          <Text variant="body-default-m" onBackground="neutral-weak">
            Selected public repos from{" "}
            <SmartLink href="https://github.com/rarulraj">github.com/rarulraj</SmartLink>
            — products, games, and ML experiments alongside TDengine case studies.
          </Text>
        </Column>
        <SmartLink href="https://github.com/rarulraj" suffixIcon="arrowUpRightFromSquare">
          <Text variant="label-default-s">View GitHub profile</Text>
        </SmartLink>
      </Flex>

      <div className={styles.grid}>
        {repos.map((repo) => (
          <a key={repo.name} className={styles.card} href={repo.href} target="_blank" rel="noreferrer">
            <div className={styles.top}>
              <span className={styles.name}>{repo.name}</span>
              <span className={styles.lang}>{repo.lang}</span>
            </div>
            <p className={styles.blurb}>{repo.blurb}</p>
          </a>
        ))}
      </div>
    </Column>
  );
}
