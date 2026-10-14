<script setup lang="ts">
import { profile, record } from '~~/content/profile'

const { t } = useI18n()
const tx = useText()
</script>

<template>
  <Sheet id="record" :label="t('sheet.record')" class="record">
    <h2 data-ink-safe>{{ tx(record.title) }}</h2>

    <ol class="stations">
      <li v-for="(s, i) in record.stations" :key="s.what" class="koma station" :data-ink="i === 0 ? 'right top' : undefined">
        <p class="label">{{ tx(s.when) }}</p>
        <h3>{{ s.what }}</h3>
        <p>{{ tx(s.text) }}</p>
      </li>
    </ol>

    <dl class="skills" data-ink-safe>
      <div>
        <dt class="label">{{ tx(record.languagesLabel) }}</dt>
        <dd>{{ profile.languages.join(', ') }}</dd>
      </div>
      <div>
        <dt class="label">{{ tx(record.toolsLabel) }}</dt>
        <dd>{{ profile.tools.join(', ') }}</dd>
      </div>
    </dl>

    <div class="koma tone aside" data-ink-safe>
      <div class="box">
        <p>{{ tx(record.private) }}</p>
        <p>{{ tx(record.offline) }}</p>
      </div>
    </div>
  </Sheet>
</template>

<style scoped>
.record {
  align-content: center;
  grid-template-columns: minmax(0, 1fr);
}

h2 {
  font-size: clamp(40px, 11vw, 76px);
  line-height: 1;
}

.stations {
  display: grid;
  gap: 14px;
  margin: 0;
  padding: 0;
  list-style: none;
}

.station {
  display: grid;
  gap: 8px;
  padding: 18px 20px 20px;
}

h3 {
  font-size: 28px;
  line-height: 1.1;
}

.station > p:last-child {
  font-size: 16px;
  line-height: 1.55;
}

.skills {
  display: grid;
  gap: 14px;
  margin: 0;
}

.skills dd {
  margin: 4px 0 0;
  font-size: 17px;
}

.aside {
  padding: 12px;
}

.aside .box {
  display: grid;
  gap: 8px;
  padding: 12px 16px;
  font-size: 15.5px;
  line-height: 1.55;
}

@media (min-width: 768px) {
  .record {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    grid-template-rows: auto auto auto;
    column-gap: clamp(28px, 4vw, 56px);
    row-gap: clamp(18px, 3.4vh, 30px);
  }

  h2 {
    grid-column: 1 / -1;
    font-size: clamp(44px, min(5vw, 9vh), 76px);
  }

  .stations {
    grid-column: 1;
    grid-row: 2 / span 2;
    align-self: start;
  }

  .skills {
    grid-column: 2;
    grid-row: 2;
  }

  .aside {
    grid-column: 2;
    grid-row: 3;
    align-self: start;
  }
}
</style>
