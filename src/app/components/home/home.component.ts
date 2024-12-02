import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CarService } from '../../services/car.service';
import { Car } from '../../models/car.model';
import { CarDialogComponent } from '../car-dialog/car-dialog.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { Filter } from '../../models/filter.model';
import { FilterService } from '../../services/filter.service';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  imports: [
    MatFormFieldModule,
    MatCardModule,
    CommonModule,
    FormsModule,
    MatInputModule,
    MatGridListModule,
    MatIconModule,
    MatChipsModule,
    MatTooltipModule
  ],
})
export class HomeComponent implements OnInit {
  cars: Car[] = [];
  savedFilters: Filter[] = [];

  public filters: Filter = {
    name: null,
    mpg_min: null,
    mpg_max: null,
    cylinders: null,
    displacement_min: null,
    displacement_max: null,
    horsepower_min: null,
    horsepower_max: null,
    weight_min: null,
    weight_max: null,
    acceleration_min: null,
    acceleration_max: null,
    model_year: null,
    origin: null
    // Add other filters here
  };

  constructor(private carService: CarService, private filterService: FilterService, private dialog: MatDialog) { }

  ngOnInit(): void {
    this.loadCars();
    this.loadFilters();
  }

  loadCars(): void {
    this.carService.getCars(this.filters).subscribe(cars => (this.cars = cars));
    this.loadFilters();
  }

  loadFilters(): void {
    this.filterService.getFilters().subscribe(filters => (this.savedFilters = filters));
  }

  applyHistoricalFilter(filter: Filter) {
    // Convert the historical filter format to current format
    this.filters = {
      name: filter.name,
      mpg_min: filter.mpg_min,
      mpg_max: filter.mpg_max,
      cylinders: filter.cylinders,
      displacement_min: filter.displacement_min,
      displacement_max: filter.displacement_max,
      horsepower_min: filter.horsepower_min,
      horsepower_max: filter.horsepower_max,
      weight_min: filter.weight_max,
      weight_max: filter.weight_max,
      acceleration_min: filter.acceleration_min,
      acceleration_max: filter.acceleration_max,
      model_year: filter.model_year,
      origin: filter.origin

    };
    this.loadCars();
  }

  getFilterDisplayText(filter: Filter): string {
    const parts: string[] = [];
    if (filter.name) {
      parts.push(`Name: ${filter.name}`);
    }
    if (filter.mpg_min || filter.mpg_max) {
      parts.push(`MPG: ${filter.mpg_min || '*'}-${filter.mpg_max || '*'}`);
    }
    if (filter.horsepower_min || filter.horsepower_max) {
      parts.push(`HP: ${filter.horsepower_min || '*'}-${filter.horsepower_max || '*'}`);
    }
    if (filter.cylinders) {
      parts.push(`Cylinders: ${filter.cylinders}`);
    }
    if (filter.displacement_min || filter.displacement_max) {
      parts.push(`Displacement: ${filter.displacement_min || '*'}-${filter.displacement_max || '*'}`);
    }
    if (filter.weight_min || filter.weight_max) {
      parts.push(`Weight: ${filter.weight_min || '*'}-${filter.weight_max || '*'}`);
    }
    if (filter.acceleration_min || filter.acceleration_max) {
      parts.push(`Acceleration: ${filter.acceleration_min || '*'}-${filter.acceleration_max || '*'}`);
    }
    if (filter.model_year) {
      parts.push(`Model Year: ${filter.model_year}`);
    }
    if (filter.origin) {
      parts.push(`Origin: ${filter.origin}`);
    }
    if (filter.createdAt) {
      parts.push(`Created date: ${filter.createdAt}`);
    }


    return parts.join(', ');
  }

  openCarDialog(car: Car): void {
    const dialogRef = this.dialog.open(CarDialogComponent, {
      width: '600px',
      data: car,
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) this.loadCars();
    });
  }
}
