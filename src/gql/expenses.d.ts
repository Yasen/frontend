import { UUID } from './types'

export type ExpenseInput = {
  type: ExpenseType
  status: ExpenseStatus
  currency: ExpenseCurrency
  amount: number
  vaultId: UUID
  deleted: boolean
  description?: string
  documentId?: UUID | null
  approvedById?: UUID | null
}

export type ExpenseResponse = {
  id: UUID
  type: ExpenseType
  status: ExpenseStatus
  currency: ExpenseCurrency
  amount: number
  vaultId: UUID
  deleted: boolean
  description?: string
  documentId?: UUID | null
  approvedById?: UUID | null
}

enum ExpenseType {
  'none',
  'internal',
  'operating',
  'administrative',
  'medical',
  'services',
  'groceries',
  'transport',
  'accommodation',
  'shipping',
  'utility',
  'rental',
  'legal',
  'bank',
  'advertising',
  'other',
}

enum ExpenseStatus {
  'pending',
  'approved',
  'canceled',
}

enum ExpenseCurrency {
  'BGN',
  'EUR',
  'USD',
}