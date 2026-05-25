// ЭТО ВРЕМЕННЫЙ КОМПОНЕНТ КОТОРЫЙ ПРОСТО ДОБАВЛЯЕТ loading time
export const wait = (delayMs: number) =>
  new Promise<void>((resolve) => {
    window.setTimeout(resolve, delayMs)
  })
