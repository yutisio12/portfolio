<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()
const goAdmin = () => router.push('/admin')
</script>

<template>
  <router-view />
  <button
    @click="goAdmin"
    class="fixed bottom-6 right-6 z-50 w-10 h-10 flex items-center justify-center border border-border bg-card hover:bg-muted transition-colors cursor-pointer text-foreground"
    title="Admin Panel"
  >
    <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
      <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  </button>
</template>

<style>
html {
  scroll-behavior: smooth;
}

/* ── PDF Modal ─────────────────────────────────────────────── */
.pdf-modal-overlay {
  position: fixed;
  inset: 0;
  z-index: 9999;
  background: rgba(40, 44, 52, 0.85);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
}

:root .pdf-modal-overlay {
  background: rgba(39, 40, 34, 0.85);
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
  box-shadow: 0 0 60px rgba(97, 175, 239, 0.12), 0 0 0 1px var(--border);
}

:root .pdf-modal-container {
  box-shadow: 0 0 60px rgba(102, 217, 239, 0.12), 0 0 0 1px var(--border);
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
  border: 1px solid rgba(171, 178, 191, 0.08);
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  box-shadow:
    0 0 0 0.5px rgba(171, 178, 191, 0.06),
    0 22px 70px 4px rgba(0, 0, 0, 0.56),
    0 0 40px rgba(97, 175, 239, 0.06);
}

:root .safari-window {
  border: 1px solid rgba(248, 248, 242, 0.08);
  box-shadow:
    0 0 0 0.5px rgba(248, 248, 242, 0.06),
    0 22px 70px 4px rgba(0, 0, 0, 0.56),
    0 0 40px rgba(102, 217, 239, 0.08);
}

/* Tab bar */
.safari-tabbar {
  display: flex;
  align-items: center;
  height: 38px;
  padding: 0 12px;
  background: linear-gradient(180deg, rgba(58, 58, 60, 0.45) 0%, rgba(44, 44, 46, 0.55) 100%);
  border-bottom: 0.5px solid rgba(171, 178, 191, 0.06);
  flex-shrink: 0;
  gap: 12px;
}

:root .safari-tabbar {
  background: linear-gradient(180deg, rgba(59, 59, 59, 0.6) 0%, rgba(54, 54, 54, 0.7) 100%);
  border-bottom: 0.5px solid rgba(248, 248, 242, 0.06);
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

:root .safari-tab--active {
  background: rgba(69, 69, 69, 0.6);
}

.safari-tab-title {
  font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Helvetica Neue', sans-serif;
  font-size: 0.7rem;
  font-weight: 500;
  color: rgba(171, 178, 191, 0.85);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  text-align: center;
}

:root .safari-tab-title {
  color: rgba(248, 248, 242, 0.85);
}

/* Toolbar */
.safari-toolbar {
  display: flex;
  align-items: center;
  height: 40px;
  padding: 0 12px;
  background: linear-gradient(180deg, rgba(44, 44, 46, 0.55) 0%, rgba(36, 36, 38, 0.6) 100%);
  border-bottom: 0.5px solid rgba(171, 178, 191, 0.06);
  gap: 10px;
  flex-shrink: 0;
}

:root .safari-toolbar {
  background: linear-gradient(180deg, rgba(54, 54, 54, 0.7) 0%, rgba(46, 46, 46, 0.75) 100%);
  border-bottom: 0.5px solid rgba(248, 248, 242, 0.06);
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
  color: rgba(171, 178, 191, 0.3);
  cursor: default;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 5px;
  padding: 0;
}

.safari-nav-btn:enabled {
  color: rgba(171, 178, 191, 0.65);
  cursor: pointer;
}

.safari-nav-btn:enabled:hover {
  background: rgba(171, 178, 191, 0.08);
}

:root .safari-nav-btn {
  color: rgba(248, 248, 242, 0.3);
}

:root .safari-nav-btn:enabled {
  color: rgba(248, 248, 242, 0.65);
}

:root .safari-nav-btn:enabled:hover {
  background: rgba(248, 248, 242, 0.08);
}

.safari-url-bar {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
  background: rgba(171, 178, 191, 0.06);
  border: 0.5px solid rgba(171, 178, 191, 0.08);
  border-radius: 8px;
  padding: 0 14px;
  height: 28px;
  max-width: 520px;
  margin: 0 auto;
  min-width: 0;
}

:root .safari-url-bar {
  background: rgba(248, 248, 242, 0.06);
  border: 0.5px solid rgba(248, 248, 242, 0.08);
}

.safari-lock-icon {
  color: rgba(171, 178, 191, 0.35);
  flex-shrink: 0;
}

:root .safari-lock-icon {
  color: rgba(248, 248, 242, 0.35);
}

.safari-url-text {
  font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Helvetica Neue', sans-serif;
  font-size: 0.72rem;
  color: rgba(171, 178, 191, 0.5);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  text-align: center;
  letter-spacing: 0.01em;
}

:root .safari-url-text {
  color: rgba(248, 248, 242, 0.5);
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
  color: rgba(171, 178, 191, 0.45);
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
  color: rgba(171, 178, 191, 0.8);
  background: rgba(171, 178, 191, 0.08);
}

:root .safari-action-btn {
  color: rgba(248, 248, 242, 0.45);
}

:root .safari-action-btn:hover {
  color: rgba(248, 248, 242, 0.8);
  background: rgba(248, 248, 242, 0.08);
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
  color: var(--highlight);
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

/* ── Admin Panel ──────────────────────────────────────────── */
.admin-panel {
  min-height: 100vh;
  background: var(--background);
  color: var(--foreground);
  padding: 2rem;
  font-family: 'Inter', sans-serif;
}

.admin-panel h1 {
  font-family: 'Anton', sans-serif;
  font-size: 2rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 2rem;
}

.admin-panel label {
  display: block;
  font-size: 0.75rem;
  font-family: 'JetBrains Mono', monospace;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--muted-foreground);
  margin-bottom: 0.25rem;
}

.admin-panel input[type="text"],
.admin-panel input[type="url"],
.admin-panel input[type="number"],
.admin-panel textarea {
  width: 100%;
  padding: 0.5rem 0.75rem;
  background: var(--muted);
  border: 1px solid var(--border);
  color: var(--foreground);
  font-size: 0.875rem;
  font-family: 'JetBrains Mono', monospace;
  outline: none;
  transition: border-color 0.2s;
}

.admin-panel input:focus,
.admin-panel textarea:focus {
  border-color: var(--primary);
}

.admin-panel textarea {
  min-height: 80px;
  resize: vertical;
}

.admin-panel input[type="color"] {
  width: 48px;
  height: 48px;
  padding: 2px;
  border: 1px solid var(--border);
  background: var(--muted);
  cursor: pointer;
}

.admin-section {
  background: var(--card);
  border: 1px solid var(--border);
  padding: 1.5rem;
  margin-bottom: 1.5rem;
}

.admin-section h2 {
  font-family: 'Anton', sans-serif;
  font-size: 1.25rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--primary);
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid var(--border);
}

.admin-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1rem;
}

.admin-field {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.admin-color-row {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.admin-color-row input[type="color"] {
  flex-shrink: 0;
}

.admin-color-row input[type="text"] {
  flex: 1;
  min-width: 120px;
}

.admin-item {
  background: var(--background);
  border: 1px solid var(--border);
  padding: 1rem;
  margin-bottom: 0.75rem;
}

.admin-item-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.admin-item-header h3 {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.8rem;
  color: var(--primary);
  text-transform: uppercase;
}

.admin-btn {
  padding: 0.4rem 0.8rem;
  border: 1px solid var(--border);
  background: transparent;
  color: var(--muted-foreground);
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.7rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  cursor: pointer;
  transition: color 0.2s, border-color 0.2s, background 0.2s;
}

.admin-btn:hover {
  color: var(--primary);
  border-color: var(--primary);
}

.admin-btn--danger:hover {
  color: var(--destructive);
  border-color: var(--destructive);
}

.admin-btn--primary {
  background: var(--primary);
  color: var(--primary-foreground);
  border-color: var(--primary);
}

.admin-btn--primary:hover {
  opacity: 0.85;
}

.admin-btn-group {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.admin-save-bar {
  position: sticky;
  bottom: 0;
  background: var(--card);
  border-top: 2px solid var(--primary);
  padding: 1rem 2rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  z-index: 100;
}

.admin-save-bar .admin-btn--primary {
  font-size: 0.9rem;
  padding: 0.6rem 2rem;
}

.admin-status {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.75rem;
  color: var(--muted-foreground);
}

.admin-status--success {
  color: var(--accent);
}

.admin-status--error {
  color: var(--destructive);
}

.admin-key-input {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  gap: 1rem;
  background: var(--background);
  color: var(--foreground);
}

.admin-key-input input {
  padding: 0.75rem 1rem;
  background: var(--muted);
  border: 1px solid var(--border);
  color: var(--foreground);
  font-family: 'JetBrains Mono', monospace;
  font-size: 1rem;
  text-align: center;
  outline: none;
  min-width: 280px;
}

.admin-key-input input:focus {
  border-color: var(--primary);
}

.admin-img-preview {
  max-width: 200px;
  max-height: 120px;
  object-fit: cover;
  border: 1px solid var(--border);
  margin-top: 0.25rem;
}

.admin-tabs {
  display: flex;
  gap: 0.25rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
}

.admin-tab {
  padding: 0.5rem 1rem;
  border: 1px solid var(--border);
  background: var(--muted);
  color: var(--muted-foreground);
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  cursor: pointer;
  transition: all 0.2s;
}

.admin-tab:hover {
  color: var(--foreground);
  border-color: var(--primary);
}

.admin-tab--active {
  background: var(--primary);
  color: var(--primary-foreground);
  border-color: var(--primary);
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
