import { useQuery } from '@tanstack/react-query'
import clsx from 'clsx'
import { Command } from 'cmdk'
import { File, MagnifyingGlass } from 'phosphor-react'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

interface SearchBarProps {
  open: boolean
  onOpenChange: (isOpen: boolean) => void
}

export function SearchBar({ open, onOpenChange }: SearchBarProps) {
  const navigate = useNavigate()

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        onOpenChange(!open)
      }
    }

    document.addEventListener('keydown', down)
    return () => document.removeEventListener('keydown', down)
  }, [onOpenChange, open])

  const { data } = useQuery(['documents'], async () => {
    const response = await window.api.fetchDocuments()

    return response.data
  })

  function handleOpenDocument(id: string) {
    navigate(`/documents/${id}`)
    onOpenChange(false)
  }

  return (
    <Command.Dialog
      className="fixed top-24 left-1/2 -translate-x-1/2 w-[480px] max-w-full bg-notion-800 rounded-md shadow-2xl text-notion-100 border border-notion-600"
      open={open}
      onOpenChange={onOpenChange}
      label="Search"
    >
      <div
        className={clsx('flex items-center gap-2 p-4', {
          'border-b border-notion-700': !!data?.length,
        })}
      >
        <MagnifyingGlass className="w-5 h-5" />
        <Command.Input
          autoFocus
          placeholder="Buscar documentos..."
          className="w-full bg-transparent focus:outline-none text-sm text-notion-50 placeholder:text-notion-200"
        />
      </div>
      <Command.List
        className={clsx(
          'max-h-48 scrollbar-thin overflow-auto scrollbar-thumb-notion-600 scrollbar-track-notion-800',
          {
            'py-2': !!data?.length,
          },
        )}
      >
        <Command.Empty className="py-3 px-4 text-notion-200 text-sm">
          Nenhum documento encontrado.
        </Command.Empty>

        {data?.map((document) => {
          return (
            <Command.Item
              key={String(document.id)}
              onSelect={() => handleOpenDocument(document.id)}
              className="py-3 px-4 text-notion-50 text-sm flex items-center gap-2 hover:bg-notion-700 aria-selected:!bg-notion-600"
            >
              <File className="w-4 h-4" />
              {document.title}
            </Command.Item>
          )
        })}
      </Command.List>
    </Command.Dialog>
  )
}
