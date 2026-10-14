<script setup lang="ts">
import type { Text } from '~~/content/types'
import { contact, profile } from '~~/content/profile'

defineProps<{ text: Text }>()
const { t } = useI18n()
const tx = useText()
</script>

<template>
  <Sheet id="contact" :label="t('sheet.contact')" class="contact">
    <div class="head" data-ink-safe>
      <h2>{{ tx(contact.title) }}</h2>
      <p>{{ tx(text) }}</p>
    </div>

    <div class="koma mail" data-ink="right bottom">
      <a :href="`mailto:${profile.email}`">{{ profile.email }}</a>
      <CopyEmail :email="profile.email" />
    </div>

    <ul class="elsewhere" data-ink-safe>
      <li><a class="btn" :href="profile.github" rel="me noopener" target="_blank">{{ t('contact.github') }}</a></li>
      <li><a class="btn" :href="profile.linkedin" rel="me noopener" target="_blank">{{ t('contact.linkedin') }}</a></li>
    </ul>

    <footer class="label" data-ink-safe>{{ tx(contact.footer) }}</footer>
  </Sheet>
</template>

<style scoped>
.contact {
  align-content: center;
  justify-items: start;
}

.head {
  display: grid;
  gap: 14px;
}

h2 {
  font-size: clamp(44px, 12vw, 96px);
  line-height: 1;
}

.head p {
  max-width: 30em;
  font-size: 17px;
}

.mail {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 14px 22px;
  padding: 18px 20px;
  max-width: 100%;
}

.mail a {
  font: 400 clamp(20px, 5.6vw, 44px) / 1.1 var(--font-display);
  text-decoration: none;
  overflow-wrap: anywhere;
}

.mail a:hover {
  text-decoration: underline;
  text-decoration-thickness: 3px;
  text-underline-offset: 6px;
}

.elsewhere {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin: 0;
  padding: 0;
  list-style: none;
}

footer {
  margin-top: 8px;
}

@media (min-width: 768px) {
  .contact {
    row-gap: clamp(18px, 3.6vh, 30px);
  }

  h2 {
    font-size: clamp(56px, min(7vw, 13vh), 110px);
  }

  .mail {
    padding: 22px 26px;
  }
}
</style>
