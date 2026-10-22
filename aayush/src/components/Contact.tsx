"use client";

import { ArrowUpRight, Mail } from "lucide-react";

import { Reveal } from "@/components/Reveal";
import { GitHubIcon, LinkedInIcon } from "@/components/icons";
import { profile } from "@/data/portfolio";

export function Contact() {
  const channels = [
    { label: "GitHub", handle: "@alex", href: profile.github, Icon: GitHubIcon },
    { label: "LinkedIn", handle: "in/alex", href: profile.linkedin, Icon: LinkedInIcon },
    { label: "Email", handle: profile.email, href: `mailto:${profile.email}`, Icon: Mail },
  ];

  return (
    <section id="contact" className="scroll-mt-24 px-6 py-32 md:px-10 md:py-40">
      <div className="mx-auto max-w-7xl">
        <Reveal>
          <div className="overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.02]">
            <div className="grid gap-12 p-8 md:p-14 lg:grid-cols-12 lg:items-end lg:gap-16 lg:p-20">
              <div className="lg:col-span-7">
                <p className="flex flex-wrap items-center gap-3 text-[11px] uppercase tracking-[0.3em] text-white/45">
                  <span className="inline-block size-1.5 rounded-full bg-paper" aria-hidden="true" />
                  Quest IV · Final
                  <span className="rounded-full border border-white/15 px-2.5 py-1 text-[10px] tracking-[0.18em] text-white/55">
                    Legendary
                  </span>
                  <span className="font-mono text-[11px] tracking-[0.16em] text-white/40">
                    +1500 XP
                  </span>
                </p>

                <h2 className="mt-8 text-[clamp(2.4rem,6.5vw,5rem)] font-medium leading-[0.95] tracking-[-0.04em] text-paper">
                  Tell me what you&rsquo;re building.
                </h2>

                <p className="mt-7 max-w-lg text-base leading-relaxed text-white/45">
                  Objective: a fast, quiet interface that holds up under real traffic. Two
                  engagements a quarter — product work, design systems and performance rescue.
                </p>

                <a
                  href={`mailto:${profile.email}`}
                  className="group mt-10 inline-flex items-center gap-3 rounded-full bg-paper px-7 py-4 text-sm font-medium tracking-tight text-ink transition-opacity duration-300 hover:opacity-80"
                >
                  <Mail className="size-4" aria-hidden="true" />
                  {profile.email}
                  <ArrowUpRight
                    className="size-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                    aria-hidden="true"
                  />
                </a>
              </div>

              <div className="lg:col-span-5">
                <p className="text-[10px] uppercase tracking-[0.24em] text-white/30">
                  Other channels
                </p>
                <ul className="mt-5 overflow-hidden rounded-2xl border border-white/10">
                  {channels.map((channel) => (
                    <li key={channel.label} className="border-b border-white/10 last:border-b-0">
                      <a
                        href={channel.href}
                        target={channel.href.startsWith("mailto:") ? undefined : "_blank"}
                        rel={channel.href.startsWith("mailto:") ? undefined : "noopener noreferrer"}
                        className="group flex items-center justify-between gap-4 px-6 py-5 transition-colors duration-300 hover:bg-white/[0.04]"
                      >
                        <span className="flex items-center gap-3">
                          <channel.Icon className="size-4 text-white/50" aria-hidden="true" />
                          <span className="text-sm tracking-tight text-white/70">
                            {channel.label}
                          </span>
                        </span>
                        <span className="flex items-center gap-2 text-sm tracking-tight text-white/35">
                          {channel.handle}
                          <ArrowUpRight
                            className="size-3.5 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                            aria-hidden="true"
                          />
                        </span>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
