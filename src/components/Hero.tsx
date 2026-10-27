"use client";

import React from "react";
import dynamic from "next/dynamic";
import { Avatar, Button, Column, Heading, Row, Text } from "@/once-ui/components";
import { about, home, person } from "@/app/resources/content";
import styles from "./Hero.module.scss";

const IndustrialScene = dynamic(
  () => import("./IndustrialScene").then((m) => m.IndustrialScene),
  { ssr: false, loading: () => <div className={styles.sceneFallback} aria-hidden /> },
);

export const Hero: React.FC = () => {
  return (
    <section className={styles.hero} aria-label="Introduction">
      <div className={styles.atmosphere} aria-hidden />
      <div className={styles.scan} aria-hidden />

      <div className={styles.layout}>
        <Column fillWidth gap="0" className={styles.copy} style={{ position: "relative", zIndex: 1 }}>
          <Heading as="h1" className={styles.brand} variant="display-strong-xl">
            {home.headline}
          </Heading>
          <p className={styles.role}>
            {person.role} @ TDengine · Bay Area · Founder (acquired)
          </p>
          <Text
            className={styles.subline}
            wrap="balance"
            onBackground="neutral-weak"
            variant="heading-default-l"
          >
            {home.subline}
          </Text>
          <div className={styles.actions}>
            <Button href={about.path} variant="primary" size="m" arrowIcon>
              <Row gap="8" vertical="center">
                <Avatar src={person.avatar} size="s" style={{ marginLeft: "-0.35rem" }} />
                About {person.firstName}
              </Row>
            </Button>
            <Button href="/work" variant="secondary" size="m">
              Case studies
            </Button>
            <Button href="https://github.com/rarulraj" variant="tertiary" size="m">
              GitHub
            </Button>
          </div>
        </Column>

        <IndustrialScene />
      </div>
    </section>
  );
};
