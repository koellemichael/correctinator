import React, { useEffect, useState } from 'react';
import { MenuItem, remote, shell } from 'electron';
import TitleBar from 'frameless-titlebar';

const { version } = require('../package.json');

const currentWindow = remote.getCurrentWindow();

export default function FramelessTitleBar(props: any) {
  // manage window state, default to currentWindow maximized state
  const [maximized, setMaximized] = useState(currentWindow.isMaximized());
  const { theme } = props;

  // add window listeners for currentWindow
  useEffect(() => {
    const onMaximized = () => setMaximized(true);
    const onRestore = () => setMaximized(false);
    currentWindow.on('maximize', onMaximized);
    currentWindow.on('unmaximize', onRestore);
    return () => {
      currentWindow.removeListener('maximize', onMaximized);
      currentWindow.removeListener('unmaximize', onRestore);
    };
  }, []);

  // used by double click on the titlebar
  // and by the maximize control button
  const handleMaximize = () => {
    if (maximized) {
      currentWindow.restore();
    } else {
      currentWindow.maximize();
    }
  };

  const templateDefault: any[] = [
    {
      label: 'File',
      submenu: [
        {
          label: 'Exit',
          accelerator: 'Ctrl+W',
          click: () => {
            currentWindow.close();
          },
        },
      ],
    },
    {
      label: 'View',
      submenu:
        process.env.NODE_ENV === 'development' ||
        process.env.DEBUG_PROD === 'true'
          ? [
              {
                label: 'Reload',
                accelerator: 'Ctrl+R',
                click: () => {
                  currentWindow.webContents.reload();
                },
              },
              {
                label: 'Toggle Full Screen',
                accelerator: 'F11',
                click: () => {
                  currentWindow.setFullScreen(!currentWindow.isFullScreen());
                },
              },
              {
                label: 'Toggle Developer Tools',
                accelerator: 'Alt+Ctrl+I',
                click: () => {
                  currentWindow.webContents.toggleDevTools();
                },
              },
              {
                label: 'Dark Mode',
                accelerator: 'F12',
                type: 'checkbox',
                checked: remote?.nativeTheme?.shouldUseDarkColors,
                click: () => {
                  remote.nativeTheme.themeSource = remote.nativeTheme
                    .shouldUseDarkColors
                    ? 'light'
                    : 'dark';
                },
              },
            ]
          : [
              {
                label: 'Toggle Full Screen',
                accelerator: 'F11',
                click: () => {
                  currentWindow.setFullScreen(!currentWindow.isFullScreen());
                },
              },
              {
                label: 'Dark Mode',
                accelerator: 'F12',
                type: 'checkbox',
                checked: remote?.nativeTheme?.shouldUseDarkColors,
                click: () => {
                  remote.nativeTheme.themeSource = remote.nativeTheme
                    .shouldUseDarkColors
                    ? 'light'
                    : 'dark';
                },
              },
            ],
    },
    {
      label: 'Help',
      submenu: [
        {
          label: 'Check for updates',
          async click() {
            console.log(
              await remote
                .require('electron-updater')
                .autoUpdater.checkForUpdates()
            );
          },
        },
        {
          label: 'Documentation',
          click() {
            shell.openExternal(
              'https://github.com/koellemichael/correctinator#readme'
            );
          },
        },
        {
          label: 'Search Issues',
          click() {
            shell.openExternal(
              'https://github.com/koellemichael/correctinator/issues'
            );
          },
        },
      ],
    },
  ];

  return (
    <div>
      <TitleBar
        iconSrc="../resources/icon.ico" // app icon
        currentWindow={currentWindow} // electron window instance
        // platform={process.platform} // win32, darwin, linux
        menu={templateDefault}
        theme={{
          bar: {
            color: theme.palette.text.primary,
            background: theme.palette.background.default,
            borderBottom: 'none',
          },
          ...theme,
          menu: {
            palette: remote.nativeTheme.shouldUseDarkColors ? 'dark' : 'light',
            overlay: {
              opacity: 0.0,
            },
          },
        }}
        title={`correctinator v${version}`}
        onClose={() => currentWindow.close()}
        onMinimize={() => currentWindow.minimize()}
        onMaximize={handleMaximize}
        // when the titlebar is double clicked
        onDoubleClick={handleMaximize}
        // hide minimize windows control
        disableMinimize={false}
        // hide maximize windows control
        disableMaximize={false}
        // is the current window maximized?
        maximized={maximized}
      >
        {/* custom titlebar items */}
      </TitleBar>
    </div>
  );
}
