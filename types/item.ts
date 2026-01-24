export type ItemType = "lost" | "found"

export interface Item {
  id: string
  name: string
  category: string
  description?: string
  condition?: string
  location: string
  imageUrl?: string
  foundBy: string
  sensitiveItem?: boolean
  createdAt?: any
  type: ItemType
}
