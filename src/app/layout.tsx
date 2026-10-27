import "@/once-ui/styles/index.scss";
import "@/once-ui/tokens/index.scss";

import classNames from "classnames";

import { Footer, Header, RouteGuard } from "@/components";
import { SiteBackground } from "@/components/SiteBackground";
import { baseURL, effects, style, font, home, about } from "@/app/resources";

import { Background, Column, Flex, ThemeProvider, ToastProvider } from "@/once-ui/components";
import { opacity, SpacingToken } from "@/once-ui/types";
import { Meta } from "@/once-ui/modules";

export async function generateMetadata() {
  return Meta.generate({
    title: home.title,
    description: home.description,
    baseURL: baseURL,
    path: about.path,
    image: home.image,
  });
}

interface RootLayoutProps {
  children: React.ReactNode;
}

export default async function RootLayout({ children }: RootLayoutProps) {
  return (
    <Flex
      suppressHydrationWarning
      as="html"
      lang="en"
      background="page"
      data-neutral={style.neutral}
      data-brand={style.brand}
      data-accent={style.accent}
      data-solid={style.solid}
      data-solid-style={style.solidStyle}
      data-border={style.border}
      data-surface={style.surface}
      data-transition={style.transition}
      className={classNames(
        font.primary.variable,
        font.secondary.variable,
        font.tertiary.variable,
        font.code.variable,
      )}
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var theme = 'system';
                  try {
                    if (window.localStorage && typeof window.localStorage.getItem === 'function') {
                      theme = window.localStorage.getItem('theme') || 'system';
                    }
                  } catch (e) {}
                  var root = document.documentElement;
                  if (theme === 'system') {
                    var isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                    root.setAttribute('data-theme', isDark ? 'dark' : 'light');
                  } else {
                    root.setAttribute('data-theme', theme);
                  }
                } catch (e) {
                  document.documentElement.setAttribute('data-theme', 'dark');
                }
              })();
            `,
          }}
        />
      </head>
      <ThemeProvider>
        <ToastProvider>
          <Column style={{ minHeight: "100vh", position: "relative" }} as="body" fillWidth margin="0" padding="0">
            <SiteBackground />
            <Background
              position="fixed"
              mask={{
                x: effects.mask.x,
                y: effects.mask.y,
                radius: effects.mask.radius,
                cursor: effects.mask.cursor
              }}
              gradient={{
                display: effects.gradient.display,
                opacity: 35 as opacity,
                x: effects.gradient.x,
                y: effects.gradient.y,
                width: effects.gradient.width,
                height: effects.gradient.height,
                tilt: effects.gradient.tilt,
                colorStart: effects.gradient.colorStart,
                colorEnd: effects.gradient.colorEnd,
              }}
              dots={{
                display: false,
                opacity: effects.dots.opacity as opacity,
                size: effects.dots.size as SpacingToken,
                color: effects.dots.color,
              }}
              grid={{
                display: false,
                opacity: effects.grid.opacity as opacity,
                color: effects.grid.color,
                width: effects.grid.width,
                height: effects.grid.height,
              }}
              lines={{
                display: effects.lines.display,
                opacity: effects.lines.opacity as opacity,
                size: effects.lines.size as SpacingToken,
                thickness: effects.lines.thickness,
                angle: effects.lines.angle,
                color: effects.lines.color,
              }}
            />
            <Flex fillWidth minHeight="16" hide="s" style={{ position: "relative", zIndex: 1 }}></Flex>
            <div style={{ position: "relative", zIndex: 1 }}>
              <Header />
            </div>
            <Flex
              zIndex={1}
              fillWidth
              paddingY="l"
              paddingX="l"
              horizontal="center"
              flex={1}
              style={{ position: "relative" }}
            >
              <Flex horizontal="center" fillWidth minHeight="0">
                <RouteGuard>{children}</RouteGuard>
              </Flex>
            </Flex>
            <div style={{ position: "relative", zIndex: 1 }}>
              <Footer />
            </div>
          </Column>
        </ToastProvider>
      </ThemeProvider>
    </Flex>
  );
}
