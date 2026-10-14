<script setup lang="ts">
// Copies the address; the label says so for a moment. Falls back to selecting the text.
const props = defineProps<{ email: string }>()
const { t } = useI18n()
const done = ref(false)
let timer = 0

async function copy(e: MouseEvent) {
  try {
    await navigator.clipboard.writeText(props.email)
  } catch {
    const target = (e.currentTarget as HTMLElement).parentElement?.querySelector('a')
    if (target) getSelection()?.selectAllChildren(target)
  }
  done.value = true
  clearTimeout(timer)
  timer = window.setTimeout(() => (done.value = false), 1600)
}
</script>

<template>
  <button type="button" class="btn copy" @click="copy">
    <span aria-live="polite">{{ done ? t('contact.copied') : t('contact.copy') }}</span>
  </button>
</template>

<style scoped>
.copy {
  font-size: 14px;
  padding: 9px 12px;
}
</style>
