<script setup lang="ts">
// One project or client site per sheet: the real artefact on the left, the text on the right.
import type { Work } from '~~/content/types'

const props = defineProps<{ item: Work }>()
const { t } = useI18n()
const tx = useText()
const shot = computed(() => (props.item.shot ? mediaOf(props.item.shot.media) : null))
const long = computed(() => props.item.name.length > 12)
// long camel-case names may break between their words, never inside one
const nameParts = computed(() => props.item.name.split(/(?<=[a-z])(?=[A-Z])/))
</script>

<template>
  <Sheet :id="item.id" :label="item.name" class="work">
    <figure class="media">
      <div v-if="item.shot && shot" class="frame shot" data-ink="left top">
        <img
          :src="shot.src"
          :srcset="srcsetOf(shot)"
          sizes="(min-width: 768px) 56vw, 100vw"
          :width="shot.width"
          :height="shot.height"
          :alt="tx(item.shot.alt)"
          loading="lazy"
        />
      </div>
      <SortingDemo v-else-if="item.demos" :demos="item.demos" />
      <div v-else-if="item.code" class="frame code" data-ink="left top">
        <pre data-scroll><code>{{ item.code.text }}</code></pre>
      </div>
      <figcaption v-if="item.shot?.caption || item.code" class="label" data-ink-safe>
        {{ item.shot?.caption ? tx(item.shot.caption) : tx(item.code!.caption) }}
      </figcaption>
    </figure>

    <div class="text" data-ink-safe>
      <p class="label">{{ tx(item.kind) }}</p>
      <h2 :class="{ long }"><template v-for="(part, i) in nameParts" :key="i"><wbr v-if="i" />{{ part }}</template></h2>
      <p class="summary">{{ tx(item.summary) }}</p>
      <div v-if="item.part || item.note" class="koma tone aside">
        <div class="box">
          <b v-if="item.part" class="label">{{ t('work.part') }}</b>
          {{ tx((item.part ?? item.note)!) }}
        </div>
      </div>
      <ul class="facts label">
        <li v-for="(fact, i) in item.facts" :key="i">{{ tx(fact) }}</li>
      </ul>
      <div class="links">
        <a v-for="link in item.links" :key="link.href" class="btn" :href="link.href" target="_blank" rel="noopener">{{ tx(link.label) }}</a>
      </div>
    </div>
  </Sheet>
</template>

<style scoped>
.work {
  align-content: center;
  grid-template-columns: minmax(0, 1fr);
}

.media {
  margin: 0;
  display: grid;
  gap: 10px;
  min-width: 0;
}

.frame {
  border: var(--border) solid var(--ink);
  overflow: hidden;
}

.shot {
  background: #0b0d14;
}

.shot img {
  width: 100%;
  height: auto;
}

.code {
  background: #101114;
  color: #e9e7e1;
}

.code pre {
  margin: 0;
  padding: 18px 20px;
  overflow: auto;
  font: 400 13.5px/1.7 var(--font-dot);
}

.text {
  display: grid;
  gap: 14px;
  align-content: start;
  min-width: 0;
}

h2 {
  font-size: clamp(40px, 11vw, 84px);
  line-height: 0.95;
  overflow-wrap: break-word;
}

h2.long {
  font-size: clamp(34px, 9vw, 64px);
}

.summary {
  max-width: 34em;
  font-size: 16.5px;
  line-height: 1.62;
}

.aside {
  padding: 12px;
  max-width: 32em;
}

.aside .box {
  padding: 10px 14px;
  font-size: 15.5px;
  line-height: 1.55;
}

.aside b {
  display: block;
  margin-bottom: 4px;
  color: var(--ink);
  font-weight: 400;
}

.facts {
  display: flex;
  flex-wrap: wrap;
  gap: 6px 20px;
  margin: 0;
  padding: 0;
  list-style: none;
}

.links {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

@media (min-width: 768px) {
  .work {
    grid-template-columns: minmax(0, 1.3fr) minmax(0, 1fr);
    column-gap: clamp(36px, 4.5vw, 64px);
    align-items: center;
  }

  .shot img {
    max-height: 58vh;
    object-fit: cover;
    object-position: top left;
  }

  .code pre {
    font-size: 14.5px;
    max-height: 56vh;
  }

  h2 {
    font-size: clamp(44px, min(5.4vw, 10vh), 84px);
  }

  h2.long {
    font-size: clamp(36px, min(4.4vw, 8vh), 66px);
  }
}
</style>
