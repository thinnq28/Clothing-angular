import { Component, OnInit, ViewChild } from '@angular/core';
import { OptionDataResponse } from '../../responses/option/option.data.response';
import { OptionService } from '../../service/option.service';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm, ReactiveFormsModule } from '@angular/forms';
import { OptionDTO } from '../../dtos/option/option.dto';
import { OptionUpdateDTO } from '../../dtos/option/option.update.dto';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { Checkbox } from 'primeng/checkbox';

@Component({
  selector: 'app-option',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterLink, ToastModule, ButtonModule, RippleModule],
  templateUrl: './option.component.html',
  styleUrl: './option.component.scss',
  providers: [MessageService]
})
export class OptionComponent implements OnInit {
  options: OptionDataResponse[] = [];
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
  isMultipleUsage: boolean = false;
  isMultipleUsageUpdate: boolean = false;

  @ViewChild('registerForm') registerForm!: NgForm;
  optionName: string;


  constructor(
    private optionService: OptionService,
    private router: Router,
    private messageService: MessageService
  ) {
    this.optionName = '';
  }

  ngOnInit(): void {
    this.getAllOptions(this.name, this.isActive, this.currentPage, this.itemsPerPage);
  }

  onPageChange(page: number) {
    debugger;
    this.currentPage = page;
    this.getAllOptions(this.name, this.isActive, this.currentPage, this.itemsPerPage);
  }

  getAllOptions(name: string, isAcive: boolean, page: number, limit: number) {
    debugger
    this.optionService.getAllOptions(name, isAcive, page, limit).subscribe({
      next: (response: any) => {
        debugger
        this.options = response.data.options;
        this.totalPages = response.data.totalPages;
        this.visiblePages = this.generateVisiblePageArray(this.currentPage, this.totalPages);
        this.showSuccess(response.message);
      },
      complete: () => {

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
    this.getAllOptions(this.name, this.isActive, this.currentPage, this.itemsPerPage);
  }

  openCreateOption() {
    const modalDiv = document.getElementById('modalCreateOption');
    if (modalDiv != null) {
      modalDiv.style.display = 'block';
    }
  }

  closeCreateUser() {
    const modalDiv = document.getElementById('modalCreateOption');
    if (modalDiv != null) {
      modalDiv.style.display = 'none';
    }
  }

  saveOption() {
    let optionValueNames = document.getElementsByName('optionValueName');
    let values = [];
    for (let i = 0; i < optionValueNames.length; i++) {
      let value = (optionValueNames[i] as HTMLInputElement).value;
      values.push(value)
    }

    this.optionValueName = values;

    const optionDTO: OptionDTO = {
      "optionId": this.optionId,
      "optionName": this.optionName,
      "active": true,
      "isMultipleUsage": this.isMultipleUsage,
      "isCreateNew": this.isCreateNew,
      "optionValues": this.optionValueName
    }

    this.optionService.register(optionDTO).subscribe({
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
        let errors = [];
        errors = error.error.data;
        for (let i = 0; i < errors.length; i++) {
          this.showError(errors[i]);
        }
      }
    });
  }

  insertInput() {
    this.dynamicFieldCounter++;
    const newFormGroup = document.createElement('div');
    newFormGroup.className = 'form-group';
    newFormGroup.style.marginBottom = '15px';

    const newInput = document.createElement('input');
    newInput.type = 'text';
    newInput.id = 'optionValue' + this.dynamicFieldCounter;
    newInput.placeholder = 'Enter option name value';
    newInput.required = true;
    newInput.setAttribute('name', 'optionValueName'); // Add unique name attribute
    newInput.setAttribute('ngModel', 'optionValueName'); // Add ngModel binding attribute

    // Add inline styles
    newInput.style.width = '100%';
    newInput.style.padding = '10px';
    newInput.style.border = '1px solid #ccc';
    newInput.style.borderRadius = '4px';
    newInput.style.boxSizing = 'border-box';

    newFormGroup.appendChild(newInput);


    const container = document.getElementById('dynamicFormGroupContainer');
    if (container != null && container.parentNode != null) {
      container.parentNode.insertBefore(newFormGroup, container.nextSibling);
    }
  }

  isCreate() {
    const modalDiv = document.getElementById('flexSwitchCheckChecked');
    const divSel = document.getElementById('selector');
    const divOpt = document.getElementById('option');
    if (modalDiv != null && this.isCreateNew) {

      if (divSel) divSel.style.display = 'block';
      if (divOpt) divOpt.style.display = 'none';
    } else {
      if (divSel) divSel.style.display = 'none';
      if (divOpt) divOpt.style.display = 'block';
    }
  }

  isOpenupdate(index: number, name: string, isMultipleUsage: boolean) {
    debugger
    const input = document.getElementById(`input-name${index}`);
    const label = document.getElementById(`lable-name${index}`);
    const checkBoxName = document.getElementById(`checkbox-name${index}`);


    const btnEdit = document.getElementById(`button-option-edit${index}`);
    const btnAccept = document.getElementById(`button-option-accept${index}`);
    const checkBox = document.getElementById(`flexCheckDefaultUpdate${index}`);
    const checkBoxs = document.getElementsByClassName(`check-box`);
    const inputs = document.getElementsByClassName(`input-name`);
    const labels = document.getElementsByClassName(`lable-name`);
    const btnEdits = document.getElementsByClassName(`button-option-edit`);
    const btnAccepts = document.getElementsByClassName(`button-option-accept`);




    this.updatedName = name;
    this.isMultipleUsageUpdate = isMultipleUsage;
    if (this.isUpdate) {
      if (input != null) input.style.display = 'none';
      if (btnAccept != null) btnAccept.style.display = 'none';
      if (checkBox != null) checkBox.style.display = 'none';
      if (label != null) label.style.display = 'block';
      if (btnEdit != null) btnEdit.style.display = 'block';
      if (checkBoxName != null) checkBoxName.style.display = 'block';
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

      if (checkBoxs != null) {
        for (let i = 0; i < checkBoxs.length; i++) {
          (checkBoxs[i] as HTMLInputElement).style.display = 'none';
        }
      }

      if (checkBoxs != null) {
        for (let i = 0; i < checkBoxs.length; i++) {
          (checkBoxs[i] as HTMLInputElement).style.display = 'none';
        }
      }

      if (input != null) input.style.display = 'block';
      if (btnAccept != null) btnAccept.style.display = 'block';
      if (label != null) label.style.display = 'none';
      if (btnEdit != null) btnEdit.style.display = 'none';
      if (checkBox != null) checkBox.style.display = 'block';
      if (checkBoxName != null) checkBoxName.style.display = 'none';
    }
  }

  update(optionId: number) {
    const optionDTO: OptionUpdateDTO = {
      "optionId": optionId,
      "optionName": this.updatedName,
      "isMultipleUsage": this.isMultipleUsage
    }

    this.optionService.update(optionDTO).subscribe({
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
        let errors = [];
        errors = error.error.data;
        for (let i = 0; i < errors.length; i++) {
          this.showError(errors[i]);
        }
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

  deleteOption() {
    this.optionService.deleteOption(this.optionDelete).subscribe({
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

  redirectDetailOption(id: number) {
    this.router.navigate([`/admin/options/${id}`]);
  }

  showSuccess(message: string) {
    this.messageService.add({ severity: 'success', summary: 'Success', detail: message });
  }

  showErrors(errors: string[]) {
    for (let i = 0; i < errors.length; i++) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: errors[i], life: 10000 });
    }
  }

  showError(message: string) {
    this.messageService.add({ severity: 'error', summary: 'Error', detail: message });
  }
}



