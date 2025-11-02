import { defineApifulConfig, type ApifulConfig } from 'apiful/config'

const config: ApifulConfig = defineApifulConfig({
  services: {
    oryKaratos: {
      schema: './kratos.json',
    },
    oryHydra: {
      schema: './hydra.json',
    },
  },
})
export default config
