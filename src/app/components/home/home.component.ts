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
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';

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
    MatTooltipModule,
    MatSnackBarModule,
    MatButtonModule,
    MatMenuModule,
    CommonModule
  ],
})
export class HomeComponent implements OnInit {
  cars: Car[] = [];
  savedFilters: Filter[] = [];
  currentSort: 'asc' | 'desc' | null = null;
  private unsortedCars: Car[] = [];

  public filters: Filter = {
    id: null,
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

  constructor(
    private carService: CarService,
    private filterService: FilterService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.loadCars();
    this.loadFilters();
  }

  loadCars(): void {
    this.carService.getCars(this.filters).subscribe({
      next: (cars) => {
        this.unsortedCars = [...cars]; // Store original order
        this.cars = [...cars];
        if (this.currentSort) {
          this.applySorting(this.currentSort);
        }
        this.loadFilters();
      },
      error: (error) => {
        console.error('Error loading cars:', error);
        this.snackBar.open('Error loading cars', 'Close', {
          duration: 3000,
          horizontalPosition: 'center',
          verticalPosition: 'bottom'
        });
      }
    });
  }

  sortCars(direction: 'asc' | 'desc' | null) {
    this.currentSort = direction;

    if (!direction) {
      // Reset to original order
      this.cars = [...this.unsortedCars];
      this.snackBar.open('Sorting cleared', 'Close', { duration: 2000 });
      return;
    }

    this.applySorting(direction);

    this.snackBar.open(
      `Sorted ${direction === 'asc' ? 'A-Z' : 'Z-A'}`,
      'Close',
      { duration: 2000 }
    );
  }

  loadFilters(): void {
    this.filterService.getFilters().subscribe(filters => (this.savedFilters = filters));
  }

  clearFilters(): void {
    this.filters = {
      id: null,
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
    };
  }

  applyHistoricalFilter(filter: Filter) {
    // Convert the historical filter format to current format
    this.filters = {
      id: filter.id,
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

  deleteFilter(event: Event, filter: Filter, index: number) {
    // Stop the chip click event from triggering
    event.stopPropagation();

    this.filterService.deleteFilter(filter.id).subscribe({
      next: () => {
        this.savedFilters.splice(index, 1);
        this.snackBar.open('Filter deleted successfully', 'Close', {
          duration: 3000
        });
      },
      error: (error) => {
        console.error('Error deleting filter:', error);
        this.snackBar.open('Error deleting filter', 'Close', {
          duration: 3000
        });
      }
    });
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

    return parts.join(', ');
  }

  openCarDialog(car: Car): void {
    const dialogRef = this.dialog.open(CarDialogComponent, {
      width: '600px',
      data: car,
      disableClose: false,
      panelClass: 'car-dialog'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) this.loadCars();
    });
  }

  openNewCarDialog(): void {
    const newCar: Car = {
      id: '',
      name: '',
      mpg: 0,
      cylinders: 0,
      displacement: 0,
      horsepower: 0,
      weight: 0,
      acceleration: 0,
      model_year: 0,
      origin: ''
    };

    const dialogRef = this.dialog.open(CarDialogComponent, {
      width: '600px',
      data: newCar,
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) this.loadCars();
    });
  }

  exportCars(): void {
    if (this.cars && this.cars.length > 0) {
      this.carService.exportToCsv(this.cars);
    } else {
      this.snackBar.open('No cars available to export', 'Close', {
        duration: 3000,
        horizontalPosition: 'center',
        verticalPosition: 'bottom'
      });
    }
  }

  resetToHome(): void {
    // Reset any filter/search states you might have
    if (this.filters) {
      this.clearFilters();
    }

    this.currentSort = null;

    // Reload all cars
    this.loadCars();

    // Show confirmation to user
    this.snackBar.open('Showing all cars', 'Close', {
      duration: 2000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom'
    });
  }

  private applySorting(direction: 'asc' | 'desc') {
    this.cars.sort((a, b) => {
      const nameA = a.name.toLowerCase();
      const nameB = b.name.toLowerCase();

      if (direction === 'asc') {
        return nameA.localeCompare(nameB);
      } else {
        return nameB.localeCompare(nameA);
      }
    });
  }

}
