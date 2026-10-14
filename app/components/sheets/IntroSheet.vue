<script setup lang="ts">
import { intro } from '~~/content/profile'

const { t } = useI18n()
const tx = useText()
const localePath = useLocalePath()
const { go } = useDeck()
const avatar = mediaOf('avatar')
const jumps = [
  { id: 'sortingvisualizer', label: 'sheet.projects' },
  { id: 'yagcisons', label: 'sheet.clients' },
  { id: 'contact', label: 'sheet.contact' },
]
</script>

<template>
  <Sheet id="start" :label="t('sheet.start')" class="intro">
    <div class="hello" data-ink-safe>
      <h1 translate="no"><span>Kerimcan</span> <span>Yagci</span></h1>
      <p class="lead">{{ tx(intro.lead) }}</p>
    </div>

    <figure class="avatar">
      <div class="pic" data-ink="right bottom seal">
        <img :src="avatar.src" :width="avatar.width" :height="avatar.height" :alt="tx(intro.avatarAlt)" fetchpriority="high" />
      </div>
      <figcaption class="box why" data-ink-safe>
        <b class="label">{{ tx(intro.why.title) }}</b>
        {{ tx(intro.why.text) }}
      </figcaption>
    </figure>

    <div class="koma tone note" data-ink-safe>
      <div class="box">
        <p>{{ tx(intro.note) }}</p>
        <nav class="jump" :aria-label="t('nav.pages')">
          <a v-for="j in jumps" :key="j.id" class="btn" :href="`#${j.id}`" @click.prevent="go(j.id)">{{ t(j.label) }}</a>
          <NuxtLink class="btn" :to="localePath('was-ich-baue')">{{ t('nav.build') }}</NuxtLink>
        </nav>
      </div>
    </div>
  </Sheet>
</template>

<style scoped>
.intro {
  align-content: center;
  grid-template-columns: minmax(0, 1fr);
}

h1 {
  font-size: clamp(52px, 15vw, 132px);
  line-height: 0.92;
  letter-spacing: -0.01em;
}

h1 span {
  display: block;
}

.hello {
  display: grid;
  gap: 22px;
}

.lead {
  max-width: 32em;
  font-size: 17px;
  line-height: 1.6;
}

.avatar {
  position: relative;
  margin: 0 0 22px;
  max-width: 300px;
  order: -1;
}

.pic {
  aspect-ratio: 1;
  border: var(--border) solid var(--ink);
  background: #fff;
  overflow: hidden;
}

.pic img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  filter: var(--avatar-filter);
}

.why {
  position: absolute;
  right: -14px;
  bottom: -30px;
  max-width: 210px;
  padding: 10px 14px;
  font-size: 14px;
  line-height: 1.45;
}

.why b {
  display: block;
  margin-bottom: 4px;
  color: var(--ink);
  font-weight: 400;
}

.note {
  padding: 14px;
}

.note .box {
  display: grid;
  gap: 14px;
  padding: 16px 18px 18px;
}

.note p {
  font-size: 16px;
}

.jump {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

@media (min-width: 768px) {
  .intro {
    grid-template-columns: minmax(0, 1fr) min(32vw, 440px);
    grid-template-rows: auto auto;
    column-gap: clamp(40px, 5vw, 72px);
    row-gap: clamp(20px, 4vh, 34px);
  }

  h1 {
    font-size: clamp(56px, min(8vw, 14vh), 132px);
  }

  .hello {
    grid-column: 1;
    grid-row: 1;
    align-self: end;
  }

  .lead {
    font-size: 19px;
  }

  .avatar {
    grid-column: 2;
    grid-row: 1 / span 2;
    align-self: center;
    max-width: min(440px, 52vh);
    margin: 0;
    order: 0;
  }

  .why {
    right: auto;
    left: -34px;
    bottom: -26px;
    max-width: 250px;
    font-size: 14.5px;
  }

  .note {
    grid-column: 1;
    grid-row: 2;
    align-self: start;
    max-width: 720px;
    padding: 16px;
  }

  .note .box {
    padding: 16px 20px 18px;
  }
}
</style>
