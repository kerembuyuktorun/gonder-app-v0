import {
  BarChart3,
  Calculator,
  ClipboardPlus,
  FileText,
  Home,
  LifeBuoy,
  Link2,
  Settings,
  ShoppingCart,
  Truck,
} from "lucide-react";
import type { NavGroup } from "@/layout-kit";

export const panelNavGroups: NavGroup[] = [
  {
    items: [
      {
        title: "Ana Sayfa",
        url: "/dashboard",
        icon: Home,
      },
    ],
  },
  {
    label: "Operasyonlar",
    items: [
      {
        title: "Fiyat Hesaplama",
        url: "/price-calculation",
        icon: Calculator,
      },
      {
        title: "Gönderi Oluştur",
        url: "/create-shipment",
        icon: ClipboardPlus,
      },
    ],
  },
  {
    label: "Siparişler",
    items: [
      {
        title: "Siparişler",
        url: "/orders",
        icon: ShoppingCart,
      },
      {
        title: "Teklifler",
        url: "/quotes",
        icon: FileText,
      },
      {
        title: "Gönderiler",
        url: "/shipments",
        icon: Truck,
      },
    ],
  },
  {
    label: "Yönetim",
    items: [
      {
        title: "Entegrasyon",
        url: "/integrations",
        icon: Link2,
      },
      {
        title: "Raporlar",
        url: "/reports",
        icon: BarChart3,
      },
      {
        title: "Ayarlar",
        url: "/settings",
        icon: Settings,
      },
      {
        title: "Destek",
        url: "/support",
        icon: LifeBuoy,
      },
    ],
  },
];
