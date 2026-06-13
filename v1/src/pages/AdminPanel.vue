<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const SECRET_KEY = ref('')
const authenticated = ref(false)
const loading = ref(true)
const saving = ref(false)
const status = ref<{ type: string; msg: string } | null>(null)
const activeTab = ref('theme-dark')
const data = reactive<any>({})
const originalDataStr = ref('')

async function fetchData() {
  loading.value = true
  try {
    const res = await fetch(`/api/admin/data?key=${SECRET_KEY.value}`)
    if (!res.ok) {
      if (res.status === 401) {
        authenticated.value = false
        status.value = { type: 'error', msg: 'Invalid secret key' }
      }
      loading.value = false
      return
    }
    const d = await res.json()
    Object.assign(data, d)
    originalDataStr.value = JSON.stringify(d)
    authenticated.value = true
    status.value = null
  } catch {
    status.value = { type: 'error', msg: 'Failed to connect to server' }
  } finally {
    loading.value = false
  }
}

function authenticate() {
  const saved = sessionStorage.getItem('admin_key')
  if (saved) SECRET_KEY.value = saved
  if (SECRET_KEY.value) {
    sessionStorage.setItem('admin_key', SECRET_KEY.value)
    fetchData()
  }
}

onMounted(() => {
  const saved = sessionStorage.getItem('admin_key')
  if (saved) {
    SECRET_KEY.value = saved
    authenticate()
  } else {
    loading.value = false
  }
})

async function saveData() {
  saving.value = true
  status.value = { type: '', msg: 'Saving...' }
  try {
    const res = await fetch(`/api/admin/save?key=${SECRET_KEY.value}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    const result = await res.json()
    if (result.success) {
      status.value = { type: 'success', msg: `Saved! Backup: datav${result.version}.json` }
    } else {
      status.value = { type: 'error', msg: 'Save failed' }
    }
  } catch {
    status.value = { type: 'error', msg: 'Failed to save' }
  } finally {
    saving.value = false
  }
}

function goHome() {
  router.push('/')
}

function addItem(arr: any[], defaults: any) {
  arr.push({ ...defaults })
}

function removeItem(arr: any[], index: number) {
  arr.splice(index, 1)
}

function addTech(project: any) {
  if (!project.tech) project.tech = []
  project.tech.push('')
}

function removeTech(project: any, index: number) {
  project.tech.splice(index, 1)
}

function addStackItem(category: any) {
  if (!category.items) category.items = []
  category.items.push('')
}

function removeStackItem(category: any, index: number) {
  category.items.splice(index, 1)
}

function addBio() {
  if (!data.profile?.bio_paragraphs) {
    if (!data.profile) data.profile = {} as any
    data.profile.bio_paragraphs = []
  }
  data.profile.bio_paragraphs.push('')
}

function removeBio(index: number) {
  data.profile.bio_paragraphs.splice(index, 1)
}

const tabs = [
  { id: 'theme-dark', label: 'Theme Dark' },
  { id: 'theme-light', label: 'Theme Light' },
  { id: 'profile', label: 'Profile' },
  { id: 'general', label: 'General' },
  { id: 'projects', label: 'Projects' },
  { id: 'certifications', label: 'Sertifikasi' },
  { id: 'stack', label: 'Stack' },
  { id: 'experience', label: 'Experience' },
  { id: 'expertise', label: 'Expertise' },
  { id: 'contact', label: 'Contact' },
  { id: 'github', label: 'GitHub' },
]

const themeColorFields = [
  { key: 'background', label: 'Background' },
  { key: 'foreground', label: 'Foreground' },
  { key: 'primary', label: 'Primary' },
  { key: 'primary_foreground', label: 'Primary Foreground' },
  { key: 'secondary', label: 'Secondary' },
  { key: 'secondary_foreground', label: 'Secondary Foreground' },
  { key: 'accent', label: 'Accent' },
  { key: 'accent_foreground', label: 'Accent Foreground' },
  { key: 'destructive', label: 'Destructive' },
  { key: 'destructive_foreground', label: 'Destructive Foreground' },
  { key: 'muted', label: 'Muted' },
  { key: 'muted_foreground', label: 'Muted Foreground' },
  { key: 'card', label: 'Card' },
  { key: 'border', label: 'Border' },
  { key: 'warning', label: 'Warning' },
  { key: 'chart_1', label: 'Chart-1' },
  { key: 'ring', label: 'Ring' },
]
</script>

<template>
  <div class="admin-panel">
    <!-- Secret Key Input -->
    <div v-if="!authenticated && !loading" class="admin-key-input">
      <h1>Admin Panel</h1>
      <p class="text-muted-foreground text-sm mb-4">Enter secret key to access</p>
      <input
        v-model="SECRET_KEY"
        type="password"
        placeholder="Secret Key"
        @keyup.enter="authenticate"
      />
      <button class="admin-btn admin-btn--primary" @click="authenticate">Unlock</button>
      <button class="admin-btn" @click="goHome" style="margin-top: 0.5rem;">Back to Home</button>
      <p v-if="status" :class="'admin-status admin-status--' + status.type" style="margin-top: 1rem;">
        {{ status.msg }}
      </p>
    </div>

    <!-- Loading -->
    <div v-else-if="loading" class="admin-key-input">
      <p class="text-muted-foreground">Loading...</p>
    </div>

    <!-- Admin Panel -->
    <div v-else>
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
        <h1>Admin Panel</h1>
        <button class="admin-btn" @click="goHome">← Back to Home</button>
      </div>

      <!-- Tabs -->
      <div class="admin-tabs">
        <button
          v-for="tab in tabs"
          :key="tab.id"
          :class="['admin-tab', { 'admin-tab--active': activeTab === tab.id }]"
          @click="activeTab = tab.id"
        >
          {{ tab.label }}
        </button>
      </div>

      <!-- Tab: Theme Dark -->
      <div v-if="activeTab === 'theme-dark'" class="admin-section">
        <h2>Theme Dark (One Dark Pro)</h2>
        <div class="admin-grid">
          <div v-for="f in themeColorFields" :key="f.key" class="admin-field admin-color-row">
            <input type="color" v-model="data.theme_dark[f.key]" />
            <input type="text" v-model="data.theme_dark[f.key]" />
            <label>{{ f.label }}</label>
          </div>
        </div>
      </div>

      <!-- Tab: Theme Light -->
      <div v-if="activeTab === 'theme-light'" class="admin-section">
        <h2>Theme Light / White (Monokai)</h2>
        <div class="admin-grid">
          <div v-for="f in themeColorFields" :key="f.key" class="admin-field admin-color-row">
            <input type="color" v-model="data.theme_light[f.key]" />
            <input type="text" v-model="data.theme_light[f.key]" />
            <label>{{ f.label }}</label>
          </div>
        </div>
      </div>

      <!-- Tab: Profile -->
      <div v-if="activeTab === 'profile'" class="admin-section">
        <h2>Profile</h2>
        <div class="admin-grid">
          <div class="admin-field">
            <label>Name</label>
            <input type="text" v-model="data.profile.name" />
          </div>
          <div class="admin-field">
            <label>Title</label>
            <input type="text" v-model="data.profile.title" />
          </div>
          <div class="admin-field">
            <label>Years Experience</label>
            <input type="text" v-model="data.profile.years_experience" />
          </div>
          <div class="admin-field">
            <label>Bio Title</label>
            <input type="text" v-model="data.profile.bio_title" />
          </div>
        </div>
        <div style="margin-top: 1rem;">
          <label>Bio Paragraphs</label>
          <div v-for="(_, i) in data.profile.bio_paragraphs" :key="'bio-' + i" style="display: flex; gap: 0.5rem; margin-bottom: 0.5rem; align-items: flex-start;">
            <textarea v-model="data.profile.bio_paragraphs[i]" style="flex: 1;" />
            <button class="admin-btn admin-btn--danger" @click="removeBio(i)">×</button>
          </div>
          <button class="admin-btn" @click="addBio">+ Add Paragraph</button>
        </div>
      </div>

      <!-- Tab: General -->
      <div v-if="activeTab === 'general'" class="admin-section">
        <h2>General</h2>
        <div class="admin-grid">
          <div v-for="(_, key) in data.general" :key="'gen-' + key" class="admin-field">
            <label>{{ key }}</label>
            <input type="text" v-model="data.general[key]" />
          </div>
        </div>
      </div>

      <!-- Tab: Projects -->
      <div v-if="activeTab === 'projects'" class="admin-section">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
          <h2 style="border: none; padding: 0; margin: 0;">Projects</h2>
          <button class="admin-btn" @click="addItem(data.projects.items, { name: '', description: '', link: '', image: '', alt_image: '', tech: [] })">+ Add Project</button>
        </div>
        <div v-for="(proj, i) in data.projects.items" :key="'proj-' + i" class="admin-item">
          <div class="admin-item-header">
            <h3>#{{ i + 1 }} {{ proj.name || 'New Project' }}</h3>
            <button class="admin-btn admin-btn--danger" @click="removeItem(data.projects.items, i)">Delete</button>
          </div>
          <div class="admin-grid">
            <div class="admin-field">
              <label>Name</label>
              <input type="text" v-model="proj.name" />
            </div>
            <div class="admin-field">
              <label>Link</label>
              <input type="text" v-model="proj.link" />
            </div>
            <div class="admin-field">
              <label>Image URL</label>
              <input type="text" v-model="proj.image" />
              <img v-if="proj.image" :src="proj.image" class="admin-img-preview" @error="($event.target as HTMLImageElement).style.display='none'" />
            </div>
            <div class="admin-field">
              <label>Alt Image URL</label>
              <input type="text" v-model="proj.alt_image" />
              <img v-if="proj.alt_image" :src="proj.alt_image" class="admin-img-preview" @error="($event.target as HTMLImageElement).style.display='none'" />
            </div>
            <div class="admin-field" style="grid-column: 1 / -1;">
              <label>Description</label>
              <textarea v-model="proj.description" />
            </div>
            <div class="admin-field" style="grid-column: 1 / -1;">
              <label>Technologies</label>
              <div v-for="(_, ti) in proj.tech" :key="'tech-' + ti" style="display: flex; gap: 0.5rem; margin-bottom: 0.25rem;">
                <input type="text" v-model="proj.tech[ti]" style="flex: 1;" />
                <button class="admin-btn admin-btn--danger" @click="removeTech(proj, ti)">×</button>
              </div>
              <button class="admin-btn" @click="addTech(proj)">+ Add Tech</button>
            </div>
          </div>
        </div>
      </div>

      <!-- Tab: Certifications -->
      <div v-if="activeTab === 'certifications'" class="admin-section">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
          <h2 style="border: none; padding: 0; margin: 0;">Certifications</h2>
          <button class="admin-btn" @click="addItem(data.results.items, { title: '', issuer: '', date: '', credential_id: '', description: '', attachment: '' })">+ Add Certification</button>
        </div>
        <div v-for="(item, i) in data.results.items" :key="'cert-' + i" class="admin-item">
          <div class="admin-item-header">
            <h3>#{{ i + 1 }} {{ item.title || 'New' }}</h3>
            <button class="admin-btn admin-btn--danger" @click="removeItem(data.results.items, i)">Delete</button>
          </div>
          <div class="admin-grid">
            <div class="admin-field">
              <label>Title</label>
              <input type="text" v-model="item.title" />
            </div>
            <div class="admin-field">
              <label>Issuer</label>
              <input type="text" v-model="item.issuer" />
            </div>
            <div class="admin-field">
              <label>Date</label>
              <input type="text" v-model="item.date" />
            </div>
            <div class="admin-field">
              <label>Credential ID</label>
              <input type="text" v-model="item.credential_id" />
            </div>
            <div class="admin-field" style="grid-column: 1 / -1;">
              <label>Description</label>
              <textarea v-model="item.description" />
            </div>
            <div class="admin-field">
              <label>Attachment URL</label>
              <input type="text" v-model="item.attachment" />
            </div>
          </div>
        </div>
      </div>

      <!-- Tab: Stack -->
      <div v-if="activeTab === 'stack'" class="admin-section">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
          <h2 style="border: none; padding: 0; margin: 0;">Stack & Skills</h2>
          <button class="admin-btn" @click="addItem(data.stack.categories, { name: '', items: [] })">+ Add Category</button>
        </div>
        <div v-for="(cat, i) in data.stack.categories" :key="'stack-' + i" class="admin-item">
          <div class="admin-item-header">
            <h3>#{{ i + 1 }} {{ cat.name || 'New Category' }}</h3>
            <button class="admin-btn admin-btn--danger" @click="removeItem(data.stack.categories, i)">Delete</button>
          </div>
          <div class="admin-field" style="margin-bottom: 0.75rem;">
            <label>Category Name</label>
            <input type="text" v-model="cat.name" />
          </div>
          <div class="admin-field">
            <label>Items</label>
            <div v-for="(_, ti) in cat.items" :key="'si-' + ti" style="display: flex; gap: 0.5rem; margin-bottom: 0.25rem;">
              <input type="text" v-model="cat.items[ti]" style="flex: 1;" />
              <button class="admin-btn admin-btn--danger" @click="removeStackItem(cat, ti)">×</button>
            </div>
            <button class="admin-btn" @click="addStackItem(cat)">+ Add Item</button>
          </div>
        </div>
      </div>

      <!-- Tab: Experience -->
      <div v-if="activeTab === 'experience'" class="admin-section">
        <div class="admin-grid" style="margin-bottom: 1rem;">
          <div class="admin-field">
            <label>Title</label>
            <input type="text" v-model="data.experience.title" />
          </div>
          <div class="admin-field">
            <label>Subtitle</label>
            <input type="text" v-model="data.experience.subtitle" />
          </div>
        </div>
        <button class="admin-btn" style="margin-bottom: 1rem;" @click="addItem(data.experience.items, { company: '', role: '', date: '', color: '#61AFEF' })">+ Add Experience</button>
        <div v-for="(exp, i) in data.experience.items" :key="'exp-' + i" class="admin-item">
          <div class="admin-item-header">
            <h3>#{{ i + 1 }} {{ exp.company || 'New' }}</h3>
            <button class="admin-btn admin-btn--danger" @click="removeItem(data.experience.items, i)">Delete</button>
          </div>
          <div class="admin-grid">
            <div class="admin-field">
              <label>Company</label>
              <input type="text" v-model="exp.company" />
            </div>
            <div class="admin-field">
              <label>Role</label>
              <input type="text" v-model="exp.role" />
            </div>
            <div class="admin-field">
              <label>Date</label>
              <input type="text" v-model="exp.date" />
            </div>
            <div class="admin-field admin-color-row">
              <input type="color" v-model="exp.color" />
              <input type="text" v-model="exp.color" style="flex: 1;" />
              <label>Color</label>
            </div>
          </div>
        </div>
      </div>

      <!-- Tab: Expertise -->
      <div v-if="activeTab === 'expertise'" class="admin-section">
        <button class="admin-btn" style="margin-bottom: 1rem;" @click="addItem(data.expertise.items, { area: '', level: 80, description: '', technologies: [] })">+ Add Expertise</button>
        <div v-for="(exp, i) in data.expertise.items" :key="'exp-' + i" class="admin-item">
          <div class="admin-item-header">
            <h3>#{{ i + 1 }} {{ exp.area || 'New' }}</h3>
            <button class="admin-btn admin-btn--danger" @click="removeItem(data.expertise.items, i)">Delete</button>
          </div>
          <div class="admin-grid">
            <div class="admin-field">
              <label>Area</label>
              <input type="text" v-model="exp.area" />
            </div>
            <div class="admin-field">
              <label>Level: {{ exp.level }}%</label>
              <input type="range" min="0" max="100" v-model.number="exp.level" style="width: 100%;" />
            </div>
            <div class="admin-field" style="grid-column: 1 / -1;">
              <label>Description</label>
              <textarea v-model="exp.description" />
            </div>
            <div class="admin-field" style="grid-column: 1 / -1;">
              <label>Technologies</label>
              <div v-for="(_, ti) in exp.technologies" :key="'t-' + i + '-' + ti" style="display: flex; gap: 0.5rem; margin-bottom: 0.25rem;">
                <input type="text" v-model="exp.technologies[ti]" style="flex: 1;" />
                <button class="admin-btn admin-btn--danger" @click="exp.technologies.splice(ti, 1)">×</button>
              </div>
              <button class="admin-btn" @click="exp.technologies.push('')">+ Add Technology</button>
            </div>
          </div>
        </div>
      </div>

      <!-- Tab: Contact -->
      <div v-if="activeTab === 'contact'" class="admin-section">
        <h2>Contact</h2>
        <div class="admin-grid">
          <div class="admin-field">
            <label>Title</label>
            <input type="text" v-model="data.contact.title" />
          </div>
          <div class="admin-field">
            <label>Email</label>
            <input type="text" v-model="data.contact.email" />
          </div>
          <div class="admin-field">
            <label>Email Label</label>
            <input type="text" v-model="data.contact.email_label" />
          </div>
          <div class="admin-field">
            <label>GitHub</label>
            <input type="text" v-model="data.contact.github" />
          </div>
          <div class="admin-field">
            <label>GitHub Label</label>
            <input type="text" v-model="data.contact.github_label" />
          </div>
          <div class="admin-field">
            <label>LinkedIn</label>
            <input type="text" v-model="data.contact.linkedin" />
          </div>
          <div class="admin-field">
            <label>LinkedIn Label</label>
            <input type="text" v-model="data.contact.linkedin_label" />
          </div>
        </div>
      </div>

      <!-- Tab: GitHub -->
      <div v-if="activeTab === 'github'" class="admin-section">
        <h2>GitHub Calendar</h2>
        <div class="admin-grid">
          <div class="admin-field">
            <label>Title</label>
            <input type="text" v-model="data.github_calendar.title" />
          </div>
          <div class="admin-field">
            <label>Username</label>
            <input type="text" v-model="data.github_calendar.username" />
          </div>
        </div>
      </div>

      <!-- Save Bar -->
      <div class="admin-save-bar">
        <div>
          <button class="admin-btn admin-btn--primary" @click="saveData" :disabled="saving">
            {{ saving ? 'Saving...' : 'Save Changes' }}
          </button>
          <button class="admin-btn" @click="goHome" style="margin-left: 0.5rem;">Back to Home</button>
        </div>
        <p v-if="status" :class="'admin-status admin-status--' + status.type">
          {{ status.msg }}
        </p>
      </div>
    </div>
  </div>
</template>
