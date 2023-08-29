export interface NFTData {
  cached_file_url?: string
  file_url?: string
  metadata?: {
    attributes: {
      trait_type: string
      value: string
    }[]
    description: string
    image: string
    name: string
  }
  metadata_url?: string
  mint_date?: string
  token_id?: string
  updated_date?: string
  contract_address?: string
  chain?: string
  animaton_url?: string
  cached_animation_url?: string
  file_information?: {
    file_size: number
    height: number
    width: number
  }
}