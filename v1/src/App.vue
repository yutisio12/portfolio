<script setup lang="ts">
import { ref, onMounted, computed, nextTick } from "vue";
import ParticleBackground from "./components/ParticleBackground.vue";

const data = ref<any>(null);
const loading = ref(true);
const totalContributions = ref<string | null>(null);
const selectedAttachment = ref<{ title: string; url: string } | null>(null);
const selectedProject = ref<{ name: string; link: string } | null>(null);
const iframeError = ref(false);
const iframeLoading = ref(false);

const openModal = (title: string, url: string) => {
  selectedAttachment.value = { title, url };
  document.body.style.overflow = 'hidden';
};

const closeModal = () => {
  selectedAttachment.value = null;
  document.body.style.overflow = '';
};

const isValidLink = (link: string) => !!link && link !== '#';

const openProjectPreview = (proj: { name: string; link: string }) => {
  selectedProject.value = { name: proj.name, link: proj.link };
  iframeError.value = false;
  iframeLoading.value = isValidLink(proj.link);
  document.body.style.overflow = 'hidden';
};

const closeProjectPreview = () => {
  selectedProject.value = null;
  iframeError.value = false;
  document.body.style.overflow = '';
};

const handleIframeError = () => {
  iframeError.value = true;
  iframeLoading.value = false;
};

const handleIframeLoad = () => {
  iframeLoading.value = false;
};

onMounted(async () => {
  try {
    const res = await fetch("/data.json");
    data.value = await res.json();
  } catch (err) {
    console.error("Failed to load data", err);
  } finally {
    loading.value = false;

    await nextTick();
    if (data.value?.github_calendar?.username) {
      const u = data.value.github_calendar.username;
      try {
        const html = await (
          await fetch(`https://corsproxy.io/?https://github.com/${u}`)
        ).text();
        const match = html.match(
          /(\d{1,3}(,\d{3})*)\s+contributions\s+in\s+the\s+last/i,
        );
        if (match) {
          totalContributions.value = match[1];
        }
      } catch (err) {
        console.error("Failed to scrape github stats", err);
      }
    }
  }
});

const customStyles = computed(() => {
  if (!data.value?.theme) return {};
  const t = data.value.theme;
  return {
    "--background": t.background,
    "--foreground": t.foreground,
    "--primary": t.primary,
    "--primary-foreground": t.primary_foreground,
    "--muted": t.muted,
    "--muted-foreground": t.muted_foreground,
    "--card": t.card,
    "--border": t.border,
  };
});

const fallbackImg = computed(() => {
  return (
    data.value?.general?.fallback_image ||
    "https://placehold.co/600x400?text=404+Not+Found"
  );
});

const handleImageError = (e: Event) => {
  const target = e.target as HTMLImageElement;
  target.src = fallbackImg.value;
};

const getTechIconUrl = (name: string) => {
  const n = name.toLowerCase().replace(/[^a-z0-9]/g, "");
  const map: Record<string, string> = {
    vue3: "vuejs",
    vue: "vuejs",
    tailwind: "tailwindcss",
    tailwindcss: "tailwindcss",
    js: "javascript",
    ts: "typescript",
    node: "nodejs",
    react: "react",
    css: "css3",
    html: "html5",
    python: "python",
  };
  const mapped = map[n] || n;
  return `https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/${mapped}/${mapped}-original.svg`;
};
</script>

<template>
  <div
    :style="customStyles"
    class="min-h-screen bg-background text-foreground font-sans selection:bg-primary selection:text-foreground vignette-glow relative overflow-hidden"
  >
    <ParticleBackground />

    <div v-if="loading" class="flex items-center justify-center min-h-screen">
      <div
        class="animate-pulse text-muted-foreground font-mono-accent text-sm tracking-widest uppercase"
      >
        Loading...
      </div>
    </div>

    <main v-else class="relative z-10">
      <!-- HERO -->
      <section
        class="min-h-[100dvh] flex flex-col items-center justify-center relative px-6"
      >
        <div
          v-motion-fade-visible-once
          class="relative inline-flex items-center justify-center w-full max-w-[95vw] mx-auto overflow-hidden sm:overflow-visible"
        >
          <h1
            class="text-[clamp(4.5rem,18vw,18rem)] leading-none font-heading text-transparent uppercase text-stroke-1 sm:text-stroke-2 z-10 w-full text-center whitespace-nowrap"
          >
            {{ data.profile.name }}
          </h1>
          <div
            class="absolute left-0 right-0 top-1/2 h-[2px] bg-primary -translate-y-1/2 w-full sm:w-[120%] sm:-ml-[10%] z-20 rotate-0"
            style="background-color: #FFFFFF"
          ></div>
        </div>

        <p
          v-motion-fade-visible-once
          :delay="200"
          class="mt-8 text-primary font-mono-accent text-sm sm:text-xl md:text-3xl tracking-[0.2em] uppercase text-center relative z-20 whitespace-nowrap"
        >
          {{ data.profile.title }}
        </p>

        <!-- Experience Info -->
        <div
          v-motion-fade-visible-once
          :delay="400"
          class="absolute bottom-16 w-full flex justify-center"
        >
          <div
            class="bg-primary text-background font-mono-accent font-bold px-4 py-2 text-xs sm:text-sm uppercase flex items-center gap-3"
          >
            <span
              class="w-2 h-2 rounded-full bg-background animate-pulse"
            ></span>
            {{ data.profile.years_experience }}
            {{ data.general.experience_label }}
          </div>
        </div>
      </section>

      <!-- SECTIONS CONTAINER -->
      <div class="max-w-4xl mx-auto px-6 py-24 space-y-48">
        <!-- ABOUT -->
        <section class="space-y-12" v-if="data.profile.bio_title">
          <h2
            v-motion-slide-visible-once-bottom
            class="text-sm font-mono-accent text-muted-foreground tracking-widest uppercase"
          >
            {{ data.general.section_01 }} {{ data.profile.bio_title }}
          </h2>
          <div
            class="space-y-8 text-xl md:text-2xl text-foreground opacity-90 leading-relaxed font-light"
          >
            <p
              v-for="(p, i) in data.profile.bio_paragraphs"
              :key="i"
              v-motion-slide-visible-once-bottom
              :delay="Number(i) * 100"
            >
              {{ p }}
            </p>
          </div>
        </section>

        <!-- PROJECTS -->
        <section class="space-y-12" v-if="data.projects">
          <h2
            v-motion-slide-visible-once-bottom
            class="text-sm font-mono-accent text-muted-foreground tracking-widest uppercase"
          >
            {{ data.general.section_02 }} {{ data.projects.title }}
          </h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div
              v-for="(proj, i) in data.projects.items"
              :key="'proj-' + i"
              @click="openProjectPreview(proj)"
              v-motion-slide-visible-once-bottom
              :delay="Number(i) * 100"
              class="block bg-card hover:bg-muted border border-border transition-all group relative overflow-hidden flex flex-col h-full cursor-pointer"
            >
              <div
                class="w-full h-48 bg-muted border-b border-border overflow-hidden"
              >
                <img
                  :src="proj.image || fallbackImg"
                  @error="handleImageError"
                  class="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity"
                  alt="Project Thumbnail"
                />
              </div>
              <div class="p-8 flex-1 flex flex-col">
                <h3
                  class="font-heading text-3xl text-foreground mb-4 group-hover:text-primary transition-colors uppercase"
                >
                  {{ proj.name }}
                </h3>
                <p class="text-base text-muted-foreground font-light mb-8">
                  {{ proj.description }}
                </p>
                <div class="flex flex-wrap gap-2 mt-auto">
                  <span
                    v-for="t in proj.tech"
                    :key="t"
                    class="px-3 py-1 bg-background border border-border text-xs font-mono-accent text-muted-foreground uppercase"
                    >{{ t }}</span
                  >
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- CERTIFICATIONS -->
        <section class="space-y-12" v-if="data.results">
          <h2
            v-motion-slide-visible-once-bottom
            class="text-sm font-mono-accent text-muted-foreground tracking-widest uppercase"
          >
            {{ data.general.section_03 }} {{ data.results.title }}
          </h2>
          <div class="flex flex-col gap-6">
            <div
              v-for="(item, i) in data.results.items"
              :key="i"
              v-motion-slide-visible-once-bottom
              :delay="Number(i) * 100"
              class="p-8 md:p-12 bg-card hover:bg-muted transition-all group relative border border-border"
            >
              <!-- Index badge -->
              <div
                class="absolute top-8 right-8 font-mono-accent text-xs text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity tracking-widest"
              >
                {{ String( Number(i) + 1 ).padStart(2, '0') }}
              </div>

              <!-- Accent dot -->
              <div
                class="absolute top-8 right-20 w-3 h-3 bg-primary opacity-0 group-hover:opacity-100 transition-opacity"
              ></div>

              <div class="flex flex-col gap-4">
                <!-- Title -->
                <h3
                  class="font-heading text-3xl md:text-4xl text-foreground group-hover:text-primary transition-colors tracking-wide uppercase pr-24"
                >
                  {{ item.title }}
                </h3>

                <!-- Issuer & Date row -->
                <div class="flex flex-wrap items-center gap-x-4 gap-y-2">
                  <span
                    v-if="item.issuer"
                    class="text-sm font-mono-accent text-primary tracking-wide"
                  >
                    {{ item.issuer }}
                  </span>
                  <span
                    v-if="item.issuer && item.date"
                    class="text-muted-foreground text-xs"
                  >•</span>
                  <span
                    v-if="item.date"
                    class="text-sm font-mono-accent text-muted-foreground"
                  >
                    {{ item.date }}
                  </span>
                </div>

                <!-- Credential ID -->
                <p
                  v-if="item.credential_id"
                  class="text-xs font-mono-accent text-muted-foreground tracking-widest uppercase"
                >
                  ID: {{ item.credential_id }}
                </p>

                <!-- Description -->
                <p class="text-base text-muted-foreground font-light leading-relaxed whitespace-pre-line">
                  {{ item.description }}
                </p>

                <!-- Attachment / Lampiran button -->
                <div class="flex flex-wrap gap-3 mt-4">
                  <button
                    v-if="item.attachment"
                    @click="openModal(item.title, item.attachment)"
                    class="inline-flex items-center gap-2 px-5 py-2.5 border border-border text-xs font-mono-accent text-muted-foreground hover:text-primary hover:border-primary transition-colors uppercase tracking-widest group/btn cursor-pointer"
                  >
                    <svg
                      class="w-4 h-4 transition-colors"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                      />
                    </svg>
                    View Certificate
                  </button>
                  <span
                    v-else
                    class="inline-flex items-center gap-2 px-5 py-2.5 border border-border/50 text-xs font-mono-accent text-muted-foreground/50 uppercase tracking-widest cursor-default"
                  >
                    <svg
                      class="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                      />
                    </svg>
                    No Attachment
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- TESTIMONIALS -->
        <section class="space-y-12" v-if="data.testimonials">
          <h2
            v-motion-slide-visible-once-bottom
            class="text-sm font-mono-accent text-muted-foreground tracking-widest uppercase"
          >
            {{ data.general.section_04 }} {{ data.testimonials.title }}
          </h2>
          <div class="space-y-16">
            <div
              v-for="(t, i) in data.testimonials.items"
              :key="i"
              v-motion-slide-visible-once-bottom
              :delay="Number(i) * 100"
              class="pl-8 md:pl-12 border-l-4 border-primary space-y-8"
            >
              <p
                class="text-2xl md:text-3xl text-foreground font-light italic leading-relaxed"
              >
                "{{ t.text }}"
              </p>
              <div class="flex items-center gap-6">
                <div
                  class="w-16 h-16 rounded-full bg-muted border border-border overflow-hidden flex items-center justify-center text-muted-foreground font-heading text-xl relative"
                >
                  <img
                    v-if="t.avatar"
                    :src="t.avatar"
                    @error="
                      (e) =>
                        ((e.target as HTMLImageElement).style.opacity = '0')
                    "
                    class="w-full h-full object-cover grayscale absolute inset-0 z-10 transition-opacity"
                  />
                  <span class="z-0">{{
                    t.author.substring(0, 2).toUpperCase()
                  }}</span>
                </div>
                <div>
                  <p class="font-bold text-foreground uppercase tracking-wide">
                    {{ t.author }}
                  </p>
                  <p class="text-primary font-mono-accent text-sm mt-1">
                    {{ t.role }}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- STACK -->
        <section class="space-y-12 relative py-12" v-if="data.stack">
          <div
            class="absolute right-[-1.5rem] sm:-right-6 top-0 bottom-0 w-2 sm:w-3 bg-primary"
          ></div>

          <div class="space-y-2 pr-12">
            <h2
              v-motion-slide-visible-once-bottom
              class="text-xs sm:text-sm font-mono-accent text-primary tracking-widest uppercase"
            >
              TECHNOLOGIES
            </h2>
            <h3
              v-motion-slide-visible-once-bottom
              class="text-5xl md:text-7xl lg:text-8xl font-heading uppercase text-foreground tracking-wide"
            >
              {{ data.stack.title }}
            </h3>
          </div>

          <div class="space-y-16 mt-16 pr-6 sm:pr-12">
            <div
              v-for="(cat, i) in data.stack.categories"
              :key="i"
              v-motion-slide-visible-once-bottom
              :delay="Number(i) * 100"
              class="space-y-8 pb-12 border-b border-border last:border-0 relative"
            >
              <h4
                class="text-3xl sm:text-4xl md:text-5xl font-heading text-primary uppercase tracking-wide"
              >
                {{ cat.name }}
              </h4>
              <div
                class="flex flex-wrap items-center gap-x-8 sm:gap-x-12 gap-y-6 sm:gap-y-8"
              >
                <div
                  v-for="item in cat.items"
                  :key="item"
                  class="flex items-center gap-3 sm:gap-4 group cursor-pointer"
                >
                  <div
                    class="w-8 h-8 sm:w-10 sm:h-10 relative flex items-center justify-center bg-background border border-border group-hover:border-primary transition-colors"
                  >
                    <span
                      class="text-muted-foreground group-hover:text-primary font-heading text-xs sm:text-sm font-bold absolute z-0"
                      >{{ item.substring(0, 2).toUpperCase() }}</span
                    >
                    <img
                      :src="getTechIconUrl(item)"
                      @error="
                        (e) =>
                          ((e.target as HTMLImageElement).style.opacity = '0')
                      "
                      class="w-5 h-5 sm:w-7 sm:h-7 object-contain z-10 relative bg-background"
                      :title="item"
                    />
                  </div>
                  <span
                    class="text-xs sm:text-sm font-mono-accent text-muted-foreground group-hover:text-primary uppercase transition-colors"
                    >{{ item }}</span
                  >
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- EXPERIENCE -->
        <section class="space-y-16" v-if="data.experience">
          <div class="space-y-2">
            <h2
              v-motion-slide-visible-once-bottom
              class="text-sm font-mono-accent text-primary tracking-widest uppercase"
            >
              {{ data.experience.subtitle || data.general.section_05 }}
            </h2>
            <h3
              v-motion-slide-visible-once-bottom
              class="text-5xl md:text-7xl lg:text-8xl font-heading uppercase text-foreground tracking-wide"
            >
              {{ data.experience.title }}
            </h3>
          </div>

          <div class="relative pl-8 sm:pl-12 space-y-16">
            <!-- Vertical Timeline Line -->
            <div
              class="absolute left-[3px] sm:left-[5px] top-3 bottom-0 w-[1px] bg-border opacity-50"
            ></div>

            <div
              v-for="(exp, i) in data.experience.items"
              :key="i"
              v-motion-slide-visible-once-bottom
              :delay="Number(i) * 100"
              class="relative"
            >
              <!-- Timeline Node -->
              <div
                class="absolute -left-[30px] sm:-left-[45px] top-1.5 w-2 h-2 sm:w-2.5 sm:h-2.5"
                :style="{ backgroundColor: exp.color || 'var(--primary)' }"
              ></div>

              <div class="space-y-2">
                <p
                  class="text-sm sm:text-base font-mono-accent text-muted-foreground"
                >
                  {{ exp.date }}
                </p>
                <h3
                  class="text-4xl sm:text-5xl md:text-6xl font-heading text-foreground uppercase tracking-wide"
                >
                  {{ exp.company }}
                </h3>
                <p
                  class="font-mono-accent text-sm sm:text-base"
                  :style="{ color: exp.color || 'var(--primary)' }"
                >
                  {{ exp.role }}
                </p>
              </div>
            </div>
          </div>
        </section>

        <!-- GITHUB CALENDAR -->
        <section class="space-y-12" v-if="data.github_calendar">
          <h2
            v-motion-slide-visible-once-bottom
            class="text-sm font-mono-accent text-muted-foreground tracking-widest uppercase"
          >
            {{ data.general.section_06 }} {{ data.github_calendar.title }}
          </h2>
          <div
            v-motion-slide-visible-once-bottom
            class="border border-border p-6 md:p-12 bg-card hover:bg-muted transition-colors relative overflow-hidden group space-y-8 flex flex-col"
          >
            <div
              class="absolute top-8 right-8 w-3 h-3 bg-primary opacity-0 group-hover:opacity-100 transition-opacity"
            ></div>

            <div
              class="flex flex-col md:flex-row md:items-end justify-between gap-6 relative z-10 w-full"
            >
              <div>
                <p
                  class="text-muted-foreground font-mono-accent text-xs sm:text-sm tracking-widest uppercase mb-2"
                >
                  Contributions in the last year
                </p>
                <h3
                  class="text-4xl sm:text-5xl md:text-7xl font-heading text-foreground tracking-wide"
                >
                  {{ totalContributions !== null ? totalContributions : "..." }}
                  <span class="text-2xl sm:text-3xl md:text-5xl text-primary"
                    >TOTAL</span
                  >
                </h3>
              </div>
              <a
                :href="'https://github.com/' + data.github_calendar.username"
                target="_blank"
                class="px-6 py-3 border border-border text-xs font-mono-accent text-muted-foreground hover:text-primary hover:border-primary transition-colors uppercase whitespace-nowrap"
              >
                View Profile
              </a>
            </div>

            <div
              class="w-full overflow-x-auto overflow-y-hidden pt-8 border-t border-border mt-8"
            >
              <img
                :src="`https://ghchart.rshah.org/${data.theme && data.theme.primary ? data.theme.primary.replace('#', '') : 'F97316'}/${data.github_calendar.username}`"
                alt="GitHub Contributions Calendar"
                class="min-w-[700px] w-full h-auto opacity-80 group-hover:opacity-100 transition-opacity"
              />
            </div>
          </div>
        </section>

        <!-- CONTACT -->
        <section class="pt-24 pb-48 text-center space-y-12" v-if="data.contact">
          <h2
            v-motion-slide-visible-once-bottom
            class="text-4xl sm:text-5xl md:text-7xl font-heading uppercase text-foreground tracking-wide"
          >
            {{ data.contact.title }}
          </h2>
          <div
            v-motion-slide-visible-once-bottom
            :delay="200"
            class="flex flex-col sm:flex-row items-center justify-center gap-6"
          >
            <a
              :href="'mailto:' + data.contact.email"
              class="w-full sm:w-auto px-8 sm:px-12 py-6 bg-primary text-primary-foreground font-mono-accent font-bold tracking-widest uppercase hover:opacity-90 transition-colors"
            >
              {{ data.contact.email_label }}
            </a>
            <a
              :href="data.contact.github"
              target="_blank"
              rel="noopener noreferrer"
              class="w-full sm:w-auto px-8 sm:px-12 py-6 border border-border text-foreground font-mono-accent font-bold tracking-widest uppercase hover:border-primary hover:text-primary transition-colors"
            >
              {{ data.contact.github_label }}
            </a>
          </div>
        </section>
      </div>
    </main>

    <!-- PDF Modal -->
    <Teleport to="body">
      <Transition name="modal">
        <div
          v-if="selectedAttachment"
          id="pdf-modal-overlay"
          class="pdf-modal-overlay"
          @click.self="closeModal"
        >
          <div class="pdf-modal-container">
            <!-- Modal Header -->
            <div class="pdf-modal-header">
              <div class="pdf-modal-title-wrap">
                <div class="pdf-modal-accent"></div>
                <span class="pdf-modal-title">{{ selectedAttachment.title }}</span>
              </div>
              <div class="pdf-modal-actions">
                <a
                  :href="selectedAttachment.url"
                  download
                  class="pdf-modal-btn pdf-modal-btn--download"
                  title="Download"
                >
                  <svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" class="w-4 h-4">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  Download
                </a>
                <a
                  :href="selectedAttachment.url"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="pdf-modal-btn pdf-modal-btn--open"
                  title="Open in new tab"
                >
                  <svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" class="w-4 h-4">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                  Open Tab
                </a>
                <button
                  @click="closeModal"
                  class="pdf-modal-close"
                  title="Close"
                >
                  <svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" class="w-5 h-5">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            <!-- PDF iframe -->
            <div class="pdf-modal-body">
              <iframe
                :src="selectedAttachment.url"
                class="pdf-modal-iframe"
                frameborder="0"
                title="Certificate PDF"
              ></iframe>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- Project Preview Modal -->
    <Teleport to="body">
      <Transition name="modal">
        <div
          v-if="selectedProject"
          class="pdf-modal-overlay"
          @click.self="closeProjectPreview"
        >
          <div class="safari-window">
            <!-- Tab bar + traffic lights -->
            <div class="safari-tabbar">
              <div class="safari-dots">
                <button class="safari-dot safari-dot--close" @click="closeProjectPreview" title="Close">
                  <svg width="6" height="6" viewBox="0 0 6 6"><path d="M0 0l6 6M6 0l-6 6" stroke="currentColor" stroke-width="1.1" fill="none"/></svg>
                </button>
                <button class="safari-dot safari-dot--minimize" title="Minimize">
                  <svg width="6" height="6" viewBox="0 0 6 6"><path d="M0 3h6" stroke="currentColor" stroke-width="1.1" fill="none"/></svg>
                </button>
                <button class="safari-dot safari-dot--maximize" title="Maximize">
                  <svg width="6" height="6" viewBox="0 0 6 6"><path d="M0.5 2l2.5-1.5 2.5 1.5v2.5l-2.5 1.5-2.5-1.5z" stroke="currentColor" stroke-width="0.7" fill="none"/></svg>
                </button>
              </div>
              <div class="safari-tabs">
                <div class="safari-tab safari-tab--active">
                  <span class="safari-tab-title">{{ selectedProject.name }}</span>
                </div>
              </div>
            </div>
            <!-- Toolbar: nav + URL bar + actions -->
            <div class="safari-toolbar">
              <div class="safari-nav-group">
                <button class="safari-nav-btn" title="Back" disabled>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7"/></svg>
                </button>
                <button class="safari-nav-btn" title="Forward" disabled>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7"/></svg>
                </button>
              </div>
              <div class="safari-url-bar">
                <svg class="safari-lock-icon" width="11" height="11" viewBox="0 0 16 16" fill="currentColor">
                  <path d="M8 1a4 4 0 00-4 4v2H3a1 1 0 00-1 1v6a1 1 0 001 1h10a1 1 0 001-1V8a1 1 0 00-1-1h-1V5a4 4 0 00-4-4zm2.5 6h-5V5a2.5 2.5 0 015 0v2z"/>
                </svg>
                <span class="safari-url-text">{{ isValidLink(selectedProject.link) ? selectedProject.link.replace(/^https?:\/\//, '') : 'No URL' }}</span>
              </div>
              <div class="safari-actions">
                <a
                  v-if="isValidLink(selectedProject.link)"
                  :href="selectedProject.link"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="safari-action-btn"
                  title="Open in new tab"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/></svg>
                </a>
                <button class="safari-action-btn" title="Share">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8M16 6l-4-4-4 4M12 2v13"/></svg>
                </button>
              </div>
            </div>
            <!-- Content -->
            <div class="safari-body">
              <!-- Loading skeleton -->
              <div v-if="iframeLoading" class="browser-loading">
                <div class="skeleton-bar skeleton-bar--nav"></div>
                <div class="skeleton-bar skeleton-bar--hero"></div>
                <div class="skeleton-bar skeleton-bar--line" style="width:80%"></div>
                <div class="skeleton-bar skeleton-bar--line" style="width:60%"></div>
                <div class="skeleton-bar skeleton-bar--line" style="width:70%"></div>
                <p class="browser-loading-text">Loading preview<span class="loading-dots"></span></p>
              </div>
              <!-- Valid link, no iframe error -->
              <iframe
                v-if="isValidLink(selectedProject.link) && !iframeError"
                v-show="!iframeLoading"
                :src="selectedProject.link"
                @error="handleIframeError"
                @load="handleIframeLoad"
                class="pdf-modal-iframe"
                frameborder="0"
                :title="'Preview ' + selectedProject.name"
              ></iframe>
              <!-- Invalid link -->
              <div v-if="!isValidLink(selectedProject.link)" class="pdf-modal-message">
                <svg fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24" class="w-10 h-10 mb-4 text-muted-foreground">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                </svg>
                <p class="text-lg font-heading uppercase text-foreground mb-2">Preview Not Available</p>
                <p class="text-sm text-muted-foreground font-light">This project does not have a public URL.</p>
              </div>
              <!-- Iframe blocked -->
              <div v-if="isValidLink(selectedProject.link) && iframeError" class="pdf-modal-message">
                <svg fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24" class="w-10 h-10 mb-4 text-muted-foreground">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                </svg>
                <p class="text-lg font-heading uppercase text-foreground mb-2">Cannot Embed Preview</p>
                <p class="text-sm text-muted-foreground font-light mb-6">This website does not allow iframe embedding.</p>
                <a
                  :href="selectedProject.link"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="inline-flex items-center gap-2 px-6 py-3 border border-primary text-xs font-mono text-primary uppercase tracking-widest hover:bg-primary hover:text-background transition-colors"
                >
                  <svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" class="w-4 h-4">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                  Open in New Tab
                </a>
              </div>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<style>
html {
  scroll-behavior: smooth;
  color-scheme: dark;
}

/* ── PDF Modal ─────────────────────────────────────────────── */
.pdf-modal-overlay {
  position: fixed;
  inset: 0;
  z-index: 9999;
  background: rgba(11, 22, 34, 0.85);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
}

.pdf-modal-container {
  width: 100%;
  max-width: 900px;
  height: 90dvh;
  background: var(--card);
  border: 1px solid var(--border);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  box-shadow: 0 0 60px rgba(0, 191, 166, 0.12), 0 0 0 1px var(--border);
}

.pdf-modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 1.5rem;
  border-bottom: 1px solid var(--border);
  background: var(--muted);
  gap: 1rem;
  flex-shrink: 0;
}

.pdf-modal-title-wrap {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  overflow: hidden;
}

.pdf-modal-accent {
  width: 10px;
  height: 10px;
  background: var(--primary);
  flex-shrink: 0;
}

.pdf-modal-title {
  font-family: var(--font-heading, sans-serif);
  font-size: 0.875rem;
  color: var(--foreground);
  text-transform: uppercase;
  letter-spacing: 0.08em;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.pdf-modal-actions {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-shrink: 0;
}

.pdf-modal-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.4rem 0.9rem;
  border: 1px solid var(--border);
  font-size: 0.7rem;
  font-family: monospace;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--muted-foreground);
  text-decoration: none;
  transition: color 0.2s, border-color 0.2s;
  cursor: pointer;
  background: transparent;
}

.pdf-modal-btn--download:hover,
.pdf-modal-btn--open:hover {
  color: var(--primary);
  border-color: var(--primary);
}

.pdf-modal-close {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  border: 1px solid var(--border);
  background: transparent;
  color: var(--muted-foreground);
  cursor: pointer;
  transition: color 0.2s, border-color 0.2s, background 0.2s;
  flex-shrink: 0;
}

.pdf-modal-close:hover {
  color: var(--foreground);
  border-color: var(--primary);
  background: var(--background);
}

.pdf-modal-body {
  flex: 1;
  overflow: hidden;
  background: var(--background);
}

.pdf-modal-iframe {
  width: 100%;
  height: 100%;
  border: none;
  display: block;
}

.pdf-modal-message {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  height: 100%;
  padding: 2rem;
}

/* ── Safari Window (macOS) ────────────────────────────────── */
.safari-window {
  width: 100%;
  max-width: 1100px;
  height: 85dvh;
  background: var(--card);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  box-shadow:
    0 0 0 0.5px rgba(255, 255, 255, 0.06),
    0 22px 70px 4px rgba(0, 0, 0, 0.56),
    0 0 40px rgba(0, 191, 166, 0.06);
}

/* Tab bar */
.safari-tabbar {
  display: flex;
  align-items: center;
  height: 38px;
  padding: 0 12px;
  background: linear-gradient(180deg, rgba(58, 58, 60, 0.45) 0%, rgba(44, 44, 46, 0.55) 100%);
  border-bottom: 0.5px solid rgba(255, 255, 255, 0.06);
  flex-shrink: 0;
  gap: 12px;
}

.safari-dots {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
}

.safari-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  border: none;
  cursor: default;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  color: transparent;
  transition: color 0.15s;
}

.safari-dot--close { background: #ff5f57; }
.safari-dot--minimize { background: #febc2e; }
.safari-dot--maximize { background: #28c840; }

.safari-dot--close:hover {
  color: rgba(80, 0, 0, 0.85);
  cursor: pointer;
}

.safari-dot--minimize:hover {
  color: rgba(110, 70, 0, 0.85);
}

.safari-dot--maximize:hover {
  color: rgba(0, 70, 0, 0.85);
}

.safari-tabs {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 0;
}

.safari-tab {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 26px;
  padding: 0 16px;
  border-radius: 6px;
  max-width: 240px;
  min-width: 0;
}

.safari-tab--active {
  background: rgba(70, 70, 74, 0.6);
}

.safari-tab-title {
  font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Helvetica Neue', sans-serif;
  font-size: 0.7rem;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.85);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  text-align: center;
}

/* Toolbar */
.safari-toolbar {
  display: flex;
  align-items: center;
  height: 40px;
  padding: 0 12px;
  background: linear-gradient(180deg, rgba(44, 44, 46, 0.55) 0%, rgba(36, 36, 38, 0.6) 100%);
  border-bottom: 0.5px solid rgba(255, 255, 255, 0.06);
  gap: 10px;
  flex-shrink: 0;
}

.safari-nav-group {
  display: flex;
  align-items: center;
  gap: 2px;
  flex-shrink: 0;
}

.safari-nav-btn {
  width: 28px;
  height: 28px;
  border: none;
  background: transparent;
  color: rgba(255, 255, 255, 0.3);
  cursor: default;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 5px;
  padding: 0;
}

.safari-nav-btn:enabled {
  color: rgba(255, 255, 255, 0.65);
  cursor: pointer;
}

.safari-nav-btn:enabled:hover {
  background: rgba(255, 255, 255, 0.08);
}

.safari-url-bar {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
  background: rgba(255, 255, 255, 0.06);
  border: 0.5px solid rgba(255, 255, 255, 0.08);
  border-radius: 8px;
  padding: 0 14px;
  height: 28px;
  max-width: 520px;
  margin: 0 auto;
  min-width: 0;
}

.safari-lock-icon {
  color: rgba(255, 255, 255, 0.35);
  flex-shrink: 0;
}

.safari-url-text {
  font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Helvetica Neue', sans-serif;
  font-size: 0.72rem;
  color: rgba(255, 255, 255, 0.5);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  text-align: center;
  letter-spacing: 0.01em;
}

.safari-actions {
  display: flex;
  align-items: center;
  gap: 2px;
  flex-shrink: 0;
}

.safari-action-btn {
  width: 28px;
  height: 28px;
  border: none;
  background: transparent;
  color: rgba(255, 255, 255, 0.45);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 5px;
  padding: 0;
  text-decoration: none;
  transition: color 0.15s, background 0.15s;
}

.safari-action-btn:hover {
  color: rgba(255, 255, 255, 0.8);
  background: rgba(255, 255, 255, 0.08);
}

/* Body */
.safari-body {
  flex: 1;
  overflow: hidden;
  background: var(--background);
  position: relative;
}

/* ── Skeleton Loading ─────────────────────────────────────── */
.browser-loading {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  padding: 24px;
  gap: 12px;
  z-index: 2;
  background: var(--background);
}

.skeleton-bar {
  border-radius: 4px;
  background: var(--muted);
  animation: skeleton-pulse 1.5s ease-in-out infinite;
}

.skeleton-bar--nav {
  height: 14px;
  width: 45%;
  margin-bottom: 20px;
}

.skeleton-bar--hero {
  height: 100px;
  width: 100%;
  margin-bottom: 8px;
}

.skeleton-bar--line {
  height: 12px;
}

.browser-loading-text {
  position: absolute;
  bottom: 32px;
  left: 50%;
  transform: translateX(-50%);
  font-family: monospace;
  font-size: 0.75rem;
  color: var(--muted-foreground);
  letter-spacing: 0.15em;
  text-transform: uppercase;
}

.loading-dots::after {
  content: '';
  animation: dots 1.2s steps(4, end) infinite;
}

@keyframes dots {
  0%   { content: ''; }
  25%  { content: '.'; }
  50%  { content: '..'; }
  75%  { content: '...'; }
  100% { content: ''; }
}

@keyframes skeleton-pulse {
  0%, 100% { opacity: 0.3; }
  50%      { opacity: 0.6; }
}

/* Modal transition */
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.25s ease;
}
.modal-enter-active .pdf-modal-container,
.modal-leave-active .pdf-modal-container,
.modal-enter-active .safari-window,
.modal-leave-active .safari-window {
  transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.25s ease;
}
.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
.modal-enter-from .pdf-modal-container,
.modal-enter-from .safari-window {
  transform: scale(0.92) translateY(20px);
  opacity: 0;
}
.modal-leave-to .pdf-modal-container,
.modal-leave-to .safari-window {
  transform: scale(0.95) translateY(10px);
  opacity: 0;
}
</style>
