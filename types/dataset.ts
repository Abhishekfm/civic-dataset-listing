export interface Organization {
  name: string;
  logo?: string;
}

export interface MetadataItem {
  label: string;
}

export interface Metadata {
  metadata_item: MetadataItem;
  value: string;
}

export interface Dataset {
  id: string;
  title: string;
  description: string;
  slug: string;
  created: string;
  modified: string;
  status: string;
  metadata: Metadata[];
  tags: string[];
  sectors: string[];
  formats: string[];
  has_charts: boolean;
  download_count: number;
  trending_score: number;
  is_individual_dataset: boolean;
  organization: Organization;
  user: any | null;
}

export interface Aggregations {
  Geography: Record<string, number>;
  sectors: Record<string, number>;
  tags: Record<string, number>;
  formats: Record<string, number>;
  licenses?: Record<string, number>;
}

export interface DatasetResponse {
  results: Dataset[];
  total: number;
  aggregations: Aggregations;
}
