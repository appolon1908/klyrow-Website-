import {
  localeFromRoutePath,
  localizedContentPath
} from '../../content'

export const useContentLocale = () => {
  const route = useRoute()
  const locale = computed(() => localeFromRoutePath(route.path))
  const localizePath = (path: string) =>
    localizedContentPath(locale.value, path)

  return {
    locale,
    localizePath
  }
}
