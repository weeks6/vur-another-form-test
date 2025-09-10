import { useLocalStorage } from '@vueuse/core';
import { defineStore } from 'pinia';
import type { UserRecord } from '../types';

export const useRecordStore = defineStore('record', {
	state: () => {
		return {
			records: useLocalStorage<Record<string, UserRecord>>(
				'testapp.records',
				{}
			),
		};
	},
});
