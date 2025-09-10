<template>
    <Form
        v-slot="$form"
        :resolver="resolver"
        :initialValues="record"
        class="grid grid-cols-[2fr_1fr_2fr_2fr_40px] gap-2"
        @submit="onFormSubmit"
    >
        <InputText
            name="tags"
            fluid
            @blur="submitForm"
        />
        <Select
            name="type"
            :options="recordTypes"
            option-label="label"
            option-value="value"
            fluid
            @change="submitForm"
        />
        <InputText
            name="login"
            type="text"
            :class="{
                'col-span-2': $form.type?.value === 'ldap'
            }"
            autocomplete="off"
            @blur="submitForm"
        />
        <Password
            v-if="$form.type?.value !== 'ldap'"
            name="password"
            :feedback="false"
            toggle-mask
            fluid
            :input-props="{
                autocomplete: 'new-password'
            }"
            @blur="submitForm"
        />

        <!-- hacky way to submit the form because the ui lib doesnt provide an adequate lmao api -->
        <button
            ref="submitButtonRef"
            type="submit"
            style="display:none"
        ></button>
    </Form>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { useRecordStore } from '../stores/recordStore';
import { zodResolver } from '@primevue/forms/resolvers/zod';
import z from 'zod';
import type { UserRecordType } from '../types';

const props = defineProps<{
    recordId: string
}>()

const submitButtonRef = ref<HTMLButtonElement>()

function submitForm() {
    submitButtonRef.value?.click()
}

const recordStore = useRecordStore()

const recordTypes: { label: string, value: UserRecordType }[] = [
    { label: 'Локальная', value: 'local' },
    { label: 'LDAP', value: 'ldap' }
]

const record = computed({
    get() {
        return {
            ...recordStore.records[props.recordId],
            tags: displayString(recordStore.records[props.recordId].tags)
        }
    },
    set(obj) {
        recordStore.records[props.recordId] = {
            ...obj,
            tags: parseArray(obj.tags)
        }
    }
})

const resolver = ref(zodResolver(
    z.object({
        tags: z.string().min(1),
        type: z.string().optional(),
        login: z.string().min(1, "login is required"),
        password: z.string().optional()
    }).superRefine((data, ctx) => {
        console.log({ data });

        if (data.type === 'local' && !data.password) {
            ctx.addIssue({
                code: 'custom',
                path: ['password'],
                message: 'Password is required when type is "local"'
            })
        }
    })
));

function displayString(arr?: string | { text: string }[]) {
    if (typeof arr === 'string') {
        arr = [{ text: arr }]
    }

    return (arr || []).map(s => s.text).join('; ');
}

function parseArray(str: string) {
    return str
        .split(';')
        .filter(Boolean)
        .map(s => ({ text: s.trim() }));
}

function onFormSubmit(args: {
    valid: boolean, values: {
        tags: string;
        type: UserRecordType;
        login: string;
        password: string | null;
    }
}) {
    console.log({ args });

    if (args.valid) {
        record.value = {
            ...args.values,
            password: args.values.type === 'ldap' ? null : args.values.password
        }
    }
}
</script>

<style></style>