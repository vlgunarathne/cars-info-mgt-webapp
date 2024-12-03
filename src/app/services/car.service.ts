import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Car } from '../models/car.model';
import { carServiceApiUrl } from '../app.config';

@Injectable({
  providedIn: 'root',
})
export class CarService {
  private apiUrl = `${carServiceApiUrl}/cars`; // Replace with your API URL

  constructor(private http: HttpClient) { }

  getCars(filters?: any): Observable<Car[]> {
    let params = new HttpParams();
    if (filters) {
      Object.keys(filters).forEach(key => {
        if (filters[key] !== null && filters[key] !== undefined) {
          params = params.set(key, filters[key]);
        }
      });
    }
    return this.http.get<Car[]>(this.apiUrl, { params });
  }

  getCarById(id: string): Observable<Car> {
    return this.http.get<Car>(`${this.apiUrl}/${id}`);
  }

  createCar(car: Car): Observable<Car> {
    return this.http.post<Car>(this.apiUrl, car);
  }

  updateCar(id: string, car: Car): Observable<Car> {
    return this.http.put<Car>(`${this.apiUrl}/${id}`, car);
  }

  deleteCar(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  exportToCsv(cars: Car[]): void {
    // Define CSV headers
    const headers = ['Name', 'MPG', 'Cylinders', 'Displacement', 'Horsepower',
      'Weight', 'Acceleration', 'Model Year', 'Origin'];

    // Convert cars data to CSV rows
    const csvData = cars.map(car => [
      car.name,
      car.mpg,
      car.cylinders,
      car.displacement,
      car.horsepower,
      car.weight,
      car.acceleration,
      car.model_year,
      car.origin
    ]);

    // Combine headers and data
    const csvContent = [
      headers.join(','),
      ...csvData.map(row => row.join(','))
    ].join('\n');

    // Create and trigger download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);

    link.setAttribute('href', url);
    link.setAttribute('download', 'cars_export.csv');
    link.style.visibility = 'hidden';

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

}
