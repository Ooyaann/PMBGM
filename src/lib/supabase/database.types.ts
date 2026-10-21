
export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export type Database = {
  
  "graphql_public": {
          Tables: {
            [_ in never]: never
          }
          Views: {
            [_ in never]: never
          }
          Functions: {
            "graphql":
{ Args: { "extensions"?: Json,"operationName"?: string,"query"?: string,"variables"?: Json }; Returns: Json
                           }
          }
          Enums: {
            [_ in never]: never
          }
          CompositeTypes: {
            [_ in never]: never
          }
        },"public": {
          Tables: {
            "anggaran_bulanan": {
                  Row: {
                    "bulan": string,"id": number,"jumlah_penerima": number,"jumlah_sppg": number,"pagu": number,"realisasi": number,"sumber": Database["public"]['Enums']["sumber_data"],"wilayah_id": string
                  }
                  ComputedFields: never
                  Insert: {
                    "bulan": string,"id"?: never,"jumlah_penerima": number,"jumlah_sppg": number,"pagu": number,"realisasi": number,"sumber"?: Database["public"]['Enums']["sumber_data"],"wilayah_id": string
                  }
                  Update: {
                    "bulan"?: string,"id"?: never,"jumlah_penerima"?: number,"jumlah_sppg"?: number,"pagu"?: number,"realisasi"?: number,"sumber"?: Database["public"]['Enums']["sumber_data"],"wilayah_id"?: string
                  }
                  Relationships: [
                    {
      foreignKeyName: "anggaran_bulanan_wilayah_id_fkey"
      columns: ["wilayah_id"]
isOneToOne: false
      referencedRelation: "v_akuntabilitas_kecamatan"
      referencedColumns: ["wilayah_id"]
    },{
      foreignKeyName: "anggaran_bulanan_wilayah_id_fkey"
      columns: ["wilayah_id"]
isOneToOne: false
      referencedRelation: "v_ringkasan_kabkota"
      referencedColumns: ["wilayah_id"]
    },{
      foreignKeyName: "anggaran_bulanan_wilayah_id_fkey"
      columns: ["wilayah_id"]
isOneToOne: false
      referencedRelation: "v_risiko_kecamatan"
      referencedColumns: ["wilayah_id"]
    },{
      foreignKeyName: "anggaran_bulanan_wilayah_id_fkey"
      columns: ["wilayah_id"]
isOneToOne: false
      referencedRelation: "wilayah"
      referencedColumns: ["id"]
    }
                  ]
                },"aturan_sla": {
                  Row: {
                    "batas_jam": number,"kategori": Database["public"]['Enums']["kategori_laporan"],"tahap": Database["public"]['Enums']["status_alur"]
                  }
                  ComputedFields: never
                  Insert: {
                    "batas_jam": number,"kategori": Database["public"]['Enums']["kategori_laporan"],"tahap": Database["public"]['Enums']["status_alur"]
                  }
                  Update: {
                    "batas_jam"?: number,"kategori"?: Database["public"]['Enums']["kategori_laporan"],"tahap"?: Database["public"]['Enums']["status_alur"]
                  }
                  Relationships: [
                    
                  ]
                },"bukti": {
                  Row: {
                    "dibuat_pada": string,"id": string,"jenis": Database["public"]['Enums']["jenis_bukti"],"laporan_id": string,"path_storage": string,"publik": boolean,"ukuran_byte": number | null
                  }
                  ComputedFields: never
                  Insert: {
                    "dibuat_pada"?: string,"id"?: string,"jenis"?: Database["public"]['Enums']["jenis_bukti"],"laporan_id": string,"path_storage": string,"publik"?: boolean,"ukuran_byte"?: number | null
                  }
                  Update: {
                    "dibuat_pada"?: string,"id"?: string,"jenis"?: Database["public"]['Enums']["jenis_bukti"],"laporan_id"?: string,"path_storage"?: string,"publik"?: boolean,"ukuran_byte"?: number | null
                  }
                  Relationships: [
                    {
      foreignKeyName: "bukti_laporan_id_fkey"
      columns: ["laporan_id"]
isOneToOne: false
      referencedRelation: "laporan"
      referencedColumns: ["id"]
    }
                  ]
                },"bukti_metadata": {
                  Row: {
                    "bukti_id": string,"exif_lat": number | null,"exif_lng": number | null,"exif_waktu": string | null,"perangkat": string | null
                  }
                  ComputedFields: never
                  Insert: {
                    "bukti_id": string,"exif_lat"?: number | null,"exif_lng"?: number | null,"exif_waktu"?: string | null,"perangkat"?: string | null
                  }
                  Update: {
                    "bukti_id"?: string,"exif_lat"?: number | null,"exif_lng"?: number | null,"exif_waktu"?: string | null,"perangkat"?: string | null
                  }
                  Relationships: [
                    {
      foreignKeyName: "bukti_metadata_bukti_id_fkey"
      columns: ["bukti_id"]
isOneToOne: true
      referencedRelation: "bukti"
      referencedColumns: ["id"]
    }
                  ]
                },"dukungan": {
                  Row: {
                    "dibuat_pada": string,"laporan_id": string,"pengguna_id": string
                  }
                  ComputedFields: never
                  Insert: {
                    "dibuat_pada"?: string,"laporan_id": string,"pengguna_id": string
                  }
                  Update: {
                    "dibuat_pada"?: string,"laporan_id"?: string,"pengguna_id"?: string
                  }
                  Relationships: [
                    {
      foreignKeyName: "dukungan_laporan_id_fkey"
      columns: ["laporan_id"]
isOneToOne: false
      referencedRelation: "laporan"
      referencedColumns: ["id"]
    }
                  ]
                },"harga_pangan": {
                  Row: {
                    "bulan": string,"harga": number,"id": number,"komoditas": string,"satuan": string,"sumber": Database["public"]['Enums']["sumber_data"],"wilayah_id": string
                  }
                  ComputedFields: never
                  Insert: {
                    "bulan": string,"harga": number,"id"?: never,"komoditas": string,"satuan"?: string,"sumber"?: Database["public"]['Enums']["sumber_data"],"wilayah_id": string
                  }
                  Update: {
                    "bulan"?: string,"harga"?: number,"id"?: never,"komoditas"?: string,"satuan"?: string,"sumber"?: Database["public"]['Enums']["sumber_data"],"wilayah_id"?: string
                  }
                  Relationships: [
                    {
      foreignKeyName: "harga_pangan_wilayah_id_fkey"
      columns: ["wilayah_id"]
isOneToOne: false
      referencedRelation: "v_akuntabilitas_kecamatan"
      referencedColumns: ["wilayah_id"]
    },{
      foreignKeyName: "harga_pangan_wilayah_id_fkey"
      columns: ["wilayah_id"]
isOneToOne: false
      referencedRelation: "v_ringkasan_kabkota"
      referencedColumns: ["wilayah_id"]
    },{
      foreignKeyName: "harga_pangan_wilayah_id_fkey"
      columns: ["wilayah_id"]
isOneToOne: false
      referencedRelation: "v_risiko_kecamatan"
      referencedColumns: ["wilayah_id"]
    },{
      foreignKeyName: "harga_pangan_wilayah_id_fkey"
      columns: ["wilayah_id"]
isOneToOne: false
      referencedRelation: "wilayah"
      referencedColumns: ["id"]
    }
                  ]
                },"instansi": {
                  Row: {
                    "dibuat_pada": string,"id": string,"jenis": Database["public"]['Enums']["jenis_instansi"],"kontak": string | null,"nama": string,"sppg_id": string | null,"wilayah_id": string | null
                  }
                  ComputedFields: never
                  Insert: {
                    "dibuat_pada"?: string,"id"?: string,"jenis": Database["public"]['Enums']["jenis_instansi"],"kontak"?: string | null,"nama": string,"sppg_id"?: string | null,"wilayah_id"?: string | null
                  }
                  Update: {
                    "dibuat_pada"?: string,"id"?: string,"jenis"?: Database["public"]['Enums']["jenis_instansi"],"kontak"?: string | null,"nama"?: string,"sppg_id"?: string | null,"wilayah_id"?: string | null
                  }
                  Relationships: [
                    {
      foreignKeyName: "instansi_sppg_id_fkey"
      columns: ["sppg_id"]
isOneToOne: true
      referencedRelation: "sppg"
      referencedColumns: ["id"]
    },{
      foreignKeyName: "instansi_sppg_id_fkey"
      columns: ["sppg_id"]
isOneToOne: true
      referencedRelation: "v_akuntabilitas_sppg"
      referencedColumns: ["sppg_id"]
    },{
      foreignKeyName: "instansi_wilayah_id_fkey"
      columns: ["wilayah_id"]
isOneToOne: false
      referencedRelation: "v_akuntabilitas_kecamatan"
      referencedColumns: ["wilayah_id"]
    },{
      foreignKeyName: "instansi_wilayah_id_fkey"
      columns: ["wilayah_id"]
isOneToOne: false
      referencedRelation: "v_ringkasan_kabkota"
      referencedColumns: ["wilayah_id"]
    },{
      foreignKeyName: "instansi_wilayah_id_fkey"
      columns: ["wilayah_id"]
isOneToOne: false
      referencedRelation: "v_risiko_kecamatan"
      referencedColumns: ["wilayah_id"]
    },{
      foreignKeyName: "instansi_wilayah_id_fkey"
      columns: ["wilayah_id"]
isOneToOne: false
      referencedRelation: "wilayah"
      referencedColumns: ["id"]
    }
                  ]
                },"kasus": {
                  Row: {
                    "dibuat_pada": string,"diperbarui_pada": string,"ditanggapi_pada": string | null,"diteruskan_pada": string | null,"diverifikasi_pada": string,"id": string,"instansi_id": string | null,"judul": string,"jumlah_laporan": number,"jumlah_rating": number,"kategori": Database["public"]['Enums']["kategori_laporan"],"kode_kasus": string,"pernah_terlambat": boolean,"prioritas": Database["public"]['Enums']["tingkat_prioritas"],"rating_rata": number | null,"ringkasan_publik": string | null,"sekolah_id": string | null,"selesai_pada": string | null,"skor_prioritas": number,"sppg_id": string | null,"status": Database["public"]['Enums']["status_alur"],"status_sejak": string,"tenggat_tahap": string | null,"terlambat": boolean,"total_terdampak": number,"waktu_kejadian": string,"wilayah_id": string
                  }
                  ComputedFields: never
                  Insert: {
                    "dibuat_pada"?: string,"diperbarui_pada"?: string,"ditanggapi_pada"?: string | null,"diteruskan_pada"?: string | null,"diverifikasi_pada"?: string,"id"?: string,"instansi_id"?: string | null,"judul": string,"jumlah_laporan"?: number,"jumlah_rating"?: number,"kategori": Database["public"]['Enums']["kategori_laporan"],"kode_kasus": string,"pernah_terlambat"?: boolean,"prioritas"?: Database["public"]['Enums']["tingkat_prioritas"],"rating_rata"?: number | null,"ringkasan_publik"?: string | null,"sekolah_id"?: string | null,"selesai_pada"?: string | null,"skor_prioritas"?: number,"sppg_id"?: string | null,"status"?: Database["public"]['Enums']["status_alur"],"status_sejak"?: string,"tenggat_tahap"?: string | null,"terlambat"?: boolean,"total_terdampak"?: number,"waktu_kejadian": string,"wilayah_id": string
                  }
                  Update: {
                    "dibuat_pada"?: string,"diperbarui_pada"?: string,"ditanggapi_pada"?: string | null,"diteruskan_pada"?: string | null,"diverifikasi_pada"?: string,"id"?: string,"instansi_id"?: string | null,"judul"?: string,"jumlah_laporan"?: number,"jumlah_rating"?: number,"kategori"?: Database["public"]['Enums']["kategori_laporan"],"kode_kasus"?: string,"pernah_terlambat"?: boolean,"prioritas"?: Database["public"]['Enums']["tingkat_prioritas"],"rating_rata"?: number | null,"ringkasan_publik"?: string | null,"sekolah_id"?: string | null,"selesai_pada"?: string | null,"skor_prioritas"?: number,"sppg_id"?: string | null,"status"?: Database["public"]['Enums']["status_alur"],"status_sejak"?: string,"tenggat_tahap"?: string | null,"terlambat"?: boolean,"total_terdampak"?: number,"waktu_kejadian"?: string,"wilayah_id"?: string
                  }
                  Relationships: [
                    {
      foreignKeyName: "kasus_instansi_id_fkey"
      columns: ["instansi_id"]
isOneToOne: false
      referencedRelation: "instansi"
      referencedColumns: ["id"]
    },{
      foreignKeyName: "kasus_sekolah_id_fkey"
      columns: ["sekolah_id"]
isOneToOne: false
      referencedRelation: "sekolah"
      referencedColumns: ["id"]
    },{
      foreignKeyName: "kasus_sppg_id_fkey"
      columns: ["sppg_id"]
isOneToOne: false
      referencedRelation: "sppg"
      referencedColumns: ["id"]
    },{
      foreignKeyName: "kasus_sppg_id_fkey"
      columns: ["sppg_id"]
isOneToOne: false
      referencedRelation: "v_akuntabilitas_sppg"
      referencedColumns: ["sppg_id"]
    },{
      foreignKeyName: "kasus_wilayah_id_fkey"
      columns: ["wilayah_id"]
isOneToOne: false
      referencedRelation: "v_akuntabilitas_kecamatan"
      referencedColumns: ["wilayah_id"]
    },{
      foreignKeyName: "kasus_wilayah_id_fkey"
      columns: ["wilayah_id"]
isOneToOne: false
      referencedRelation: "v_ringkasan_kabkota"
      referencedColumns: ["wilayah_id"]
    },{
      foreignKeyName: "kasus_wilayah_id_fkey"
      columns: ["wilayah_id"]
isOneToOne: false
      referencedRelation: "v_risiko_kecamatan"
      referencedColumns: ["wilayah_id"]
    },{
      foreignKeyName: "kasus_wilayah_id_fkey"
      columns: ["wilayah_id"]
isOneToOne: false
      referencedRelation: "wilayah"
      referencedColumns: ["id"]
    }
                  ]
                },"laporan": {
                  Row: {
                    "alasan_tolak": string | null,"checklist_verifikasi": Json | null,"deskripsi": string,"dibuat_pada": string,"diperbarui_pada": string,"diverifikasi_oleh": string | null,"diverifikasi_pada": string | null,"grup_serupa": string | null,"id": string,"jumlah_dukungan": number,"jumlah_terdampak": number,"kasus_id": string | null,"kategori": Database["public"]['Enums']["kategori_laporan"],"klasifikasi_otomatis": Json | null,"kode_tiket": string,"komponen_kredibilitas": NonNullable<Json>,"lokasi_lat": number | null,"lokasi_lng": number | null,"mode_identitas": Database["public"]['Enums']["mode_identitas"],"pelapor_id": string,"prioritas": Database["public"]['Enums']["tingkat_prioritas"],"sekolah_id": string,"skor_kredibilitas": number,"skor_prioritas": number,"sppg_id": string | null,"status": Database["public"]['Enums']["status_alur"],"tenggat_verifikasi": string | null,"terlambat": boolean,"waktu_kejadian": string,"wilayah_id": string | null
                  }
                  ComputedFields: never
                  Insert: {
                    "alasan_tolak"?: string | null,"checklist_verifikasi"?: Json | null,"deskripsi": string,"dibuat_pada"?: string,"diperbarui_pada"?: string,"diverifikasi_oleh"?: string | null,"diverifikasi_pada"?: string | null,"grup_serupa"?: string | null,"id"?: string,"jumlah_dukungan"?: number,"jumlah_terdampak"?: number,"kasus_id"?: string | null,"kategori": Database["public"]['Enums']["kategori_laporan"],"klasifikasi_otomatis"?: Json | null,"kode_tiket"?: string,"komponen_kredibilitas"?: NonNullable<Json>,"lokasi_lat"?: number | null,"lokasi_lng"?: number | null,"mode_identitas"?: Database["public"]['Enums']["mode_identitas"],"pelapor_id": string,"prioritas"?: Database["public"]['Enums']["tingkat_prioritas"],"sekolah_id": string,"skor_kredibilitas"?: number,"skor_prioritas"?: number,"sppg_id"?: string | null,"status"?: Database["public"]['Enums']["status_alur"],"tenggat_verifikasi"?: string | null,"terlambat"?: boolean,"waktu_kejadian": string,"wilayah_id"?: string | null
                  }
                  Update: {
                    "alasan_tolak"?: string | null,"checklist_verifikasi"?: Json | null,"deskripsi"?: string,"dibuat_pada"?: string,"diperbarui_pada"?: string,"diverifikasi_oleh"?: string | null,"diverifikasi_pada"?: string | null,"grup_serupa"?: string | null,"id"?: string,"jumlah_dukungan"?: number,"jumlah_terdampak"?: number,"kasus_id"?: string | null,"kategori"?: Database["public"]['Enums']["kategori_laporan"],"klasifikasi_otomatis"?: Json | null,"kode_tiket"?: string,"komponen_kredibilitas"?: NonNullable<Json>,"lokasi_lat"?: number | null,"lokasi_lng"?: number | null,"mode_identitas"?: Database["public"]['Enums']["mode_identitas"],"pelapor_id"?: string,"prioritas"?: Database["public"]['Enums']["tingkat_prioritas"],"sekolah_id"?: string,"skor_kredibilitas"?: number,"skor_prioritas"?: number,"sppg_id"?: string | null,"status"?: Database["public"]['Enums']["status_alur"],"tenggat_verifikasi"?: string | null,"terlambat"?: boolean,"waktu_kejadian"?: string,"wilayah_id"?: string | null
                  }
                  Relationships: [
                    {
      foreignKeyName: "laporan_kasus_id_fkey"
      columns: ["kasus_id"]
isOneToOne: false
      referencedRelation: "kasus"
      referencedColumns: ["id"]
    },{
      foreignKeyName: "laporan_kasus_id_fkey"
      columns: ["kasus_id"]
isOneToOne: false
      referencedRelation: "v_kasus_publik"
      referencedColumns: ["id"]
    },{
      foreignKeyName: "laporan_sekolah_id_fkey"
      columns: ["sekolah_id"]
isOneToOne: false
      referencedRelation: "sekolah"
      referencedColumns: ["id"]
    },{
      foreignKeyName: "laporan_sppg_id_fkey"
      columns: ["sppg_id"]
isOneToOne: false
      referencedRelation: "sppg"
      referencedColumns: ["id"]
    },{
      foreignKeyName: "laporan_sppg_id_fkey"
      columns: ["sppg_id"]
isOneToOne: false
      referencedRelation: "v_akuntabilitas_sppg"
      referencedColumns: ["sppg_id"]
    },{
      foreignKeyName: "laporan_wilayah_id_fkey"
      columns: ["wilayah_id"]
isOneToOne: false
      referencedRelation: "v_akuntabilitas_kecamatan"
      referencedColumns: ["wilayah_id"]
    },{
      foreignKeyName: "laporan_wilayah_id_fkey"
      columns: ["wilayah_id"]
isOneToOne: false
      referencedRelation: "v_ringkasan_kabkota"
      referencedColumns: ["wilayah_id"]
    },{
      foreignKeyName: "laporan_wilayah_id_fkey"
      columns: ["wilayah_id"]
isOneToOne: false
      referencedRelation: "v_risiko_kecamatan"
      referencedColumns: ["wilayah_id"]
    },{
      foreignKeyName: "laporan_wilayah_id_fkey"
      columns: ["wilayah_id"]
isOneToOne: false
      referencedRelation: "wilayah"
      referencedColumns: ["id"]
    }
                  ]
                },"notifikasi": {
                  Row: {
                    "dibaca": boolean,"dibuat_pada": string,"id": number,"isi": string | null,"judul": string,"kasus_id": string | null,"laporan_id": string | null,"pengguna_id": string
                  }
                  ComputedFields: never
                  Insert: {
                    "dibaca"?: boolean,"dibuat_pada"?: string,"id"?: never,"isi"?: string | null,"judul": string,"kasus_id"?: string | null,"laporan_id"?: string | null,"pengguna_id": string
                  }
                  Update: {
                    "dibaca"?: boolean,"dibuat_pada"?: string,"id"?: never,"isi"?: string | null,"judul"?: string,"kasus_id"?: string | null,"laporan_id"?: string | null,"pengguna_id"?: string
                  }
                  Relationships: [
                    {
      foreignKeyName: "notifikasi_kasus_id_fkey"
      columns: ["kasus_id"]
isOneToOne: false
      referencedRelation: "kasus"
      referencedColumns: ["id"]
    },{
      foreignKeyName: "notifikasi_kasus_id_fkey"
      columns: ["kasus_id"]
isOneToOne: false
      referencedRelation: "v_kasus_publik"
      referencedColumns: ["id"]
    },{
      foreignKeyName: "notifikasi_laporan_id_fkey"
      columns: ["laporan_id"]
isOneToOne: false
      referencedRelation: "laporan"
      referencedColumns: ["id"]
    }
                  ]
                },"peringatan_dini": {
                  Row: {
                    "aktif": boolean,"basis": string,"dibuat_pada": string,"id": number,"jumlah_24_jam": number,"rasio": number,"rata_rata_harian": number,"sppg_id": string,"wilayah_id": string
                  }
                  ComputedFields: never
                  Insert: {
                    "aktif"?: boolean,"basis": string,"dibuat_pada"?: string,"id"?: never,"jumlah_24_jam": number,"rasio": number,"rata_rata_harian": number,"sppg_id": string,"wilayah_id": string
                  }
                  Update: {
                    "aktif"?: boolean,"basis"?: string,"dibuat_pada"?: string,"id"?: never,"jumlah_24_jam"?: number,"rasio"?: number,"rata_rata_harian"?: number,"sppg_id"?: string,"wilayah_id"?: string
                  }
                  Relationships: [
                    {
      foreignKeyName: "peringatan_dini_sppg_id_fkey"
      columns: ["sppg_id"]
isOneToOne: false
      referencedRelation: "sppg"
      referencedColumns: ["id"]
    },{
      foreignKeyName: "peringatan_dini_sppg_id_fkey"
      columns: ["sppg_id"]
isOneToOne: false
      referencedRelation: "v_akuntabilitas_sppg"
      referencedColumns: ["sppg_id"]
    },{
      foreignKeyName: "peringatan_dini_wilayah_id_fkey"
      columns: ["wilayah_id"]
isOneToOne: false
      referencedRelation: "v_akuntabilitas_kecamatan"
      referencedColumns: ["wilayah_id"]
    },{
      foreignKeyName: "peringatan_dini_wilayah_id_fkey"
      columns: ["wilayah_id"]
isOneToOne: false
      referencedRelation: "v_ringkasan_kabkota"
      referencedColumns: ["wilayah_id"]
    },{
      foreignKeyName: "peringatan_dini_wilayah_id_fkey"
      columns: ["wilayah_id"]
isOneToOne: false
      referencedRelation: "v_risiko_kecamatan"
      referencedColumns: ["wilayah_id"]
    },{
      foreignKeyName: "peringatan_dini_wilayah_id_fkey"
      columns: ["wilayah_id"]
isOneToOne: false
      referencedRelation: "wilayah"
      referencedColumns: ["id"]
    }
                  ]
                },"profil_pengguna": {
                  Row: {
                    "dibuat_pada": string,"id": string,"instansi_id": string | null,"jenis_pelapor": Database["public"]['Enums']["jenis_pelapor"] | null,"nama_tampilan": string | null,"peran": Database["public"]['Enums']["peran_pengguna"],"sekolah_id": string | null,"terverifikasi": boolean
                  }
                  ComputedFields: never
                  Insert: {
                    "dibuat_pada"?: string,"id": string,"instansi_id"?: string | null,"jenis_pelapor"?: Database["public"]['Enums']["jenis_pelapor"] | null,"nama_tampilan"?: string | null,"peran"?: Database["public"]['Enums']["peran_pengguna"],"sekolah_id"?: string | null,"terverifikasi"?: boolean
                  }
                  Update: {
                    "dibuat_pada"?: string,"id"?: string,"instansi_id"?: string | null,"jenis_pelapor"?: Database["public"]['Enums']["jenis_pelapor"] | null,"nama_tampilan"?: string | null,"peran"?: Database["public"]['Enums']["peran_pengguna"],"sekolah_id"?: string | null,"terverifikasi"?: boolean
                  }
                  Relationships: [
                    {
      foreignKeyName: "profil_pengguna_instansi_id_fkey"
      columns: ["instansi_id"]
isOneToOne: false
      referencedRelation: "instansi"
      referencedColumns: ["id"]
    },{
      foreignKeyName: "profil_pengguna_sekolah_id_fkey"
      columns: ["sekolah_id"]
isOneToOne: false
      referencedRelation: "sekolah"
      referencedColumns: ["id"]
    }
                  ]
                },"rating": {
                  Row: {
                    "dibuat_pada": string,"id": number,"kasus_id": string,"komentar": string | null,"laporan_id": string,"pengguna_id": string,"skor": number
                  }
                  ComputedFields: never
                  Insert: {
                    "dibuat_pada"?: string,"id"?: never,"kasus_id": string,"komentar"?: string | null,"laporan_id": string,"pengguna_id": string,"skor": number
                  }
                  Update: {
                    "dibuat_pada"?: string,"id"?: never,"kasus_id"?: string,"komentar"?: string | null,"laporan_id"?: string,"pengguna_id"?: string,"skor"?: number
                  }
                  Relationships: [
                    {
      foreignKeyName: "rating_kasus_id_fkey"
      columns: ["kasus_id"]
isOneToOne: false
      referencedRelation: "kasus"
      referencedColumns: ["id"]
    },{
      foreignKeyName: "rating_kasus_id_fkey"
      columns: ["kasus_id"]
isOneToOne: false
      referencedRelation: "v_kasus_publik"
      referencedColumns: ["id"]
    },{
      foreignKeyName: "rating_laporan_id_fkey"
      columns: ["laporan_id"]
isOneToOne: true
      referencedRelation: "laporan"
      referencedColumns: ["id"]
    }
                  ]
                },"ringkasan_kasus_bulanan": {
                  Row: {
                    "bulan": string,"id": number,"jumlah_kasus": number,"jumlah_korban": number,"sumber": Database["public"]['Enums']["sumber_data"],"wilayah_id": string
                  }
                  ComputedFields: never
                  Insert: {
                    "bulan": string,"id"?: never,"jumlah_kasus": number,"jumlah_korban": number,"sumber"?: Database["public"]['Enums']["sumber_data"],"wilayah_id": string
                  }
                  Update: {
                    "bulan"?: string,"id"?: never,"jumlah_kasus"?: number,"jumlah_korban"?: number,"sumber"?: Database["public"]['Enums']["sumber_data"],"wilayah_id"?: string
                  }
                  Relationships: [
                    {
      foreignKeyName: "ringkasan_kasus_bulanan_wilayah_id_fkey"
      columns: ["wilayah_id"]
isOneToOne: false
      referencedRelation: "v_akuntabilitas_kecamatan"
      referencedColumns: ["wilayah_id"]
    },{
      foreignKeyName: "ringkasan_kasus_bulanan_wilayah_id_fkey"
      columns: ["wilayah_id"]
isOneToOne: false
      referencedRelation: "v_ringkasan_kabkota"
      referencedColumns: ["wilayah_id"]
    },{
      foreignKeyName: "ringkasan_kasus_bulanan_wilayah_id_fkey"
      columns: ["wilayah_id"]
isOneToOne: false
      referencedRelation: "v_risiko_kecamatan"
      referencedColumns: ["wilayah_id"]
    },{
      foreignKeyName: "ringkasan_kasus_bulanan_wilayah_id_fkey"
      columns: ["wilayah_id"]
isOneToOne: false
      referencedRelation: "wilayah"
      referencedColumns: ["id"]
    }
                  ]
                },"sekolah": {
                  Row: {
                    "alamat": string | null,"dibuat_pada": string,"id": string,"jenjang": Database["public"]['Enums']["jenjang_sekolah"],"jumlah_siswa": number,"lat": number | null,"lng": number | null,"nama": string,"npsn": string | null,"sppg_id": string | null,"sumber": Database["public"]['Enums']["sumber_data"],"wilayah_id": string
                  }
                  ComputedFields: never
                  Insert: {
                    "alamat"?: string | null,"dibuat_pada"?: string,"id"?: string,"jenjang": Database["public"]['Enums']["jenjang_sekolah"],"jumlah_siswa": number,"lat"?: number | null,"lng"?: number | null,"nama": string,"npsn"?: string | null,"sppg_id"?: string | null,"sumber"?: Database["public"]['Enums']["sumber_data"],"wilayah_id": string
                  }
                  Update: {
                    "alamat"?: string | null,"dibuat_pada"?: string,"id"?: string,"jenjang"?: Database["public"]['Enums']["jenjang_sekolah"],"jumlah_siswa"?: number,"lat"?: number | null,"lng"?: number | null,"nama"?: string,"npsn"?: string | null,"sppg_id"?: string | null,"sumber"?: Database["public"]['Enums']["sumber_data"],"wilayah_id"?: string
                  }
                  Relationships: [
                    {
      foreignKeyName: "sekolah_sppg_id_fkey"
      columns: ["sppg_id"]
isOneToOne: false
      referencedRelation: "sppg"
      referencedColumns: ["id"]
    },{
      foreignKeyName: "sekolah_sppg_id_fkey"
      columns: ["sppg_id"]
isOneToOne: false
      referencedRelation: "v_akuntabilitas_sppg"
      referencedColumns: ["sppg_id"]
    },{
      foreignKeyName: "sekolah_wilayah_id_fkey"
      columns: ["wilayah_id"]
isOneToOne: false
      referencedRelation: "v_akuntabilitas_kecamatan"
      referencedColumns: ["wilayah_id"]
    },{
      foreignKeyName: "sekolah_wilayah_id_fkey"
      columns: ["wilayah_id"]
isOneToOne: false
      referencedRelation: "v_ringkasan_kabkota"
      referencedColumns: ["wilayah_id"]
    },{
      foreignKeyName: "sekolah_wilayah_id_fkey"
      columns: ["wilayah_id"]
isOneToOne: false
      referencedRelation: "v_risiko_kecamatan"
      referencedColumns: ["wilayah_id"]
    },{
      foreignKeyName: "sekolah_wilayah_id_fkey"
      columns: ["wilayah_id"]
isOneToOne: false
      referencedRelation: "wilayah"
      referencedColumns: ["id"]
    }
                  ]
                },"sppg": {
                  Row: {
                    "alamat": string | null,"dibuat_pada": string,"diperbarui_pada": string,"id": string,"kapasitas_porsi_harian": number,"kode": string,"lat": number | null,"lng": number | null,"mulai_beroperasi": string | null,"nama": string,"pengelola": string | null,"slhs_berlaku_sampai": string | null,"status_operasional": Database["public"]['Enums']["status_operasional"],"status_slhs": Database["public"]['Enums']["status_slhs"],"sumber": Database["public"]['Enums']["sumber_data"],"wilayah_id": string
                  }
                  ComputedFields: never
                  Insert: {
                    "alamat"?: string | null,"dibuat_pada"?: string,"diperbarui_pada"?: string,"id"?: string,"kapasitas_porsi_harian": number,"kode": string,"lat"?: number | null,"lng"?: number | null,"mulai_beroperasi"?: string | null,"nama": string,"pengelola"?: string | null,"slhs_berlaku_sampai"?: string | null,"status_operasional"?: Database["public"]['Enums']["status_operasional"],"status_slhs"?: Database["public"]['Enums']["status_slhs"],"sumber"?: Database["public"]['Enums']["sumber_data"],"wilayah_id": string
                  }
                  Update: {
                    "alamat"?: string | null,"dibuat_pada"?: string,"diperbarui_pada"?: string,"id"?: string,"kapasitas_porsi_harian"?: number,"kode"?: string,"lat"?: number | null,"lng"?: number | null,"mulai_beroperasi"?: string | null,"nama"?: string,"pengelola"?: string | null,"slhs_berlaku_sampai"?: string | null,"status_operasional"?: Database["public"]['Enums']["status_operasional"],"status_slhs"?: Database["public"]['Enums']["status_slhs"],"sumber"?: Database["public"]['Enums']["sumber_data"],"wilayah_id"?: string
                  }
                  Relationships: [
                    {
      foreignKeyName: "sppg_wilayah_id_fkey"
      columns: ["wilayah_id"]
isOneToOne: false
      referencedRelation: "v_akuntabilitas_kecamatan"
      referencedColumns: ["wilayah_id"]
    },{
      foreignKeyName: "sppg_wilayah_id_fkey"
      columns: ["wilayah_id"]
isOneToOne: false
      referencedRelation: "v_ringkasan_kabkota"
      referencedColumns: ["wilayah_id"]
    },{
      foreignKeyName: "sppg_wilayah_id_fkey"
      columns: ["wilayah_id"]
isOneToOne: false
      referencedRelation: "v_risiko_kecamatan"
      referencedColumns: ["wilayah_id"]
    },{
      foreignKeyName: "sppg_wilayah_id_fkey"
      columns: ["wilayah_id"]
isOneToOne: false
      referencedRelation: "wilayah"
      referencedColumns: ["id"]
    }
                  ]
                },"status_log": {
                  Row: {
                    "bukti_paths": (string)[],"catatan": string | null,"dari": Database["public"]['Enums']["status_alur"] | null,"dibuat_pada": string,"id": number,"jenis_tindakan": Database["public"]['Enums']["jenis_tindakan"] | null,"kasus_id": string | null,"ke": Database["public"]['Enums']["status_alur"] | null,"laporan_id": string | null,"pelaku_id": string | null,"pelaku_label": string | null,"pelaku_peran": string,"peristiwa": Database["public"]['Enums']["jenis_peristiwa"],"publik": boolean
                  }
                  ComputedFields: never
                  Insert: {
                    "bukti_paths"?: (string)[],"catatan"?: string | null,"dari"?: Database["public"]['Enums']["status_alur"] | null,"dibuat_pada"?: string,"id"?: never,"jenis_tindakan"?: Database["public"]['Enums']["jenis_tindakan"] | null,"kasus_id"?: string | null,"ke"?: Database["public"]['Enums']["status_alur"] | null,"laporan_id"?: string | null,"pelaku_id"?: string | null,"pelaku_label"?: string | null,"pelaku_peran"?: string,"peristiwa"?: Database["public"]['Enums']["jenis_peristiwa"],"publik"?: boolean
                  }
                  Update: {
                    "bukti_paths"?: (string)[],"catatan"?: string | null,"dari"?: Database["public"]['Enums']["status_alur"] | null,"dibuat_pada"?: string,"id"?: never,"jenis_tindakan"?: Database["public"]['Enums']["jenis_tindakan"] | null,"kasus_id"?: string | null,"ke"?: Database["public"]['Enums']["status_alur"] | null,"laporan_id"?: string | null,"pelaku_id"?: string | null,"pelaku_label"?: string | null,"pelaku_peran"?: string,"peristiwa"?: Database["public"]['Enums']["jenis_peristiwa"],"publik"?: boolean
                  }
                  Relationships: [
                    {
      foreignKeyName: "status_log_kasus_id_fkey"
      columns: ["kasus_id"]
isOneToOne: false
      referencedRelation: "kasus"
      referencedColumns: ["id"]
    },{
      foreignKeyName: "status_log_kasus_id_fkey"
      columns: ["kasus_id"]
isOneToOne: false
      referencedRelation: "v_kasus_publik"
      referencedColumns: ["id"]
    },{
      foreignKeyName: "status_log_laporan_id_fkey"
      columns: ["laporan_id"]
isOneToOne: false
      referencedRelation: "laporan"
      referencedColumns: ["id"]
    }
                  ]
                },"wilayah": {
                  Row: {
                    "batas": Json | null,"dibuat_pada": string,"id": string,"induk_id": string | null,"level": Database["public"]['Enums']["level_wilayah"],"nama": string,"pusat_lat": number | null,"pusat_lng": number | null
                  }
                  ComputedFields: never
                  Insert: {
                    "batas"?: Json | null,"dibuat_pada"?: string,"id": string,"induk_id"?: string | null,"level": Database["public"]['Enums']["level_wilayah"],"nama": string,"pusat_lat"?: number | null,"pusat_lng"?: number | null
                  }
                  Update: {
                    "batas"?: Json | null,"dibuat_pada"?: string,"id"?: string,"induk_id"?: string | null,"level"?: Database["public"]['Enums']["level_wilayah"],"nama"?: string,"pusat_lat"?: number | null,"pusat_lng"?: number | null
                  }
                  Relationships: [
                    {
      foreignKeyName: "wilayah_induk_id_fkey"
      columns: ["induk_id"]
isOneToOne: false
      referencedRelation: "v_akuntabilitas_kecamatan"
      referencedColumns: ["wilayah_id"]
    },{
      foreignKeyName: "wilayah_induk_id_fkey"
      columns: ["induk_id"]
isOneToOne: false
      referencedRelation: "v_ringkasan_kabkota"
      referencedColumns: ["wilayah_id"]
    },{
      foreignKeyName: "wilayah_induk_id_fkey"
      columns: ["induk_id"]
isOneToOne: false
      referencedRelation: "v_risiko_kecamatan"
      referencedColumns: ["wilayah_id"]
    },{
      foreignKeyName: "wilayah_induk_id_fkey"
      columns: ["induk_id"]
isOneToOne: false
      referencedRelation: "wilayah"
      referencedColumns: ["id"]
    }
                  ]
                }
          }
          Views: {
            "indeks_risiko": {
                  Row: {
                    "ada_rating": boolean | null,"dihitung_pada": string | null,"indeks": number | null,"jumlah_kasus": number | null,"jumlah_keracunan": number | null,"jumlah_laporan": number | null,"k": number | null,"k_mentah": number | null,"kategori_risiko": string | null,"l": number | null,"l_mentah": number | null,"p": number | null,"periode_akhir": string | null,"periode_awal": string | null,"porsi": number | null,"s": number | null,"sppg_id": string | null,"t": number | null,"wilayah_id": string | null
                  }
                  ComputedFields: never
                  Relationships: [
                    
                  ]
                },"v_akuntabilitas_kecamatan": {
                  Row: {
                    "jumlah_kasus": number | null,"jumlah_rating": number | null,"kasus_selesai": number | null,"kasus_tidak_ditanggapi": number | null,"kepuasan": number | null,"nama": string | null,"persen_selesai": number | null,"persen_terlambat": number | null,"rata_jam_respons": number | null,"wilayah_id": string | null
                  }
                  ComputedFields: never
                  Relationships: [
                    
                  ]
                },"v_akuntabilitas_sppg": {
                  Row: {
                    "jumlah_kasus": number | null,"jumlah_rating": number | null,"kasus_selesai": number | null,"kasus_tidak_ditanggapi": number | null,"kecamatan_nama": string | null,"kepuasan": number | null,"nama": string | null,"persen_selesai": number | null,"persen_terlambat": number | null,"rata_jam_respons": number | null,"sppg_id": string | null,"status_operasional": Database["public"]['Enums']["status_operasional"] | null,"status_slhs": Database["public"]['Enums']["status_slhs"] | null,"wilayah_id": string | null
                  }
                  ComputedFields: never
                  Relationships: [
                    {
      foreignKeyName: "sppg_wilayah_id_fkey"
      columns: ["wilayah_id"]
isOneToOne: false
      referencedRelation: "v_akuntabilitas_kecamatan"
      referencedColumns: ["wilayah_id"]
    },{
      foreignKeyName: "sppg_wilayah_id_fkey"
      columns: ["wilayah_id"]
isOneToOne: false
      referencedRelation: "v_ringkasan_kabkota"
      referencedColumns: ["wilayah_id"]
    },{
      foreignKeyName: "sppg_wilayah_id_fkey"
      columns: ["wilayah_id"]
isOneToOne: false
      referencedRelation: "v_risiko_kecamatan"
      referencedColumns: ["wilayah_id"]
    },{
      foreignKeyName: "sppg_wilayah_id_fkey"
      columns: ["wilayah_id"]
isOneToOne: false
      referencedRelation: "wilayah"
      referencedColumns: ["id"]
    }
                  ]
                },"v_anggaran": {
                  Row: {
                    "bulan": string | null,"induk_id": string | null,"jumlah_penerima": number | null,"jumlah_sppg": number | null,"level": Database["public"]['Enums']["level_wilayah"] | null,"nama": string | null,"pagu": number | null,"persen_realisasi": number | null,"realisasi": number | null,"realisasi_per_penerima": number | null,"sumber": Database["public"]['Enums']["sumber_data"] | null,"wilayah_id": string | null
                  }
                  ComputedFields: never
                  Relationships: [
                    {
      foreignKeyName: "anggaran_bulanan_wilayah_id_fkey"
      columns: ["wilayah_id"]
isOneToOne: false
      referencedRelation: "v_akuntabilitas_kecamatan"
      referencedColumns: ["wilayah_id"]
    },{
      foreignKeyName: "anggaran_bulanan_wilayah_id_fkey"
      columns: ["wilayah_id"]
isOneToOne: false
      referencedRelation: "v_ringkasan_kabkota"
      referencedColumns: ["wilayah_id"]
    },{
      foreignKeyName: "anggaran_bulanan_wilayah_id_fkey"
      columns: ["wilayah_id"]
isOneToOne: false
      referencedRelation: "v_risiko_kecamatan"
      referencedColumns: ["wilayah_id"]
    },{
      foreignKeyName: "anggaran_bulanan_wilayah_id_fkey"
      columns: ["wilayah_id"]
isOneToOne: false
      referencedRelation: "wilayah"
      referencedColumns: ["id"]
    },{
      foreignKeyName: "wilayah_induk_id_fkey"
      columns: ["induk_id"]
isOneToOne: false
      referencedRelation: "v_akuntabilitas_kecamatan"
      referencedColumns: ["wilayah_id"]
    },{
      foreignKeyName: "wilayah_induk_id_fkey"
      columns: ["induk_id"]
isOneToOne: false
      referencedRelation: "v_ringkasan_kabkota"
      referencedColumns: ["wilayah_id"]
    },{
      foreignKeyName: "wilayah_induk_id_fkey"
      columns: ["induk_id"]
isOneToOne: false
      referencedRelation: "v_risiko_kecamatan"
      referencedColumns: ["wilayah_id"]
    },{
      foreignKeyName: "wilayah_induk_id_fkey"
      columns: ["induk_id"]
isOneToOne: false
      referencedRelation: "wilayah"
      referencedColumns: ["id"]
    }
                  ]
                },"v_anggaran_provinsi": {
                  Row: {
                    "bulan": string | null,"jumlah_penerima": number | null,"jumlah_sppg": number | null,"pagu": number | null,"persen_realisasi": number | null,"realisasi": number | null,"sumber": Database["public"]['Enums']["sumber_data"] | null
                  }
                  ComputedFields: never
                  Relationships: [
                    
                  ]
                },"v_kasus_kecamatan_bulanan": {
                  Row: {
                    "bulan": string | null,"jumlah_kasus": number | null,"jumlah_terdampak": number | null,"kategori": Database["public"]['Enums']["kategori_laporan"] | null,"sumber": Database["public"]['Enums']["sumber_data"] | null,"wilayah_id": string | null
                  }
                  ComputedFields: never
                  Relationships: [
                    {
      foreignKeyName: "kasus_wilayah_id_fkey"
      columns: ["wilayah_id"]
isOneToOne: false
      referencedRelation: "v_akuntabilitas_kecamatan"
      referencedColumns: ["wilayah_id"]
    },{
      foreignKeyName: "kasus_wilayah_id_fkey"
      columns: ["wilayah_id"]
isOneToOne: false
      referencedRelation: "v_ringkasan_kabkota"
      referencedColumns: ["wilayah_id"]
    },{
      foreignKeyName: "kasus_wilayah_id_fkey"
      columns: ["wilayah_id"]
isOneToOne: false
      referencedRelation: "v_risiko_kecamatan"
      referencedColumns: ["wilayah_id"]
    },{
      foreignKeyName: "kasus_wilayah_id_fkey"
      columns: ["wilayah_id"]
isOneToOne: false
      referencedRelation: "wilayah"
      referencedColumns: ["id"]
    }
                  ]
                },"v_kasus_keracunan_bulanan": {
                  Row: {
                    "bulan": string | null,"jumlah_kasus": number | null,"jumlah_korban": number | null,"sumber": Database["public"]['Enums']["sumber_data"] | null,"wilayah_id": string | null
                  }
                  ComputedFields: never
                  Insert: {
                           "bulan"?: string | null,"jumlah_kasus"?: number | null,"jumlah_korban"?: number | null,"sumber"?: Database["public"]['Enums']["sumber_data"] | null,"wilayah_id"?: string | null
                         }
                        Update: {
                           "bulan"?: string | null,"jumlah_kasus"?: number | null,"jumlah_korban"?: number | null,"sumber"?: Database["public"]['Enums']["sumber_data"] | null,"wilayah_id"?: string | null
                         }
                        Relationships: [
                    {
      foreignKeyName: "ringkasan_kasus_bulanan_wilayah_id_fkey"
      columns: ["wilayah_id"]
isOneToOne: false
      referencedRelation: "v_akuntabilitas_kecamatan"
      referencedColumns: ["wilayah_id"]
    },{
      foreignKeyName: "ringkasan_kasus_bulanan_wilayah_id_fkey"
      columns: ["wilayah_id"]
isOneToOne: false
      referencedRelation: "v_ringkasan_kabkota"
      referencedColumns: ["wilayah_id"]
    },{
      foreignKeyName: "ringkasan_kasus_bulanan_wilayah_id_fkey"
      columns: ["wilayah_id"]
isOneToOne: false
      referencedRelation: "v_risiko_kecamatan"
      referencedColumns: ["wilayah_id"]
    },{
      foreignKeyName: "ringkasan_kasus_bulanan_wilayah_id_fkey"
      columns: ["wilayah_id"]
isOneToOne: false
      referencedRelation: "wilayah"
      referencedColumns: ["id"]
    }
                  ]
                },"v_kasus_publik": {
                  Row: {
                    "ditanggapi_pada": string | null,"diteruskan_pada": string | null,"diverifikasi_pada": string | null,"id": string | null,"instansi_id": string | null,"instansi_jenis": Database["public"]['Enums']["jenis_instansi"] | null,"instansi_nama": string | null,"judul": string | null,"jumlah_laporan": number | null,"jumlah_rating": number | null,"kabkota_id": string | null,"kategori": Database["public"]['Enums']["kategori_laporan"] | null,"kecamatan_nama": string | null,"kode_kasus": string | null,"pernah_terlambat": boolean | null,"prioritas": Database["public"]['Enums']["tingkat_prioritas"] | null,"rating_rata": number | null,"ringkasan_publik": string | null,"sekolah_id": string | null,"sekolah_jenjang": Database["public"]['Enums']["jenjang_sekolah"] | null,"sekolah_nama": string | null,"selesai_pada": string | null,"skor_prioritas": number | null,"sppg_id": string | null,"sppg_nama": string | null,"status": Database["public"]['Enums']["status_alur"] | null,"status_sejak": string | null,"tenggat_tahap": string | null,"terlambat": boolean | null,"tidak_ditanggapi": boolean | null,"total_terdampak": number | null,"waktu_kejadian": string | null,"wilayah_id": string | null
                  }
                  ComputedFields: never
                  Relationships: [
                    {
      foreignKeyName: "kasus_instansi_id_fkey"
      columns: ["instansi_id"]
isOneToOne: false
      referencedRelation: "instansi"
      referencedColumns: ["id"]
    },{
      foreignKeyName: "kasus_sekolah_id_fkey"
      columns: ["sekolah_id"]
isOneToOne: false
      referencedRelation: "sekolah"
      referencedColumns: ["id"]
    },{
      foreignKeyName: "kasus_sppg_id_fkey"
      columns: ["sppg_id"]
isOneToOne: false
      referencedRelation: "sppg"
      referencedColumns: ["id"]
    },{
      foreignKeyName: "kasus_sppg_id_fkey"
      columns: ["sppg_id"]
isOneToOne: false
      referencedRelation: "v_akuntabilitas_sppg"
      referencedColumns: ["sppg_id"]
    },{
      foreignKeyName: "kasus_wilayah_id_fkey"
      columns: ["wilayah_id"]
isOneToOne: false
      referencedRelation: "v_akuntabilitas_kecamatan"
      referencedColumns: ["wilayah_id"]
    },{
      foreignKeyName: "kasus_wilayah_id_fkey"
      columns: ["wilayah_id"]
isOneToOne: false
      referencedRelation: "v_ringkasan_kabkota"
      referencedColumns: ["wilayah_id"]
    },{
      foreignKeyName: "kasus_wilayah_id_fkey"
      columns: ["wilayah_id"]
isOneToOne: false
      referencedRelation: "v_risiko_kecamatan"
      referencedColumns: ["wilayah_id"]
    },{
      foreignKeyName: "kasus_wilayah_id_fkey"
      columns: ["wilayah_id"]
isOneToOne: false
      referencedRelation: "wilayah"
      referencedColumns: ["id"]
    },{
      foreignKeyName: "wilayah_induk_id_fkey"
      columns: ["kabkota_id"]
isOneToOne: false
      referencedRelation: "v_akuntabilitas_kecamatan"
      referencedColumns: ["wilayah_id"]
    },{
      foreignKeyName: "wilayah_induk_id_fkey"
      columns: ["kabkota_id"]
isOneToOne: false
      referencedRelation: "v_ringkasan_kabkota"
      referencedColumns: ["wilayah_id"]
    },{
      foreignKeyName: "wilayah_induk_id_fkey"
      columns: ["kabkota_id"]
isOneToOne: false
      referencedRelation: "v_risiko_kecamatan"
      referencedColumns: ["wilayah_id"]
    },{
      foreignKeyName: "wilayah_induk_id_fkey"
      columns: ["kabkota_id"]
isOneToOne: false
      referencedRelation: "wilayah"
      referencedColumns: ["id"]
    }
                  ]
                },"v_ringkasan_kabkota": {
                  Row: {
                    "bulan": string | null,"jumlah_penerima": number | null,"jumlah_sppg": number | null,"kasus_keracunan_3_bulan": number | null,"kasus_per_100rb_penerima": number | null,"korban_keracunan_3_bulan": number | null,"nama": string | null,"pagu": number | null,"persen_realisasi": number | null,"pusat_lat": number | null,"pusat_lng": number | null,"realisasi": number | null,"wilayah_id": string | null
                  }
                  ComputedFields: never
                  Relationships: [
                    
                  ]
                },"v_risiko_kecamatan": {
                  Row: {
                    "induk_id": string | null,"jumlah_sppg": number | null,"nama": string | null,"skor_rata_berbobot": number | null,"skor_tertinggi": number | null,"sppg_tertinggi_id": string | null,"wilayah_id": string | null
                  }
                  ComputedFields: never
                  Relationships: [
                    {
      foreignKeyName: "wilayah_induk_id_fkey"
      columns: ["induk_id"]
isOneToOne: false
      referencedRelation: "v_akuntabilitas_kecamatan"
      referencedColumns: ["wilayah_id"]
    },{
      foreignKeyName: "wilayah_induk_id_fkey"
      columns: ["induk_id"]
isOneToOne: false
      referencedRelation: "v_ringkasan_kabkota"
      referencedColumns: ["wilayah_id"]
    },{
      foreignKeyName: "wilayah_induk_id_fkey"
      columns: ["induk_id"]
isOneToOne: false
      referencedRelation: "v_risiko_kecamatan"
      referencedColumns: ["wilayah_id"]
    },{
      foreignKeyName: "wilayah_induk_id_fkey"
      columns: ["induk_id"]
isOneToOne: false
      referencedRelation: "wilayah"
      referencedColumns: ["id"]
    }
                  ]
                }
          }
          Functions: {
            "adalah_admin":
{ Args: Record<PropertyKey, never>; Returns: boolean
                           },
"adalah_staf":
{ Args: Record<PropertyKey, never>; Returns: boolean
                           },
"atur_peran_pengguna":
{ Args: { "p_instansi_id"?: string,"p_pengguna_id": string,"p_peran": Database["public"]['Enums']["peran_pengguna"],"p_terverifikasi"?: boolean }; Returns: undefined
                           },
"batas_sla":
{ Args: { "p_kategori": Database["public"]['Enums']["kategori_laporan"],"p_tahap": Database["public"]['Enums']["status_alur"] }; Returns: string
                           },
"beri_rating":
{ Args: { "p_komentar"?: string,"p_laporan_id": string,"p_skor": number }; Returns: undefined
                           },
"boleh_lihat_bukti":
{ Args: { "p_path": string }; Returns: boolean
                           },
"buat_kode":
{ Args: { "p_awalan": string,"p_panjang"?: number }; Returns: string
                           },
"buka_ulang_kasus":
{ Args: { "p_alasan": string,"p_laporan_id": string }; Returns: undefined
                           },
"bukti_publik_kasus":
{ Args: { "p_kasus_id": string }; Returns: {
              "jenis": Database["public"]['Enums']["jenis_bukti"],"kategori": Database["public"]['Enums']["kategori_laporan"],"path_storage": string
            }[]
                           },
"cari_laporan_serupa":
{ Args: { "p_kategori": Database["public"]['Enums']["kategori_laporan"],"p_sekolah_id": string,"p_waktu"?: string }; Returns: {
              "grup_serupa": string,"jumlah_dukungan": number,"jumlah_laporan": number,"laporan_pertama": string
            }[]
                           },
"cek_status_tiket":
{ Args: { "p_kode": string }; Returns: Json
                           },
"deteksi_lonjakan":
{ Args: Record<PropertyKey, never>; Returns: number
                           },
"dukung_laporan":
{ Args: { "p_grup_serupa": string }; Returns: number
                           },
"hitung_indeks_risiko":
{ Args: { "p_akhir"?: string,"p_hari"?: number }; Returns: {
              "ada_rating": boolean,"indeks": number,"jumlah_kasus": number,"jumlah_keracunan": number,"jumlah_laporan": number,"k": number,"k_mentah": number,"kategori_risiko": string,"l": number,"l_mentah": number,"p": number,"periode_akhir": string,"periode_awal": string,"porsi": number,"s": number,"sppg_id": string,"t": number,"wilayah_id": string
            }[]
                           },
"hitung_skor_prioritas":
{ Args: { "p_dukungan": number,"p_kategori": Database["public"]['Enums']["kategori_laporan"],"p_kredibilitas": number,"p_risiko_sppg": number,"p_terdampak": number,"p_terlambat": boolean }; Returns: number
                           },
"identitas_pelapor":
{ Args: { "p_laporan_id": string }; Returns: Json
                           },
"instansi_saya":
{ Args: Record<PropertyKey, never>; Returns: string
                           },
"label_kategori":
{ Args: { "p": Database["public"]['Enums']["kategori_laporan"] }; Returns: string
                           },
"label_status":
{ Args: { "p": Database["public"]['Enums']["status_alur"] }; Returns: string
                           },
"peran_saya":
{ Args: Record<PropertyKey, never>; Returns: Database["public"]['Enums']["peran_pengguna"]
                           },
"proses_sla":
{ Args: Record<PropertyKey, never>; Returns: number
                           },
"riwayat_indeks_sppg":
{ Args: { "p_minggu"?: number,"p_sppg_id": string }; Returns: {
              "indeks": number,"kategori_risiko": string,"periode_akhir": string
            }[]
                           },
"segarkan_indeks_risiko":
{ Args: Record<PropertyKey, never>; Returns: undefined
                           },
"segarkan_kasus":
{ Args: { "p_kasus_id": string }; Returns: undefined
                           },
"segarkan_skor_laporan":
{ Args: { "p_laporan_id": string }; Returns: undefined
                           },
"selesaikan_kasus":
{ Args: { "p_bukti_paths"?: (string)[],"p_catatan": string,"p_kasus_id": string }; Returns: undefined
                           },
"skor_risiko_sppg":
{ Args: { "p_sppg_id": string }; Returns: number
                           },
"statistik_publik":
{ Args: Record<PropertyKey, never>; Returns: Json
                           },
"teruskan_kasus":
{ Args: { "p_catatan"?: string,"p_instansi_id": string,"p_kasus_id": string }; Returns: undefined
                           },
"timeline_kasus":
{ Args: { "p_kasus_id": string }; Returns: {
              "bukti": (string)[],"catatan": string,"dari": Database["public"]['Enums']["status_alur"],"jenis_tindakan": Database["public"]['Enums']["jenis_tindakan"],"ke": Database["public"]['Enums']["status_alur"],"pelaku": string,"peristiwa": Database["public"]['Enums']["jenis_peristiwa"],"waktu": string
            }[]
                           },
"tindak_lanjut_kasus":
{ Args: { "p_bukti_paths"?: (string)[],"p_catatan": string,"p_jenis": Database["public"]['Enums']["jenis_tindakan"],"p_kasus_id": string }; Returns: undefined
                           },
"tingkat_prioritas_dari":
{ Args: { "p_kategori": Database["public"]['Enums']["kategori_laporan"],"p_skor": number }; Returns: Database["public"]['Enums']["tingkat_prioritas"]
                           },
"tolak_laporan":
{ Args: { "p_alasan": string,"p_checklist"?: Json,"p_laporan_id": string }; Returns: undefined
                           },
"verifikasi_laporan":
{ Args: { "p_catatan"?: string,"p_checklist"?: Json,"p_judul"?: string,"p_kasus_id"?: string,"p_laporan_ids": (string)[] }; Returns: string
                           },
"wajib_peran":
{ Args: { "p_peran": (Database["public"]['Enums']["peran_pengguna"])[] }; Returns: undefined
                           }
          }
          Enums: {
            "jenis_bukti": "foto"|"video","jenis_instansi": "sppg"|"korwil_bgn"|"dinas_kesehatan"|"dinas_pendidikan"|"ombudsman","jenis_pelapor": "orang_tua"|"siswa"|"guru"|"warga"|"sekolah"|"komite_sekolah"|"kader_posyandu","jenis_peristiwa": "perubahan_status"|"tindak_lanjut"|"penggabungan"|"eskalasi"|"catatan","jenis_tindakan": "inspeksi"|"penutupan_sementara"|"perbaikan"|"klarifikasi"|"pembinaan"|"lainnya","jenjang_sekolah": "paud"|"sd"|"smp"|"sma"|"smk"|"slb","kategori_laporan": "keracunan"|"makanan_tidak_layak"|"kebersihan"|"gizi_porsi"|"distribusi"|"pengadaan"|"lainnya","level_wilayah": "provinsi"|"kabkota"|"kecamatan","mode_identitas": "publik"|"rahasia"|"anonim","peran_pengguna": "pelapor"|"verifikator"|"instansi"|"admin","status_alur": "diterima"|"diverifikasi"|"diteruskan"|"ditindaklanjuti"|"selesai"|"ditolak"|"dibuka_ulang","status_operasional": "persiapan"|"beroperasi"|"ditutup_sementara"|"ditutup","status_slhs": "berlaku"|"kedaluwarsa"|"proses"|"tidak_ada","sumber_data": "resmi"|"masyarakat_sipil"|"laporan_warga_terverifikasi"|"simulasi","tingkat_prioritas": "rendah"|"sedang"|"tinggi"|"darurat"
          }
          CompositeTypes: {
            [_ in never]: never
          }
        }
}

type DatabaseWithoutInternals = Omit<Database, '__InternalSupabase'>

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never
> = DefaultSchemaTableNameOrOptions extends { schema: keyof DatabaseWithoutInternals }
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
  ? (DefaultSchema["Tables"] & DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
      Row: infer R
    }
    ? R
    : never
  : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = DefaultSchemaTableNameOrOptions extends { schema: keyof DatabaseWithoutInternals }
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
  ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
      Insert: infer I
    }
    ? I
    : never
  : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = DefaultSchemaTableNameOrOptions extends { schema: keyof DatabaseWithoutInternals }
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
  ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
      Update: infer U
    }
    ? U
    : never
  : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof DatabaseWithoutInternals }
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
  ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
  : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never
> = PublicCompositeTypeNameOrOptions extends { schema: keyof DatabaseWithoutInternals }
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
  ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
  : never

export const Constants = {
  "graphql_public": {
          Enums: {
            
          }
        },"public": {
          Enums: {
            "jenis_bukti": ["foto", "video"],"jenis_instansi": ["sppg", "korwil_bgn", "dinas_kesehatan", "dinas_pendidikan", "ombudsman"],"jenis_pelapor": ["orang_tua", "siswa", "guru", "warga", "sekolah", "komite_sekolah", "kader_posyandu"],"jenis_peristiwa": ["perubahan_status", "tindak_lanjut", "penggabungan", "eskalasi", "catatan"],"jenis_tindakan": ["inspeksi", "penutupan_sementara", "perbaikan", "klarifikasi", "pembinaan", "lainnya"],"jenjang_sekolah": ["paud", "sd", "smp", "sma", "smk", "slb"],"kategori_laporan": ["keracunan", "makanan_tidak_layak", "kebersihan", "gizi_porsi", "distribusi", "pengadaan", "lainnya"],"level_wilayah": ["provinsi", "kabkota", "kecamatan"],"mode_identitas": ["publik", "rahasia", "anonim"],"peran_pengguna": ["pelapor", "verifikator", "instansi", "admin"],"status_alur": ["diterima", "diverifikasi", "diteruskan", "ditindaklanjuti", "selesai", "ditolak", "dibuka_ulang"],"status_operasional": ["persiapan", "beroperasi", "ditutup_sementara", "ditutup"],"status_slhs": ["berlaku", "kedaluwarsa", "proses", "tidak_ada"],"sumber_data": ["resmi", "masyarakat_sipil", "laporan_warga_terverifikasi", "simulasi"],"tingkat_prioritas": ["rendah", "sedang", "tinggi", "darurat"]
          }
        }
} as const
