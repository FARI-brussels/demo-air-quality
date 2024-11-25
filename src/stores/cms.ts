import { defineStore } from 'pinia'
import { ref } from 'vue'
// import { fetchDirectus } from 'fari-directus-parser'

type Locale = 'en' | 'fr-FR' | 'nl'

export const useDataStore = defineStore('data', () => {
  const locale = ref<Locale>('en')
  const data = ref(null)
  const loading = ref(false)
  const error = ref(null)

  async function getData() {
    //implement
  }
  const setLocale = (locale: Locale) => (locale.value = locale)

  return {
    locale,
    setLocale,
    data,
    loading,
    error,
    getData,
  }
})
