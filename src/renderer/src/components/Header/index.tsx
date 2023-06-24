import clsx from 'clsx'
import * as Collapsible from '@radix-ui/react-collapsible'
import { Code, CaretDoubleRight, TrashSimple } from 'phosphor-react'
import { useNavigate, useParams } from 'react-router-dom'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Document } from '@shared/types/ipc'

interface HeaderProps {
  isSidebarOpen: boolean
}

export function Header({ isSidebarOpen }: HeaderProps) {
  const { id } = useParams<{ id: string }>()
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  const isMacOS = process.platform === 'darwin'

  const { mutateAsync: deleteDocument, isLoading: isDeletingDocument } =
    useMutation(
      async () => {
        await window.api.deleteDocument({ id: id! })
      },
      {
        onSuccess: () => {
          queryClient.setQueryData<Document[]>(['documents'], (documents) => {
            return documents?.filter((document) => document.id !== id)
          })

          navigate('/')
        },
      },
    )

  const { data } = useQuery(['documents'], async () => {
    const response = await window.api.fetchDocuments()

    return response.data
  })

  const documentPage = data?.find((document) => document.id === id)

  return (
    <div
      id="header"
      className={clsx(
        'border-b h-14 border-notion-600 py-[1.125rem] px-6 flex items-center gap-4 leading-tight transition-all duration-250 region-drag',
        {
          'pl-24': !isSidebarOpen && isMacOS,
          'w-screen': !isSidebarOpen,
          'w-[calc(100vw-240px)]': isSidebarOpen,
        },
      )}
    >
      <Collapsible.Trigger
        className={clsx('h-5 w-5 text-notion-200 hover:text-notion-50', {
          hidden: isSidebarOpen,
          block: !isSidebarOpen,
        })}
      >
        <CaretDoubleRight className="h-4 w-4" />
      </Collapsible.Trigger>

      {id && (
        <>
          {documentPage && (
            <div className="flex-1 overflow-hidden flex items-center">
              <span className="inline-flex items-center gap-2 hover:text-notion-50 text-notion-50">
                <Code weight="bold" className="h-4 w-4 text-pink-500" />
                {documentPage.title}
              </span>
            </div>
          )}

          <div className="inline-flex region-no-drag">
            <button
              onClick={() => deleteDocument()}
              disabled={isDeletingDocument}
              className="inline-flex items-center gap-1 text-notion-100 text-sm hover:text-notion-50 disabled:opacity-60"
            >
              <TrashSimple className="h-4 w-4" />
              Apagar
            </button>
          </div>
        </>
      )}
    </div>
  )
}
