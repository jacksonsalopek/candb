<template>
  <div>
    <div v-for="(headphone, index) in headphones" :key="index" class="mt-2 px-6 grid grid-cols-3 gap-4">
      <InputSelect :options="brands" label="Brand" v-model="headphone.brand" />
      <InputSelect :options="models[index]" label="Model" v-model="headphone.model" />
      <div class="flex items-center">
        <button @click="removeHeadphone(index)"
          class="btn btn-square btn-error w-12 rounded-tr-none rounded-br-none">-</button>
        <button @click="addHeadphone" class="btn btn-square btn-neutral w-12 rounded-tl-none rounded-bl-none">+</button>
      </div>

    </div>
    <FRGraph :headphones="headphones" :targets="targets" />
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { BRANDS_HEADPHONE } from '~/shared/constants';
import type { Target } from '~/shared/types';

const brands = ref(BRANDS_HEADPHONE);
const headphones = ref([{ brand: '', model: '' }]);
const models = ref<string[][]>([[]]);
const targets = ref<Target[]>([]);

const addHeadphone = () => {
  headphones.value.push({ brand: '', model: '' });
  models.value.push([]);
};

const removeHeadphone = (index: number) => {
  headphones.value.splice(index, 1);
  models.value.splice(index, 1);
};

const harmanOE2018Name = 'Harman over-ear 2018'
const harmanOE2018Data = await useFetch(`/api/targets?name=${harmanOE2018Name}`);

const harmanOE2018: Target = {
  name: 'Harman OE 2018',
  data: harmanOE2018Data.data.value!.fr,
};
targets.value.push(harmanOE2018);

watch(headphones.value, (newHeadphones, oldHeadphones) => {
  newHeadphones.forEach(async (headphone, index) => {
    if (headphone.brand) {
      const { data } = await useFetch(`/api/headphones?brand=${headphone.brand}`);
      if (data.value) models.value[index] = data.value.headphones.map(h => h.model);
    }
  });
}, { deep: true, immediate: true });
</script>
