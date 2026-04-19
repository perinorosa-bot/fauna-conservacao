// Wires messages/pt.json into next-intl's type system so t('nav.donate')
// autocompletes and errors on unknown keys.

type Messages = typeof import('../../messages/pt.json')

declare global {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface IntlMessages extends Messages {}
}

export {}
