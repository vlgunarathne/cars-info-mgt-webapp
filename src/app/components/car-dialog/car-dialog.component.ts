import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule, MatDialogContent, MatDialogActions } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CarService } from '../../services/car.service';
import { Car } from '../../models/car.model';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-car-dialog',
  templateUrl: './car-dialog.component.html',
  styleUrls: ['./car-dialog.component.css'],
  standalone: true,
  imports: [MatDialogContent, MatFormFieldModule, MatDialogActions, MatDialogModule, MatInputModule, FormsModule, MatButtonModule]
})
export class CarDialogComponent {
  constructor(
    private dialogRef: MatDialogRef<CarDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public car: Car,
    private carService: CarService
  ) { }

  saveCar(): void {
    this.carService.updateCar(this.car.id, this.car).subscribe(() => this.dialogRef.close(true));
  }

  deleteCar(): void {
    this.carService.deleteCar(this.car.id).subscribe(() => this.dialogRef.close(true));
  }
}
