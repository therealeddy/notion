import { BrowserWindow, Menu, Tray } from 'electron'
import path from 'node:path'

export function createTray(window: BrowserWindow) {
  const tray = new Tray(
    process.platform === 'linux' || process.platform === 'win32'
      ? path.join(__dirname, '../../resources/notionTemplate.png')
      : path.resolve(__dirname, 'notionTemplate.png'),
  )

  tray.setToolTip('Notion')

  const menu = Menu.buildFromTemplate([
    { label: 'Notion', enabled: false },
    { type: 'separator' },
    {
      label: 'Criar novo documento',
      click: () => {
        window.webContents.send('new-document')
      },
    },
    { label: 'Sair do Notion', role: 'quit' },
  ])

  tray.setContextMenu(menu)
}
