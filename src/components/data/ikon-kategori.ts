import { Banknote, HeartPulse, MessageCircleMore, Salad, SprayCan, Truck, UtensilsCrossed, type LucideIcon } from "lucide-react";
import type { Kategori } from "@/lib/label";

export const IKON_KATEGORI: Record<Kategori, LucideIcon> = {
  keracunan: HeartPulse,
  makanan_tidak_layak: UtensilsCrossed,
  kebersihan: SprayCan,
  gizi_porsi: Salad,
  distribusi: Truck,
  pengadaan: Banknote,
  lainnya: MessageCircleMore,
};
