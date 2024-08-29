
import { Component, OnInit, ViewChild } from '@angular/core';
import { OptionDataResponse } from '../../responses/option/option.data.response';
import { OptionService } from '../../service/option.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm, ReactiveFormsModule } from '@angular/forms';
import { OptionDTO } from '../../dtos/option/option.dto';
import { OptionUpdateDTO } from '../../dtos/option/option.update.dto';
import { OptionValueDataResponse } from '../../responses/option-value/option.data.response';
import { OptionValueResponse } from '../../responses/option-value/optionValues.response';
import { OptionValueUpdateDTO } from '../../dtos/option-value/optionValue.dto';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';

@Component({
  selector: 'app-option-value',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, ToastModule, ButtonModule, RippleModule],
  templateUrl: './option-value.component.html',
  styleUrl: './option-value.component.scss',
  providers: [MessageService]
})
export class OptionValueComponent implements OnInit {

  id: number = 0;

  optionValueResponse?: OptionValueResponse;
  optionValues?: OptionValueDataResponse[] =[];
  currentPage: number = 0;
  itemsPerPage: number = 10;
  pages: number[] = [];
  totalPages: number = 0;
  name: string = "";
  isActive: boolean = true;
  visiblePages: number[] = [];
  dynamicFieldCounter: number = 0;
  optionValueName: string[] = [];
  isCreateNew: boolean = true;
  optionId: number = 0;
  optionDelete: number = 0;
  updatedName: string = "";
  isUpdate: boolean = false;

  @ViewChild('registerForm') registerForm!: NgForm;
  optionName: string;


  constructor(
    private optionService: OptionService,
    private router: Router,
    private route: ActivatedRoute,
    private messageService: MessageService
  ) {
    this.optionName = '';
  }

  ngOnInit(): void {
    this.id = Number(this.route.snapshot.paramMap.get('id'));
    this.getOptionById(this.id);
  }

  onPageChange(page: number) {
    debugger;
    this.currentPage = page;
    this.getAllOptionValues(this.id, this.name, this.isActive, this.currentPage, this.itemsPerPage);
  }

  getOptionById(id: number) {
    debugger
    this.optionService.getOptionById(id).subscribe({
      next: (response: any) => {
        debugger
        this.optionValueResponse = response;
        this.optionValues = response.data.optionValues;

      },
      complete: () => {
        debugger;
      },
      error: (error: any) => {
        this.showError(error.error.message);
      }
    });
  }

  getAllOptionValues(optionId: number, name: string, isAcive: boolean, page: number, limit: number) {
    debugger
    this.optionService.getAllOptionValueByOptionId(optionId, name, isAcive, page, limit).subscribe({
      next: (response: any) => {
        debugger
        this.optionValues = response.data.optionValues;
        this.totalPages = response.data.totalPages;
        this.visiblePages = this.generateVisiblePageArray(this.currentPage, this.totalPages);
        this.showSuccess(response.message)
      },
      complete: () => {
        debugger;
      },
      error: (error: any) => {
        this.showError(error.error.message);
      }
    });
  }

  generateVisiblePageArray(currentPage: number, totalPages: number): number[] {
    const maxVisiblePages = 5;
    const halfVisiblePages = Math.floor(maxVisiblePages / 2);

    let startPage = Math.max(currentPage - halfVisiblePages, 1);
    let endPage = Math.min(startPage + maxVisiblePages - 1, totalPages);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(endPage - maxVisiblePages + 1, 1);
    }

    return new Array(endPage - startPage + 1).fill(0)
      .map((_, index) => startPage + index);
  }

  searchOptions() {
    debugger
    this.getAllOptionValues(this.id, this.name, this.isActive, this.currentPage, this.itemsPerPage);
  }

  isOpenupdate(index: number, name: string) {
    debugger
    const input = document.getElementById(`input-name${index}`);
    const label = document.getElementById(`lable-name${index}`);
    const btnEdit = document.getElementById(`button-option-edit${index}`);
    const btnAccept = document.getElementById(`button-option-accept${index}`);
    const inputs = document.getElementsByClassName(`input-name`);
    const labels = document.getElementsByClassName(`lable-name`);
    const btnEdits = document.getElementsByClassName(`button-option-edit`);
    const btnAccepts = document.getElementsByClassName(`button-option-accept`);

    this.updatedName = name;
    if (this.isUpdate) {
      if (input != null) input.style.display = 'none';
      if (btnAccept != null) btnAccept.style.display = 'none';
      if (label != null) label.style.display = 'block';
      if (btnEdit != null) btnEdit.style.display = 'block';
    } else {
      if (inputs != null) {
        for (let i = 0; i < inputs.length; i++) {
          (inputs[i] as HTMLInputElement).style.display = 'none';
        }
      }

      if (labels != null) {
        for (let i = 0; i < labels.length; i++) {
          (labels[i] as HTMLInputElement).style.display = 'block';
        }
      }

      if (btnEdits != null) {
        for (let i = 0; i < btnEdits.length; i++) {
          (btnEdits[i] as HTMLInputElement).style.display = 'block';
        }
      }

      if (btnAccepts != null) {
        for (let i = 0; i < btnAccepts.length; i++) {
          (btnAccepts[i] as HTMLInputElement).style.display = 'none';
        }
      }
      
      if (input != null) input.style.display = 'block';
      if (btnAccept != null) btnAccept.style.display = 'block';
      if (label != null) label.style.display = 'none';
      if (btnEdit != null) btnEdit.style.display = 'none';
    }
  }

  update(optionValueId: number){
    debugger
    const optionDTO: OptionValueUpdateDTO = {
      "optionValueId": optionValueId,
      "optionId": this.id,
      "optionValueName": this.updatedName
    }

    this.optionService.updateOptionValue(optionDTO).subscribe({
      next: (response: any) => { 
        this.showSuccess(response.message);
        setTimeout(() => {
          const currentUrl = this.router.url;
          this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
            this.router.navigate([currentUrl]);
          });
        }, 3000);  
       },
      complete: () => { },
      error: (error: any) => {
        this.showError(error.error.message);
      }
    });
  }


  openModal(optionDelete: number) {
    const modalDiv = document.getElementById('myModal');
    if (modalDiv != null) {
      modalDiv.style.display = 'block';
      this.optionDelete = optionDelete;
    }
  }

  deleteOption(){
    debugger
    this.optionService.deleteOptionValue(this.optionDelete).subscribe({
      next: (response: any) => {
        this.showSuccess(response.message);
        setTimeout(() => {
          const currentUrl = this.router.url;
          this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
            this.router.navigate([currentUrl]);
          });
        }, 3000);   
      },
      complete: () => {
        debugger;          
      },
      error: (error: any) => {
        this.showError(error.error.message);
      }
    });    
  }

  closeModal() {
    const modalDiv = document.getElementById('myModal');
    if (modalDiv != null) modalDiv.style.display = 'none';
  }

  showSuccess(message: string) {
    this.messageService.add({ severity: 'success', summary: 'Success', detail:  message });
  }

  showError(message: string) {
    this.messageService.add({ severity: 'error', summary: 'Error', detail: message });
  }
}
