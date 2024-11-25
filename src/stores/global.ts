import { ref, watch } from 'vue'
import { defineStore } from 'pinia'
import type { Source, SourceReference } from '@/types/Source'

export const useGlobalStore = defineStore('global', () => {
  const loading = ref(false)

  const source = ref<Source>('luchtpijp')
  const toggleSource = (newSource: Source) => (source.value = newSource)

  const reference = ref<SourceReference>('luchtpijp')
  const toggleReference = (newReference: SourceReference) =>
    (reference.value = newReference)

  watch(source, (val, old) => {
    if (val !== old) reference.value = val
  })

  return {
    loading,
    source,
    toggleSource,
    reference,
    toggleReference,
  }
})
