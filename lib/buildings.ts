export interface Building {
  name: string
  city: string
  country: string
  height: number
  floors: number
  year: number
  cost: number
  lat: number
  lon: number
}

export const buildings: Building[] = [
  { name: "Burj Khalifa", city: "Dubai", country: "UAE", height: 828, floors: 163, year: 2010, cost: 1500000000, lat: 25.1972, lon: 55.2744 },
  { name: "Merdeka 118", city: "Kuala Lumpur", country: "Malaysia", height: 679, floors: 118, year: 2023, cost: 1200000000, lat: 3.1412, lon: 101.6865 },
  { name: "Shanghai Tower", city: "Shanghai", country: "China", height: 632, floors: 128, year: 2015, cost: 2400000000, lat: 31.2304, lon: 121.4737 },
  { name: "Abraj Al-Bait Clock Tower", city: "Mecca", country: "Saudi Arabia", height: 601, floors: 120, year: 2012, cost: 15000000000, lat: 21.4225, lon: 39.8262 },
  { name: "Ping An Finance Centre", city: "Shenzhen", country: "China", height: 599, floors: 115, year: 2017, cost: 1500000000, lat: 22.5350, lon: 114.0540 },
  { name: "Lotte World Tower", city: "Seoul", country: "South Korea", height: 555, floors: 123, year: 2017, cost: 3200000000, lat: 37.5125, lon: 127.1028 },
  { name: "One World Trade Center", city: "New York", country: "USA", height: 541, floors: 104, year: 2014, cost: 3900000000, lat: 40.7128, lon: -74.0135 },
  { name: "Guangzhou CTF Finance Centre", city: "Guangzhou", country: "China", height: 530, floors: 111, year: 2016, cost: 1500000000, lat: 23.1291, lon: 113.2644 },
  { name: "Tianjin CTF Finance Centre", city: "Tianjin", country: "China", height: 530, floors: 97, year: 2019, cost: 1200000000, lat: 39.0402, lon: 117.2000 },
  { name: "China Zun", city: "Beijing", country: "China", height: 528, floors: 108, year: 2018, cost: 3200000000, lat: 39.9042, lon: 116.4074 },
]
