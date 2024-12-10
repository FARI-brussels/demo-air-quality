import { defineStore } from 'pinia'
import { ref } from 'vue'
import { fetchDirectus } from 'fari-directus-parser'

type Locale = 'en' | 'fr-FR' | 'nl'
const expair = {
  en: `The ExpAIR data, collected through the citizen science project by BRAL in 2023, which includes NO2 measurements, are compared with the official measurements from Irceline, gathered in the same year. You can compare both datasets against various standards: the current European regulations, the future ones expected in 2025, and the World Health Organization standard`,
  fr: `Les données d'ExpAIR, collectées en 2023 dans le cadre du projet de science citoyenne de BRAL, qui se concentre sur la mesure des niveaux de NO2 dans l'air, sont comparées aux mesures officielles d'Irceline, également collectées la même année. Vous pouvez comparer les deux ensembles de données avec différentes normes : la réglementation européenne actuelle, les futures normes européennes qui devraient être introduites en 2025, et les directives de l'Organisation mondiale de la santé.`,
  nl: `De ExpAIR data, verzameld in 2023 via het citizen science project van BRAL, dat zich richt op het meten van NO2-niveaus in de lucht, worden vergeleken met de officiële metingen van Irceline, die ook in datzelfde jaar verzameld zijn. Je kan beide datasets vergelijken met verschillende normen: de huidige Europese regelgeving, de toekomstige Europese normen die naar verwachting in 2025 ingevoerd zullen worden, en de richtlijnen van de World Health Organization.`,
}

const curieusenair = {
  en: `The CurieuzenAir data, collected through the citizen science project by BRAL between September 25 and October 23, 2021, with participation from 3,000 Brussels residents measuring NO2 levels, are compared with the official measurements from Irceline, gathered in the same month. You can compare both datasets against various standards: the current European regulations, the future ones expected in 2025, and the World Health Organization standard.`,
  fr: `Entre le 25 septembre et le 23 octobre 2021, 3 000 Bruxellois ont participé à CurieuzenAir, un projet de science citoyenne de BRAL où les niveaux de NO2 ont été mesurés. Les données collectées sont ici comparées aux mesures officielles d'Irceline, qui ont été recueillies durant la même période. Vous pouvez comparer les deux ensembles de données selon différentes normes : la réglementation européenne actuelle, les futures normes qui devraient être introduites en 2025, et les directives de l'Organisation mondiale de la santé.`,
  nl: `Tussen 25 september en 23 oktober 2021 namen 3.000 Brusselaars deel aan CurieuzenAir, een Citizen Science project van BRAL waarbij NO2-niveaus werden gemeten. De verzamelde gegevens worden hier vergeleken met de officiële metingen van Irceline, die in dezelfde periode verzameld zijn. Je kunt beide datasets vergelijken met verschillende normen: de huidige Europese regelgeving, de toekomstige normen die naar verwachting in 2025 ingevoerd zullen worden, en de richtlijnen van de World Health Organization.`,
}

const luchtpijp = {
  en: `The Luchtpijp project, a citizen science initiative, collects real-time data on fine particulate matter (PM2.5) through a network of sensors installed across Brussels. These data are compared with the official measurements from Irceline, and can be analyzed against various standards: the current European regulations, the future norms expected in 2025, and the World Health Organization guidelines.`,
  fr: `Luchtpijp est un projet de science citoyenne qui collecte des données en temps réel sur les particules fines (PM2,5) à travers un réseau de capteurs répartis dans Bruxelles. Ces données collectées sont comparées aux mesures officielles d'Irceline et peuvent être analysées selon différentes normes : la réglementation européenne actuelle, les futures normes qui devraient être introduites en 2025, et les directives de l'Organisation mondiale de la santé.`,
  nl: `Luchtpijp is een citizen science project dat real-time fijnstof (PM2.5) metingen verzamelt via een netwerk van sensoren die verspreid zijn over Brussel. Deze verzamelde data worden vergeleken met de officiële metingen van Irceline, en kunnen worden geanalyseerd volgens verschillende normen: de huidige Europese regelgeving, de toekomstige normen die naar verwachting in 2025 ingevoerd zullen worden, en de richtlijnen van de World Health Organization.`,
}

export const useDataStore = defineStore('data', () => {
  const locale = ref<Locale>('en')
  const data = ref(null)
  const loading = ref(false)
  const error = ref(null)

  async function getData() {
    data.value = await fetchDirectus({ slug: 'air-quality' })
    console.log({ data: data.value })
  }
  const setLocale = (l: Locale) =>
    l === 'fr-FR' ? (locale.value = 'fr') : (locale.value = l)

  return {
    locale,
    setLocale,
    data,
    loading,
    error,
    getData,
    infoCards: {
      expair,
      curieusenair,
      luchtpijp,
    },
  }
})
