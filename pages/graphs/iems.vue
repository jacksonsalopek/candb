<template>
  <div>
    <div v-for="(headphone, index) in iems" :key="index" class="mt-2 px-6 grid grid-cols-3 gap-4">
      <InputSelect :options="brands" label="Brand" v-model="headphone.brand" />
      <InputSelect :options="models[index]" label="Model" v-model="headphone.model" />
      <div class="flex items-center">
        <button @click="removeIEM(index)"
          class="btn btn-square btn-error w-12 rounded-tr-none rounded-br-none">-</button>
        <button @click="addIEM" class="btn btn-square btn-neutral w-12 rounded-tl-none rounded-bl-none">+</button>
      </div>

    </div>
    <FRGraph :headphones="iems" :targets="targets" />
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { BRANDS_IEM } from '~/shared/constants';
import type { Target } from '~/shared/types';

const brands = ref(BRANDS_IEM);
const iems = ref([{ brand: '', model: '' }]);
const models = ref<string[][]>([[]]);
const targets = ref<Target[]>([]);

const addIEM = () => {
  iems.value.push({ brand: '', model: '' });
  models.value.push([]);
};

const removeIEM = (index: number) => {
  iems.value.splice(index, 1);
  models.value.splice(index, 1);
};

const harmanIE2019Name = 'Harman in-ear 2019'
const harmanIE2019Data = await useFetch(`/api/targets?name=${harmanIE2019Name}`);

const harmanIE2019: Target = {
  name: 'Harman IE 2019',
  data: harmanIE2019Data.data.value!.fr,
};
targets.value.push(harmanIE2019);

watch(iems.value, (newIEMs, oldIEMs) => {
  newIEMs.forEach(async (iem, index) => {
    if (iem.brand) {
      const { data } = await useFetch(`/api/iems?brand=${iem.brand}`);
      if (data.value) models.value[index] = data.value.iems.map(i => i.model);
    }
  });
}, { deep: true, immediate: true });
</script>
