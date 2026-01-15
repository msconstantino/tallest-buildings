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
  { name: "Taipei 101", city: "Taipei", country: "Taiwan", height: 508, floors: 101, year: 2004, cost: 1800000000, lat: 25.0340, lon: 121.5645 },
  { name: "Shanghai World Financial Center", city: "Shanghai", country: "China", height: 492, floors: 101, year: 2008, cost: 1200000000, lat: 31.2397, lon: 121.4998 },
  { name: "International Commerce Centre", city: "Hong Kong", country: "China", height: 484, floors: 118, year: 2010, cost: 2000000000, lat: 22.3039, lon: 114.1594 },
  { name: "Lakhta Center", city: "Saint Petersburg", country: "Russia", height: 462, floors: 87, year: 2019, cost: 1800000000, lat: 59.9864, lon: 30.1772 },
  { name: "Landmark 81", city: "Ho Chi Minh City", country: "Vietnam", height: 461, floors: 81, year: 2018, cost: 1200000000, lat: 10.7944, lon: 106.7219 },
  { name: "Changsha IFS Tower T1", city: "Changsha", country: "China", height: 452, floors: 94, year: 2018, cost: 1500000000, lat: 28.1944, lon: 112.9711 },
  { name: "Petronas Tower 1", city: "Kuala Lumpur", country: "Malaysia", height: 452, floors: 88, year: 1998, cost: 1600000000, lat: 3.1578, lon: 101.7117 },
  { name: "Petronas Tower 2", city: "Kuala Lumpur", country: "Malaysia", height: 452, floors: 88, year: 1998, cost: 1600000000, lat: 3.1583, lon: 101.7118 },
  { name: "Zifeng Tower", city: "Nanjing", country: "China", height: 450, floors: 89, year: 2010, cost: 1200000000, lat: 32.0603, lon: 118.7781 },
  { name: "Suyong Bay Tower", city: "Busan", country: "South Korea", height: 411, floors: 101, year: 2019, cost: 1000000000, lat: 35.1581, lon: 129.1604 },
  { name: "Empire State Building", city: "New York", country: "USA", height: 381, floors: 102, year: 1931, cost: 40948900, lat: 40.7484, lon: -73.9857 },
  { name: "Bank of China Tower", city: "Hong Kong", country: "China", height: 367, floors: 72, year: 1990, cost: 1000000000, lat: 22.2794, lon: 114.1589 },
  { name: "Almas Tower", city: "Dubai", country: "UAE", height: 363, floors: 68, year: 2009, cost: 200000000, lat: 25.0658, lon: 55.1414 },
  { name: "JW Marriott Marquis Dubai Tower 1", city: "Dubai", country: "UAE", height: 355, floors: 82, year: 2012, cost: 300000000, lat: 25.1972, lon: 55.2744 },
  { name: "Emirates Tower One", city: "Dubai", country: "UAE", height: 355, floors: 54, year: 2000, cost: 250000000, lat: 25.2188, lon: 55.2794 },
]
