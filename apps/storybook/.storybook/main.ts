import { StorybookConfig } from '@storybook/nextjs'

const config: StorybookConfig = {
  stories: ['../../../packages/ui/**/*.stories.@(ts|tsx|mdx)'],
  features: {
    storyStoreV7: false,
  },
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/addon-interactions',
    {
      name: '@storybook/addon-react-native-web',
      options: {
        modulesToTranspile: [
          'solito',
          'expo-linking',
          'expo-constants',
          'expo-modules-core',
          'expo-document-picker',
          'expo-av',
          'expo-asset',
        ],
      },
    },
  ],
  framework: {
    name: '@storybook/nextjs',
    options: {
      builder: {
        useSWC: false,
      },
    },
  },
  core: {
    builder: {
      name: '@storybook/builder-webpack5',
      options: {
        fsCache: true,
        lazyCompilation: true,
      },
    },
  },
  docs: {
    autodocs: true,
  },
}
export default config
