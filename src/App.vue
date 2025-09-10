<script setup lang="ts">
import RecordForm from './components/RecordForm.vue';
import { useRecordStore } from './stores/recordStore';
import type { UserRecord } from './types';

const recordStore = useRecordStore()

function addRecord() {
  let newId = 1
  const keys = Object.keys(recordStore.records || {})

  if (keys.length) {
    const oldMax = Math.max(...keys.map(Number))
    newId = oldMax !== undefined ? oldMax + 1 : 1
  }

  recordStore.records[newId] = {
    type: 'local'
  } as UserRecord
}
</script>

<template>
  <div class="flex flex-col gap-4 min-h-[100vh] p-4">
    <div class="flex items-center gap-4">
      <h2>Учетные записи</h2>
      <Button
        icon="pi pi-plus"
        aria-label="Добавить запись"
        size="small"
        @click="addRecord"
      />
    </div>

    <Card role="region">
      <template #content>
        <div class="flex items-center gap-2">
          <i
            class="pi pi-question-circle"
            style="font-size: 16px"
          />
          <span>
            Для указания нескольких меток для одной пары логин/пароль используйте разделитель <strong>;</strong>
          </span>
        </div>
      </template>
    </Card>

    <template v-if="recordStore.hasRecords">
      <div class="grid grid-cols-[2fr_1fr_2fr_2fr_40px] gap-2 text-gray-500 dark:text-gray-400">
        <span>
          Метки
        </span>
        <span>
          Тип записи
        </span>
        <span>
          Логин
        </span>
        <span>
          Пароль
        </span>
        <span>
        </span>
      </div>

      <RecordForm
        v-for="_, id in recordStore.records"
        :record-id="id"
        :key="id"
      />
    </template>
    <template v-else>
      <div class="flex justify-center items-center text-gray-500 dark:text-gray-400 flex-col gap-2 text-4xl grow">
        <i
          class="pi pi-bullseye "
          style="font-size: 2rem"
        ></i>
        <h1 class="">Нет учетных записей</h1>
      </div>
    </template>
  </div>
</template>
