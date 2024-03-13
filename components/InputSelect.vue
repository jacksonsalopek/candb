<template>
  <div class="form-control">
    <div class="input-group">
      <label class="input input-bordered flex items-center gap-2">
        {{ label }}:
        <input :id="'input-select-' + label" type="text" v-model="selectedOption" @input="onInput" @click="onClick"
          @blur="onBlur" placeholder="Search..." class="grow" />
      </label>
    </div>
    <ul ref="resultsList"
      class="absolute mt-12 w-52 bg-white border border-gray-200 rounded-md shadow-md hidden max-h-64 overflow-scroll">
      <li v-for="(option, index) in filteredOptions" :key="option" @click="selectOption(option)"
        class="px-4 py-2 cursor-pointer hover:bg-gray-100">
        {{ option }}
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import { ref, computed, defineComponent, watch } from 'vue';

export default defineComponent({
  name: 'InputSelect',
  props: {
    options: {
      type: Array<string>,
      required: true,
    },
    modelValue: {
      type: String,
      default: '',
    },
    label: {
      type: String,
      default: '',
    },
  },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    const selectedOption = ref(props.modelValue);
    const isFocused = ref(false);
    const resultsList = ref(null);

    const filteredOptions = computed(() => {
      if (!selectedOption.value) {
        return props.options;
      }
      const searchTerm = selectedOption.value.toLowerCase();
      return props.options.filter((option) =>
        option.toLowerCase().includes(searchTerm)
      );
    });

    function onInput() {
      emit('update:modelValue', selectedOption.value);
    }

    function onClick() {
      isFocused.value = true;
      resultsList.value.classList.remove('hidden');
    }

    function onBlur(event: FocusEvent) {
      if (event.target.id === 'input-select-' + props.label) {
        return;
      }
      isFocused.value = false;
      resultsList.value.classList.add('hidden');
    }

    function selectOption(option: string) {
      selectedOption.value = option;
      emit('update:modelValue', option);
      resultsList.value.classList.add('hidden');
    }

    // Ensure selectedOption is reactive to external modelValue changes
    watch(() => props.modelValue, (newValue) => {
      selectedOption.value = newValue;
    });

    return {
      selectedOption,
      isFocused,
      resultsList,
      filteredOptions,
      onInput,
      onClick,
      onBlur,
      selectOption,
    };
  },
});
</script>
