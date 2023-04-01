import Head from "next/head";
import Link from "next/link";
import React from "react";

import logo from "../assets/logo.svg";
import styles from "./main.module.scss";

interface LinkSetProps {
  title: string;
  href?: string;
  children?: LinkSetProps[];
}

const navData: LinkSetProps[] = [
  {
    title: "Overview",
    href: "/",
  },
  {
    title: "Getting started",
    children: [
      {
        title: "Installation",
        href: "/installation",
      },
      {
        title: "Attributes",
        href: "/attributes",
      },
      {
        title: "Building inputs",
        href: "/building-inputs",
      },
      {
        title: "Validation",
        href: "/validation",
      },
      {
        title: "Submitting",
        href: "/submit",
      },
    ],
  },
  {
    title: "Components",
    children: [
      {
        title: "Form",
        href: "/component-form",
      },
      {
        title: "Input Group",
        href: "/component-input-group",
      },
      {
        title: "Radio Group",
        href: "/component-radio-group",
      },
      {
        title: "Select Group",
        href: "/component-select-group",
      },
      {
        title: "List Group",
        href: "/component-list-group",
      },
      {
        title: "Check Group",
        href: "/component-check-group",
      },
    ],
  },
];

function NavLink({ title, href }: { title: string; href?: string }) {
  if (href) {
    return (
      <p className={styles.linkWrapper}>
        <Link href={href}>{title}</Link>
      </p>
    );
  }

  return <p className={styles.noLinkWrapper}>{title}</p>;
}

function LinkSet({ title, href, children }: LinkSetProps) {
  return (
    <>
      <NavLink title={title} href={href} />
      {Boolean(children) && (
        <ul>
          {children?.map((child) => (
            <li className={styles.linkWrapper} key={child.title}>
              <Link className={styles.link} href={child.href || "#"}>
                {child.title}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}

function Links() {
  return (
    <div className="position-relative">
      <div className={styles.links + " border-end p-2 pt-4"}>
        {navData.map((data, index) => (
          <LinkSet key={index} {...data} />
        ))}
      </div>
    </div>
  );
}

function Nav() {
  return (
    <nav className="bg-primary navbar navbar-dark navbar-expand-lg position-fixed top-0 w-100">
      <div className="container-fluid" style={{ maxWidth: "1200px" }}>
        <a className="navbar-brand" href="/">
          <picture>
            <img src={logo.src} alt="React Form Logo" />
          </picture>
        </a>
        <button className="navbar-toggler" type="button"></button>
        <div className="collapse navbar-collapse" id="navbarText"></div>
        <div>
          <a href="https://github.com/AdeAttwood/ReactForm" title="React Form GitHub" target="_blank" rel="noreferrer">
            <i className="bi bi-github h2 text-light" />
          </a>
        </div>
      </div>
    </nav>
  );
}

interface MainProps {
  meta: {
    title?: string;
  };
}

export default function Main({ meta, children }: React.PropsWithChildren<MainProps>) {
  return (
    <>
      <Head>
        <title>{meta.title ? `React Form | ${meta.title}` : "React Form"}</title>
      </Head>
      <Nav />
      <div className={styles.mainGrid}>
        <Links />
        <main className="p-4 w-100 overflow-hidden">{children}</main>
      </div>
    </>
  );
}
