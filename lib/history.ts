export interface IdentificationResult {
  id: string
  userId: string
  imageName: string
  imageUrl: string
  prediction: string
  category: "Herbal" | "Non-Herbal"
  description: string
  timestamp: Date
}

const HISTORY_KEY = "herbalif_history"

export function getHistory(userId: string): IdentificationResult[] {
  if (typeof window === "undefined") return []
  const history = localStorage.getItem(HISTORY_KEY)
  const allHistory: IdentificationResult[] = history ? JSON.parse(history) : []
  return allHistory
    .filter((item) => item.userId === userId)
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
}

export function saveToHistory(result: Omit<IdentificationResult, "id" | "timestamp">): void {
  if (typeof window === "undefined") return

  const history = localStorage.getItem(HISTORY_KEY)
  const allHistory: IdentificationResult[] = history ? JSON.parse(history) : []

  const newResult: IdentificationResult = {
    ...result,
    id: Date.now().toString(),
    timestamp: new Date(),
  }

  allHistory.push(newResult)
  localStorage.setItem(HISTORY_KEY, JSON.stringify(allHistory))
}

export function deleteFromHistory(id: string): void {
  if (typeof window === "undefined") return

  const history = localStorage.getItem(HISTORY_KEY)
  const allHistory: IdentificationResult[] = history ? JSON.parse(history) : []

  const updatedHistory = allHistory.filter((item) => item.id !== id)
  localStorage.setItem(HISTORY_KEY, JSON.stringify(updatedHistory))
}

// Plant information database
export const PLANT_INFO: Record<string, { category: "Herbal" | "Non-Herbal"; description: string }> = {
  saga: {
    category: "Herbal",
    description:
      "Tanaman saga (Abrus precatorius) memiliki khasiat sebagai obat tradisional untuk mengobati batuk, demam, dan peradangan. Biji saga juga digunakan dalam pengobatan herbal.",
  },
  kelor: {
    category: "Herbal",
    description:
      "Daun kelor (Moringa oleifera) kaya akan vitamin A, C, dan mineral. Dikenal sebagai superfood yang dapat meningkatkan sistem imun dan memiliki sifat antioksidan tinggi.",
  },
  beras: {
    category: "Non-Herbal",
    description:
      "Tanaman padi (Oryza sativa) adalah sumber karbohidrat utama. Meskipun bukan tanaman herbal, daun padi memiliki kandungan silika yang baik untuk kesehatan.",
  },
  tomat: {
    category: "Non-Herbal",
    description:
      "Tanaman tomat (Solanum lycopersicum) adalah tanaman pangan yang kaya likopen. Daunnya tidak dikonsumsi karena mengandung solanin yang beracun.",
  },
  kentang: {
    category: "Non-Herbal",
    description:
      "Tanaman kentang (Solanum tuberosum) adalah sumber karbohidrat. Daun kentang mengandung glikoalkaloid yang beracun dan tidak boleh dikonsumsi.",
  },
}
