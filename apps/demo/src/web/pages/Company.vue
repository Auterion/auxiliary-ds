<script setup lang="ts">
import { inject } from 'vue';
import { Button, Badge, Avatar, AvatarFallback } from '@auxiliary/vue';
import { Icon } from '@auxiliary/icons';
import WebHero from '../WebHero.vue';

const navigate = inject<(p: string) => void>('navigate', () => {});

const stats = [
  { value: '2017', label: 'Founded' },
  { value: '450+', label: 'Team members' },
  { value: '6', label: 'Global offices' },
  { value: '$430M', label: 'Raised' },
];
const values = [
  { icon: 'drone', name: 'Mission first', blurb: 'We build for the operator in the field, not the demo on the stage.' },
  { icon: 'lock', name: 'Open by default', blurb: 'Open standards and APIs beat walled gardens — for everyone.' },
  { icon: 'circle-check', name: 'Earn trust', blurb: 'Safety, security and reliability are features, never afterthoughts.' },
] as const;
const team = [
  { initials: 'LM', name: 'Lorenz M.', role: 'CEO' },
  { initials: 'KS', name: 'Kevin S.', role: 'CTO' },
  { initials: 'AD', name: 'Aïcha D.', role: 'VP Product' },
  { initials: 'RT', name: 'Ravi T.', role: 'VP Engineering' },
  { initials: 'EN', name: 'Elin N.', role: 'VP Defense' },
  { initials: 'MO', name: 'Marco O.', role: 'VP Operations' },
];
const news = [
  { tag: 'Press', title: 'Auterion partners with allied forces on counter-UAS autonomy', date: 'May 2026' },
  { tag: 'Product', title: 'AuterionOS 4.2 brings on-device tracking to every Skynode', date: 'Apr 2026' },
  { tag: 'Company', title: 'Auterion opens new R&D center in Munich', date: 'Mar 2026' },
];
</script>

<template>
  <div>
    <WebHero
      eyebrow="Company"
      title="Software for the robotic age"
      subtitle="We're building the open operating system that lets any organization deploy autonomous robots — safely, at scale, anywhere."
      primary="Join us"
      secondary="Our story"
    />

    <!-- stats -->
    <section class="border-b border-border/60">
      <div class="mx-auto grid max-w-6xl grid-cols-2 gap-8 px-6 py-14 lg:grid-cols-4">
        <div v-for="s in stats" :key="s.label">
          <p class="text-3xl font-semibold tracking-tight tabular-nums lg:text-4xl">{{ s.value }}</p>
          <p class="mt-1 text-[14px] text-muted-foreground">{{ s.label }}</p>
        </div>
      </div>
    </section>

    <!-- values -->
    <section class="mx-auto max-w-6xl px-6 py-20">
      <div class="max-w-xl">
        <p class="text-[13px] font-medium uppercase tracking-widest text-muted-foreground">What we believe</p>
        <h2 class="mt-2 text-3xl font-semibold tracking-tight lg:text-4xl">Principles that guide the work</h2>
      </div>
      <div class="mt-10 grid gap-4 md:grid-cols-3">
        <div v-for="v in values" :key="v.name" class="rounded-2xl border border-border bg-card p-6">
          <div class="flex h-11 w-11 items-center justify-center rounded-xl border border-border bg-secondary"><Icon :name="v.icon" size="md" /></div>
          <h3 class="mt-4 text-[17px] font-semibold">{{ v.name }}</h3>
          <p class="mt-1.5 text-[14px] leading-relaxed text-muted-foreground">{{ v.blurb }}</p>
        </div>
      </div>
    </section>

    <!-- team -->
    <section class="border-y border-border/60 bg-card/40">
      <div class="mx-auto max-w-6xl px-6 py-20">
        <h2 class="text-3xl font-semibold tracking-tight lg:text-4xl">Leadership</h2>
        <div class="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          <div v-for="t in team" :key="t.name" class="flex flex-col items-center rounded-2xl border border-border bg-card p-5 text-center">
            <Avatar size="lg"><AvatarFallback>{{ t.initials }}</AvatarFallback></Avatar>
            <p class="mt-3 text-[14px] font-medium">{{ t.name }}</p>
            <p class="text-[12px] text-muted-foreground">{{ t.role }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- news -->
    <section class="mx-auto max-w-6xl px-6 py-20">
      <div class="mb-8 flex items-end justify-between">
        <h2 class="text-3xl font-semibold tracking-tight lg:text-4xl">Newsroom</h2>
        <button class="text-[14px] text-muted-foreground hover:text-foreground">All news</button>
      </div>
      <div class="grid gap-4 md:grid-cols-3">
        <a v-for="n in news" :key="n.title" class="group flex flex-col rounded-2xl border border-border bg-card p-6 transition-all hover:-translate-y-0.5 hover:shadow-xl">
          <Badge variant="secondary" size="sm" class="self-start">{{ n.tag }}</Badge>
          <h3 class="mt-3 flex-1 text-[16px] font-semibold leading-snug">{{ n.title }}</h3>
          <p class="mt-4 text-[12px] text-muted-foreground">{{ n.date }}</p>
        </a>
      </div>
    </section>

    <!-- careers CTA -->
    <section class="border-t border-border/60">
      <div class="mx-auto max-w-6xl px-6 py-20 text-center">
        <h2 class="text-3xl font-semibold tracking-tight lg:text-4xl">Come build the future of autonomy</h2>
        <p class="mx-auto mt-3 max-w-lg text-[16px] text-muted-foreground">We're hiring across engineering, product, defense and operations — worldwide.</p>
        <div class="mt-7 flex justify-center gap-3">
          <Button size="lg" class="gap-2">See open roles <Icon name="arrow-right" size="xs" /></Button>
          <Button variant="secondary" size="lg" @click="navigate('home')">Back to home</Button>
        </div>
      </div>
    </section>
  </div>
</template>
