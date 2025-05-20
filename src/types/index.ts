export interface ContactFormData {
  name: string;
  phone: string;
  email?: string;
  service: "Parquet" | "Vinyl" | "Laminate" | "Carpet" | "Tile" | "Other";
  comment?: string;
  privacyPolicyAccepted: boolean;
}

export interface ApiResponse {
  success: boolean;
  message: string;
}
