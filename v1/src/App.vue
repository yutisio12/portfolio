<script setup lang="ts">
import { ref, onMounted, computed, nextTick } from 'vue'
import ParticleBackground from './components/ParticleBackground.vue'

const data = ref<any>(null)
const loading = ref(true)
const totalContributions = ref<string | null>(null)

onMounted(async () => {
  try {
    const res = await fetch('/data.json')
    data.value = await res.json()
    
  } catch (err) {
    console.error('Failed to load data', err)
  } finally {
    loading.value = false
    
    await nextTick()
    if (data.value?.github_calendar?.username) {
       const u = data.value.github_calendar.username;
       try {
         const html = await (await fetch(`https://corsproxy.io/?https://github.com/${u}`)).text()
         const match = html.match(/(\d{1,3}(,\d{3})*)\s+contributions\s+in\s+the\s+last/i)
         if (match) {
           totalContributions.value = match[1]
         }
       } catch (err) {
         console.error('Failed to scrape github stats', err)
       }
    }
  }
})

const customStyles = computed(() => {
  if (!data.value?.theme) return {}
  const t = data.value.theme
  return {
    '--background': t.background,
    '--foreground': t.foreground,
    '--primary': t.primary,
    '--primary-foreground': t.primary_foreground,
    '--muted': t.muted,
    '--muted-foreground': t.muted_foreground,
    '--card': t.card,
    '--border': t.border,
  }
})

const fallbackImg = computed(() => {
  return data.value?.general?.fallback_image || 'https://placehold.co/600x400?text=404+Not+Found'
})

const handleImageError = (e: Event) => {
  const target = e.target as HTMLImageElement
  target.src = fallbackImg.value
}

const getTechIconUrl = (name: string) => {
  const n = name.toLowerCase().replace(/[^a-z0-9]/g, '');
  const map: Record<string, string> = {
    'vue3': 'vuejs',
    'vue': 'vuejs',
    'tailwind': 'tailwindcss',
    'tailwindcss': 'tailwindcss',
    'js': 'javascript',
    'ts': 'typescript',
    'node': 'nodejs',
    'react': 'react',
    'css': 'css3',
    'html': 'html5',
    'python': 'python',
  };
  const mapped = map[n] || n;
  return `https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/${mapped}/${mapped}-original.svg`;
}
</script>

<template>
  <div :style="customStyles" class="min-h-screen bg-background text-foreground font-sans selection:bg-primary selection:text-foreground vignette-glow relative overflow-hidden">
    <ParticleBackground />

    <div v-if="loading" class="flex items-center justify-center min-h-screen">
      <div class="animate-pulse text-muted-foreground font-mono-accent text-sm tracking-widest uppercase">Loading...</div>
    </div>
    
    <main v-else class="relative z-10">
      <!-- HERO -->
      <section class="min-h-[100dvh] flex flex-col items-center justify-center relative px-6">
        <div v-motion-fade-visible-once class="relative inline-flex items-center justify-center w-full max-w-[95vw] mx-auto overflow-hidden sm:overflow-visible">
          <h1 class="text-[clamp(5.5rem,18vw,28rem)] leading-none font-heading text-transparent uppercase text-stroke-1 sm:text-stroke-2 z-10 w-full text-center whitespace-nowrap">
            {{ data.profile.name }}
          </h1>
          <div class="absolute left-0 right-0 top-1/2 h-[2px] bg-primary -translate-y-1/2 w-full sm:w-[120%] sm:-ml-[10%] z-20 rotate-12"
           style="background-color: #F97316;"
          ></div>
        </div>
        
        <p v-motion-fade-visible-once :delay="200" class="mt-8 text-primary font-mono-accent text-sm sm:text-xl md:text-3xl tracking-[0.2em] uppercase text-center relative z-20 whitespace-nowrap">
          {{ data.profile.title }}
        </p>

        <!-- Experience Info -->
        <div v-motion-fade-visible-once :delay="400" class="absolute bottom-16 w-full flex justify-center">
           <div class="bg-primary text-background font-mono-accent font-bold px-4 py-2 text-xs sm:text-sm uppercase flex items-center gap-3">
             <span class="w-2 h-2 rounded-full bg-background animate-pulse"></span>
             {{ data.profile.years_experience }} {{ data.general.experience_label }}
           </div>
        </div>
      </section>

      <!-- SECTIONS CONTAINER -->
      <div class="max-w-4xl mx-auto px-6 py-24 space-y-48">
        
        <!-- ABOUT -->
        <section class="space-y-12" v-if="data.profile.bio_title">
          <h2 v-motion-slide-visible-once-bottom class="text-sm font-mono-accent text-muted-foreground tracking-widest uppercase">{{ data.general.section_01 }} {{ data.profile.bio_title }}</h2>
          <div class="space-y-8 text-xl md:text-2xl text-foreground opacity-90 leading-relaxed font-light">
            <p v-for="(p, i) in data.profile.bio_paragraphs" :key="i" v-motion-slide-visible-once-bottom :delay="Number(i) * 100">{{ p }}</p>
          </div>
        </section>

        <!-- PROJECTS -->
        <section class="space-y-12" v-if="data.projects">
          <h2 v-motion-slide-visible-once-bottom class="text-sm font-mono-accent text-muted-foreground tracking-widest uppercase">{{ data.general.section_02 }} {{ data.projects.title }}</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <a v-for="(proj, i) in data.projects.items" :key="'proj-'+i" :href="proj.link" target="_blank" v-motion-slide-visible-once-bottom :delay="Number(i) * 100" class="block bg-card hover:bg-muted border border-border transition-all group relative overflow-hidden flex flex-col h-full">
              <div class="w-full h-48 bg-muted border-b border-border overflow-hidden">
                <img :src="proj.image || fallbackImg" @error="handleImageError" class="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity" alt="Project Thumbnail" />
              </div>
              <div class="p-8 flex-1 flex flex-col">
                <h3 class="font-heading text-3xl text-foreground mb-4 group-hover:text-primary transition-colors uppercase">{{ proj.name }}</h3>
                <p class="text-base text-muted-foreground font-light mb-8">{{ proj.description }}</p>
                <div class="flex flex-wrap gap-2 mt-auto">
                  <span v-for="t in proj.tech" :key="t" class="px-3 py-1 bg-background border border-border text-xs font-mono-accent text-muted-foreground uppercase">{{ t }}</span>
                </div>
              </div>
            </a>
          </div>
        </section>

        <!-- RESULTS -->
        <section class="space-y-12" v-if="data.results">
          <h2 v-motion-slide-visible-once-bottom class="text-sm font-mono-accent text-muted-foreground tracking-widest uppercase">{{ data.general.section_03 }} {{ data.results.title }}</h2>
          <div class="flex flex-col gap-6">
            <div v-for="(item, i) in data.results.items" :key="i" v-motion-slide-visible-once-bottom :delay="Number(i) * 100" class="p-8 md:p-12 bg-card hover:bg-muted transition-colors group relative border border-border">
              <div class="absolute top-8 right-8 w-3 h-3 bg-primary opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <h3 class="font-heading text-4xl md:text-5xl text-foreground mb-4 group-hover:text-primary transition-colors tracking-wide uppercase">{{ item.title }}</h3>
              <p class="text-lg text-muted-foreground font-light">{{ item.description }}</p>
            </div>
          </div>
        </section>

        <!-- TESTIMONIALS -->
        <section class="space-y-12" v-if="data.testimonials">
          <h2 v-motion-slide-visible-once-bottom class="text-sm font-mono-accent text-muted-foreground tracking-widest uppercase">{{ data.general.section_04 }} {{ data.testimonials.title }}</h2>
          <div class="space-y-16">
            <div v-for="(t, i) in data.testimonials.items" :key="i" v-motion-slide-visible-once-bottom :delay="Number(i) * 100" class="pl-8 md:pl-12 border-l-4 border-primary space-y-8">
              <p class="text-2xl md:text-3xl text-foreground font-light italic leading-relaxed">"{{ t.text }}"</p>
              <div class="flex items-center gap-6">
                <div class="w-16 h-16 rounded-full bg-muted border border-border overflow-hidden flex items-center justify-center text-muted-foreground font-heading text-xl relative">
                  <img v-if="t.avatar" :src="t.avatar" @error="(e) => (e.target as HTMLImageElement).style.opacity = '0'" class="w-full h-full object-cover grayscale absolute inset-0 z-10 transition-opacity" />
                  <span class="z-0">{{ t.author.substring(0, 2).toUpperCase() }}</span>
                </div>
                <div>
                  <p class="font-bold text-foreground uppercase tracking-wide">{{ t.author }}</p>
                  <p class="text-primary font-mono-accent text-sm mt-1">{{ t.role }}</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- STACK -->
        <section class="space-y-12 relative py-12" v-if="data.stack">
          <div class="absolute right-[-1.5rem] sm:-right-6 top-0 bottom-0 w-2 sm:w-3 bg-primary"></div>
          
          <div class="space-y-2 pr-12">
            <h2 v-motion-slide-visible-once-bottom class="text-xs sm:text-sm font-mono-accent text-primary tracking-widest uppercase">TECHNOLOGIES</h2>
            <h3 v-motion-slide-visible-once-bottom class="text-5xl md:text-7xl lg:text-8xl font-heading uppercase text-foreground tracking-wide">{{ data.stack.title }}</h3>
          </div>

          <div class="space-y-16 mt-16 pr-6 sm:pr-12">
            <div v-for="(cat, i) in data.stack.categories" :key="i" v-motion-slide-visible-once-bottom :delay="Number(i) * 100" class="space-y-8 pb-12 border-b border-border last:border-0 relative">
              <h4 class="text-3xl sm:text-4xl md:text-5xl font-heading text-primary uppercase tracking-wide">{{ cat.name }}</h4>
              <div class="flex flex-wrap items-center gap-x-8 sm:gap-x-12 gap-y-6 sm:gap-y-8">
                <div v-for="item in cat.items" :key="item" class="flex items-center gap-3 sm:gap-4 group cursor-pointer">
                  <div class="w-8 h-8 sm:w-10 sm:h-10 relative flex items-center justify-center bg-background border border-border group-hover:border-primary transition-colors">
                    <span class="text-muted-foreground group-hover:text-primary font-heading text-xs sm:text-sm font-bold absolute z-0">{{ item.substring(0, 2).toUpperCase() }}</span>
                    <img 
                      :src="getTechIconUrl(item)" 
                      @error="(e) => (e.target as HTMLImageElement).style.opacity = '0'"
                      class="w-5 h-5 sm:w-7 sm:h-7 object-contain z-10 relative bg-background"
                      :title="item"
                    />
                  </div>
                  <span class="text-xs sm:text-sm font-mono-accent text-muted-foreground group-hover:text-primary uppercase transition-colors">{{ item }}</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- EXPERIENCE -->
        <section class="space-y-16" v-if="data.experience">
          <div class="space-y-2">
            <h2 v-motion-slide-visible-once-bottom class="text-sm font-mono-accent text-primary tracking-widest uppercase">{{ data.experience.subtitle || data.general.section_05 }}</h2>
            <h3 v-motion-slide-visible-once-bottom class="text-5xl md:text-7xl lg:text-8xl font-heading uppercase text-foreground tracking-wide">{{ data.experience.title }}</h3>
          </div>
          
          <div class="relative pl-8 sm:pl-12 space-y-16">
            <!-- Vertical Timeline Line -->
            <div class="absolute left-[3px] sm:left-[5px] top-3 bottom-0 w-[1px] bg-border opacity-50"></div>
            
            <div v-for="(exp, i) in data.experience.items" :key="i" v-motion-slide-visible-once-bottom :delay="Number(i) * 100" class="relative">
              <!-- Timeline Node -->
              <div class="absolute -left-[30px] sm:-left-[45px] top-1.5 w-2 h-2 sm:w-2.5 sm:h-2.5" :style="{ backgroundColor: exp.color || 'var(--primary)' }"></div>
              
              <div class="space-y-2">
                <p class="text-sm sm:text-base font-mono-accent text-muted-foreground">{{ exp.date }}</p>
                <h3 class="text-4xl sm:text-5xl md:text-6xl font-heading text-foreground uppercase tracking-wide">{{ exp.company }}</h3>
                <p class="font-mono-accent text-sm sm:text-base" :style="{ color: exp.color || 'var(--primary)' }">{{ exp.role }}</p>
              </div>
            </div>
          </div>
        </section>

        <!-- GITHUB CALENDAR -->
        <section class="space-y-12" v-if="data.github_calendar">
          <h2 v-motion-slide-visible-once-bottom class="text-sm font-mono-accent text-muted-foreground tracking-widest uppercase">{{ data.general.section_06 }} {{ data.github_calendar.title }}</h2>
          <div v-motion-slide-visible-once-bottom class="border border-border p-6 md:p-12 bg-card hover:bg-muted transition-colors relative overflow-hidden group space-y-8 flex flex-col">
            <div class="absolute top-8 right-8 w-3 h-3 bg-primary opacity-0 group-hover:opacity-100 transition-opacity"></div>
            
            <div class="flex flex-col md:flex-row md:items-end justify-between gap-6 relative z-10 w-full">
              <div>
                <p class="text-muted-foreground font-mono-accent text-xs sm:text-sm tracking-widest uppercase mb-2">Contributions in the last year</p>
                <h3 class="text-4xl sm:text-5xl md:text-7xl font-heading text-foreground tracking-wide">
                  {{ totalContributions !== null ? totalContributions : '...' }} <span class="text-2xl sm:text-3xl md:text-5xl text-primary">TOTAL</span>
                </h3>
              </div>
              <a :href="'https://github.com/' + data.github_calendar.username" target="_blank" class="px-6 py-3 border border-border text-xs font-mono-accent text-muted-foreground hover:text-primary hover:border-primary transition-colors uppercase whitespace-nowrap">
                View Profile
              </a>
            </div>

            <div class="w-full overflow-x-auto overflow-y-hidden pt-8 border-t border-border mt-8">
              <img :src="`https://ghchart.rshah.org/${data.theme && data.theme.primary ? data.theme.primary.replace('#', '') : 'F97316'}/${data.github_calendar.username}`" alt="GitHub Contributions Calendar" class="min-w-[700px] w-full h-auto opacity-80 group-hover:opacity-100 transition-opacity" />
            </div>
          </div>
        </section>

        <!-- CONTACT -->
        <section class="pt-24 pb-48 text-center space-y-12" v-if="data.contact">
          <h2 v-motion-slide-visible-once-bottom class="text-4xl sm:text-5xl md:text-7xl font-heading uppercase text-foreground tracking-wide">{{ data.contact.title }}</h2>
          <div v-motion-slide-visible-once-bottom :delay="200" class="flex flex-col sm:flex-row items-center justify-center gap-6">
            <a :href="'mailto:' + data.contact.email" class="w-full sm:w-auto px-8 sm:px-12 py-6 bg-primary text-primary-foreground font-mono-accent font-bold tracking-widest uppercase hover:opacity-90 transition-colors">
              {{ data.contact.email_label }}
            </a>
            <a :href="data.contact.github" target="_blank" rel="noopener noreferrer" class="w-full sm:w-auto px-8 sm:px-12 py-6 border border-border text-foreground font-mono-accent font-bold tracking-widest uppercase hover:border-primary hover:text-primary transition-colors">
              {{ data.contact.github_label }}
            </a>
          </div>
        </section>
      </div>
    </main>
  </div>
</template>

<style>
html {
  scroll-behavior: smooth;
  color-scheme: dark;
}
</style>
