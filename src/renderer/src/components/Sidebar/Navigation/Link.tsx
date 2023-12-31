import clsx from 'clsx'
import { NavLink } from 'react-router-dom'
import { ReactNode } from 'react'

interface LinkProps {
  to: string
  children: ReactNode
}

export function Link({ to, children }: LinkProps) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) => {
        return clsx(
          'flex items-center text-sm gap-2 text-notion-100 hover:text-notion-50 py-1 px-3 rounded group hover:bg-notion-700',
          {
            'bg-notion-700': isActive,
          },
        )
      }}
    >
      <span className="truncate flex-1">{children}</span>
    </NavLink>
  )
}
