import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { X } from 'lucide-react'

export const inputClass =
  'w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 transition-colors focus:border-brand-orange focus:outline-none focus:ring-2 focus:ring-brand-orange/20'

export const labelClass = 'mb-1.5 block text-sm font-medium text-gray-700'

export const tableClass = 'w-full text-sm'
export const theadClass = 'bg-gray-50 text-left text-xs font-semibold uppercase tracking-wide text-gray-500'
export const thClass = 'px-4 py-3'
export const tdClass = 'px-4 py-3 text-gray-700'

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost'
  size?: 'sm' | 'md'
}

const buttonVariants: Record<NonNullable<ButtonProps['variant']>, string> = {
  primary: 'bg-brand-orange text-white hover:bg-[#e6741a] shadow-sm',
  secondary: 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50',
  danger: 'bg-red-50 text-red-600 hover:bg-red-100',
  ghost: 'text-gray-600 hover:bg-gray-100',
}

export function Button({ variant = 'primary', size = 'md', className = '', ...props }: ButtonProps) {
  const sizes = size === 'sm' ? 'px-3 py-1.5 text-xs' : 'px-4 py-2 text-sm'
  return (
    <button
      className={`inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange/40 disabled:cursor-not-allowed disabled:opacity-50 ${sizes} ${buttonVariants[variant]} ${className}`}
      {...props}
    />
  )
}

export function PageHeader({
  title,
  description,
  actions,
}: {
  title: string
  description?: string
  actions?: ReactNode
}) {
  return (
    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
        {description && <p className="mt-1 text-sm text-gray-500">{description}</p>}
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
    </div>
  )
}

export function Card({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <div className={`rounded-xl border border-gray-200 bg-white shadow-sm ${className}`}>
      {children}
    </div>
  )
}

export function SectionCard({
  title,
  description,
  actions,
  children,
}: {
  title: string
  description?: string
  actions?: ReactNode
  children: ReactNode
}) {
  return (
    <Card>
      <div className="flex flex-col gap-2 border-b border-gray-100 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-base font-semibold text-gray-900">{title}</h2>
          {description && <p className="mt-0.5 text-sm text-gray-500">{description}</p>}
        </div>
        {actions}
      </div>
      <div className="p-5">{children}</div>
    </Card>
  )
}

export function Modal({
  title,
  subtitle,
  onClose,
  children,
  footer,
  maxWidth = 'max-w-2xl',
}: {
  title: string
  subtitle?: string
  onClose: () => void
  children: ReactNode
  footer?: ReactNode
  maxWidth?: string
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className={`flex max-h-[90vh] w-full ${maxWidth} flex-col overflow-hidden rounded-xl bg-white shadow-2xl`}>
        <div className="flex items-start justify-between border-b border-gray-200 px-5 py-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
            {subtitle && <p className="mt-0.5 text-sm text-gray-500">{subtitle}</p>}
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
            aria-label="关闭"
          >
            <X size={20} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-5 py-4">{children}</div>
        {footer && (
          <div className="flex items-center justify-end gap-2 border-t border-gray-200 bg-gray-50 px-5 py-3">
            {footer}
          </div>
        )}
      </div>
    </div>
  )
}

export function Field({
  label,
  children,
  hint,
  className = '',
}: {
  label: string
  children: ReactNode
  hint?: string
  className?: string
}) {
  return (
    <div className={className}>
      <label className={labelClass}>{label}</label>
      {children}
      {hint && <p className="mt-1 text-xs text-gray-400">{hint}</p>}
    </div>
  )
}

export function EmptyState({ children }: { children: ReactNode }) {
  return <div className="px-6 py-12 text-center text-sm text-gray-500">{children}</div>
}

export function ImagePreview({
  src,
  alt = '',
  ratio = 'aspect-[4/3]',
}: {
  src: string
  alt?: string
  ratio?: string
}) {
  return (
    <div className={`${ratio} w-full overflow-hidden rounded-lg border border-gray-200 bg-gray-50`}>
      {src ? (
        <img src={src} alt={alt} className="h-full w-full object-cover" />
      ) : (
        <div className="flex h-full w-full items-center justify-center text-xs text-gray-400">暂无图片</div>
      )}
    </div>
  )
}
