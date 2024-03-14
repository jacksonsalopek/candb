<template>
  <Line :data="chartData" :options="chartOptions" />
</template>

<script setup lang="ts">
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js'

import { Line } from 'vue-chartjs';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

type Props = {
  brand1?: string,
  brand2?: string,
  model1?: string,
  model2?: string,
}

const props = defineProps<Props>();
const chartOptions = {
  responsive: true,
}
let chartData = ref({
  datasets: [
    {
      data: [],
    }
  ]
});
watch(props, async (newProps) => {
  console.log('props changed');
  if (newProps.brand1 && newProps.model1) {
    const frData = await $fetch(`/api/frequency-response?brand=${props.brand1}&model=${props.model1}`);

    const labels = frData.fr.map(item => item.frequency);
    const dataPoints = frData.fr.map(item => item.raw);

    chartData.value = {
      labels: labels, // x-axis data (Frequency)
      datasets: [{
        label: `${props.brand1} ${props.model1} FR`,
        data: dataPoints, // y-axis data (Gain)
        fill: false,
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1
      }]
    }
  }
  if (newProps.brand2 && newProps.model2) {
    const frData = await $fetch(`/api/frequency-response?brand=${props.brand2}&model=${props.model2}`);

    const labels = frData.fr.map(item => item.frequency);
    const dataPoints = frData.fr.map(item => item.raw);

    const newDataset = {
      label: `${props.brand2} ${props.model2} FR`,
      data: dataPoints, // y-axis data (Gain)
      fill: false,
      borderColor: 'rgb(192, 192, 75)',
      tension: 0.1
    };

    chartData.value = {
      ...chartData.value,
      datasets: [
        ...chartData.value.datasets,
        newDataset
      ]
    }
  }
}, { deep: true })
</script>
