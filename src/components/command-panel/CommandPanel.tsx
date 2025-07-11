import './command-panel.css'
import { Command } from 'cmdk'
import { useCallback, useRef, useState, type ReactNode } from 'react'
import { useShortcut } from './use-shortcut'
import { setDarkTheme, setLightTheme } from '../../utils/theme'
import { navigate } from 'astro:transitions/client'

export function CommandPanel() {
  const ref = useRef<HTMLDivElement | null>(null)
  const { open, setOpen } = useShortcut()
  const [inputValue, setInputValue] = useState('')

  const [pages, setPages] = useState<string[]>(['home'])
  const activePage = pages[pages.length - 1]
  const isHome = activePage === 'home'

  const pushPage = useCallback(
    (newPage: string, clearInput = true) => {
      setPages([...pages, newPage])
      if (clearInput) {
        setInputValue('')
      }
    },
    [pages, setPages]
  )

  const popPage = useCallback(() => {
    setPages((pages) => {
      const x = [...pages]
      x.splice(-1, 1)
      return x
    })
  }, [])

  const popToPage = useCallback((page: string) => {
    setPages((pages) => {
      const index = pages.indexOf(page)
      if (index === -1) {
        return pages
      }
      return pages.slice(0, index + 1)
    })
  }, [])

  const onKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (isHome || inputValue.length) {
        return
      }

      if (e.key === 'Backspace') {
        e.preventDefault()
        popPage()
      }
    },
    [inputValue.length, isHome, popPage]
  )

  function bounce() {
    if (ref.current) {
      ref.current.style.transform = 'scale(0.98)'
      setTimeout(() => {
        if (ref.current) {
          ref.current.style.transform = ''
        }
      }, 100)
    }
  }

  return (
    <Command.Dialog
      open={open}
      onOpenChange={setOpen}
      ref={ref}
      onKeyDown={(e: React.KeyboardEvent<HTMLDivElement>) => {
        if (e.key === 'Enter') {
          bounce()
        }

        if (isHome || inputValue.length) {
          return
        }

        if (e.key === 'Backspace') {
          e.preventDefault()
          popPage()
          bounce()
        }
      }}
    >
      <div>
        {pages.map((p) => (
          <div key={p} cmdk-badge='' onClick={() => popToPage(p)}>
            {p}
          </div>
        ))}
      </div>
      <Command.Input
        autoFocus
        placeholder='Search...'
        onValueChange={setInputValue}
        value={inputValue}
      />
      <Command.List>
        <Command.Empty>Nothing here</Command.Empty>
        {activePage === 'home' && <Home pushPage={pushPage} />}
        {activePage === 'themes' && <Themes />}
      </Command.List>
    </Command.Dialog>
  )
}

function Home({ pushPage }: { pushPage: (newPage: string, clearInput?: boolean) => void }) {
  return (
    <>
      <Command.Group heading='Pages'>
        <Command.Item keywords={['home']} onSelect={() => navigate('/')}>
          Home
        </Command.Item>
        <Command.Item keywords={['about']} onSelect={() => navigate('/about')}>
          About
        </Command.Item>
        <Command.Item keywords={['work']} onSelect={() => navigate('/work')}>
          Work
        </Command.Item>
        <Command.Item keywords={['uses']} onSelect={() => navigate('/uses')}>
          Uses
        </Command.Item>
      </Command.Group>
      <Command.Group heading='Preferences'>
        <Item onSelect={() => pushPage('themes')} keywords={['mode', 'dark', 'light']}>
          <ProjectsIcon />
          Set theme
        </Item>
        <Themes />
      </Command.Group>

      <Command.Group heading='Teams'>
        <Item shortcut='⇧ P'>
          <TeamsIcon />
          Search Teams...
        </Item>
        <Item>
          <PlusIcon />
          Create New Team...
        </Item>
      </Command.Group>
      <Command.Group heading='Help'>
        <Item shortcut='⇧ D'>
          <DocsIcon />
          Search Docs...
        </Item>
        <Item>
          <FeedbackIcon />
          Send Feedback...
        </Item>
        <Item>
          <ContactIcon />
          Contact Support
        </Item>
      </Command.Group>
    </>
  )
}

function Themes() {
  return (
    <>
      <Item onSelect={setDarkTheme}>Dark Theme</Item>
      <Item onSelect={setLightTheme}>Light Theme</Item>
    </>
  )
}

function Item({
  children,
  shortcut,
  onSelect = () => {},
  keywords,
}: {
  children: ReactNode
  shortcut?: string
  onSelect?: (value: string) => void
  keywords?: string[]
}) {
  return (
    <Command.Item onSelect={onSelect} keywords={keywords}>
      {children}
      {shortcut && (
        <div cmdk-shortcuts=''>
          {shortcut.split(' ').map((key) => {
            return <kbd key={key}>{key}</kbd>
          })}
        </div>
      )}
    </Command.Item>
  )
}

function ProjectsIcon() {
  return (
    <svg
      fill='none'
      height='24'
      shapeRendering='geometricPrecision'
      stroke='currentColor'
      strokeLinecap='round'
      strokeLinejoin='round'
      strokeWidth='1.5'
      viewBox='0 0 24 24'
      width='24'
    >
      <path d='M3 3h7v7H3z'></path>
      <path d='M14 3h7v7h-7z'></path>
      <path d='M14 14h7v7h-7z'></path>
      <path d='M3 14h7v7H3z'></path>
    </svg>
  )
}

function PlusIcon() {
  return (
    <svg
      fill='none'
      height='24'
      shapeRendering='geometricPrecision'
      stroke='currentColor'
      strokeLinecap='round'
      strokeLinejoin='round'
      strokeWidth='1.5'
      viewBox='0 0 24 24'
      width='24'
    >
      <path d='M12 5v14'></path>
      <path d='M5 12h14'></path>
    </svg>
  )
}

function TeamsIcon() {
  return (
    <svg
      fill='none'
      height='24'
      shapeRendering='geometricPrecision'
      stroke='currentColor'
      strokeLinecap='round'
      strokeLinejoin='round'
      strokeWidth='1.5'
      viewBox='0 0 24 24'
      width='24'
    >
      <path d='M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2'></path>
      <circle cx='9' cy='7' r='4'></circle>
      <path d='M23 21v-2a4 4 0 00-3-3.87'></path>
      <path d='M16 3.13a4 4 0 010 7.75'></path>
    </svg>
  )
}

function CopyIcon() {
  return (
    <svg
      fill='none'
      height='24'
      shapeRendering='geometricPrecision'
      stroke='currentColor'
      strokeLinecap='round'
      strokeLinejoin='round'
      strokeWidth='1.5'
      viewBox='0 0 24 24'
      width='24'
    >
      <path d='M8 17.929H6c-1.105 0-2-.912-2-2.036V5.036C4 3.91 4.895 3 6 3h8c1.105 0 2 .911 2 2.036v1.866m-6 .17h8c1.105 0 2 .91 2 2.035v10.857C20 21.09 19.105 22 18 22h-8c-1.105 0-2-.911-2-2.036V9.107c0-1.124.895-2.036 2-2.036z'></path>
    </svg>
  )
}

function DocsIcon() {
  return (
    <svg
      fill='none'
      height='24'
      shapeRendering='geometricPrecision'
      stroke='currentColor'
      strokeLinecap='round'
      strokeLinejoin='round'
      strokeWidth='1.5'
      viewBox='0 0 24 24'
      width='24'
    >
      <path d='M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z'></path>
      <path d='M14 2v6h6'></path>
      <path d='M16 13H8'></path>
      <path d='M16 17H8'></path>
      <path d='M10 9H8'></path>
    </svg>
  )
}

function FeedbackIcon() {
  return (
    <svg
      fill='none'
      height='24'
      shapeRendering='geometricPrecision'
      stroke='currentColor'
      strokeLinecap='round'
      strokeLinejoin='round'
      strokeWidth='1.5'
      viewBox='0 0 24 24'
      width='24'
    >
      <path d='M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z'></path>
    </svg>
  )
}

function ContactIcon() {
  return (
    <svg
      fill='none'
      height='24'
      shapeRendering='geometricPrecision'
      stroke='currentColor'
      strokeLinecap='round'
      strokeLinejoin='round'
      strokeWidth='1.5'
      viewBox='0 0 24 24'
      width='24'
    >
      <path d='M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z'></path>
      <path d='M22 6l-10 7L2 6'></path>
    </svg>
  )
}
