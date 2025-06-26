// Knapsack algorithm for cargo optimization

export interface KnapsackItem {
  id: number | string
  name: string
  weight: number
  value: number // Priority value or importance
}

export interface KnapsackResult {
  selectedItems: KnapsackItem[]
  totalWeight: number
  totalValue: number
  remainingItems: KnapsackItem[]
}

/**
 * Solves the 0/1 Knapsack problem to optimize cargo loading
 * @param items Array of cargo items with weight and value
 * @param capacity Maximum weight capacity
 * @returns Object containing selected items and stats
 */
export function knapsackOptimization(items: KnapsackItem[], capacity: number): KnapsackResult {
  // Create a 2D array for dynamic programming
  const n = items.length
  const dp: number[][] = Array(n + 1)
    .fill(0)
    .map(() => Array(capacity + 1).fill(0))

  // Fill the dp table
  for (let i = 1; i <= n; i++) {
    const item = items[i - 1]
    for (let w = 0; w <= capacity; w++) {
      if (item.weight <= w) {
        // Max of including or excluding the current item
        dp[i][w] = Math.max(dp[i - 1][w], dp[i - 1][w - Math.floor(item.weight)] + item.value)
      } else {
        // Can't include this item
        dp[i][w] = dp[i - 1][w]
      }
    }
  }

  // Backtrack to find which items were selected
  const selectedItems: KnapsackItem[] = []
  let remainingWeight = capacity

  for (let i = n; i > 0; i--) {
    // If this item was included
    if (dp[i][remainingWeight] !== dp[i - 1][remainingWeight]) {
      const item = items[i - 1]
      selectedItems.push(item)
      remainingWeight -= Math.floor(item.weight)
    }
  }

  // Calculate total weight and value
  const totalWeight = selectedItems.reduce((sum, item) => sum + item.weight, 0)
  const totalValue = selectedItems.reduce((sum, item) => sum + item.value, 0)

  // Find remaining items
  const selectedIds = new Set(selectedItems.map((item) => item.id))
  const remainingItems = items.filter((item) => !selectedIds.has(item.id))

  return {
    selectedItems,
    totalWeight,
    totalValue,
    remainingItems,
  }
}

/**
 * Convert cargo priority to numeric value for optimization
 */
export function priorityToValue(priority: string): number {
  switch (priority.toLowerCase()) {
    case "urgent":
      return 100
    case "high":
      return 75
    case "medium":
      return 50
    case "low":
      return 25
    default:
      return 10
  }
}
