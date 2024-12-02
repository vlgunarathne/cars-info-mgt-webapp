export interface Filter {
  id: string | null,
  name: string | null,
  mpg_min: number | null,
  mpg_max: number | null,
  cylinders: number | null,
  displacement_min: number | null,
  displacement_max: number | null,
  horsepower_min: number | null,
  horsepower_max: number | null,
  weight_min: number | null,
  weight_max: number | null,
  acceleration_min: number | null,
  acceleration_max: number | null,
  model_year: number | null,
  origin: string | null,
  createdAt?: Date
}
