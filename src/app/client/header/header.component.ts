import { Component, HostListener, OnInit, ViewChild, viewChild } from '@angular/core';
import { CommodityDataResponse } from '../../responses/commodity/Commodity.data.response'
import { CommodityService } from '../../service/commodity.service';
import { FormsModule, NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { UserDataResponse } from '../../responses/user/user.data.response';
import { UserService } from '../../service/user.service';
import { ClientService } from '../../service/client.service';
import { TokenService } from '../../service/token.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderClientComponent implements OnInit {
  isDropdownOpen = false;
  isInventoryDropdownOpen = false;
  commodities: CommodityDataResponse[] = [];
  user?: UserDataResponse;
  isGuest: boolean = false;


  @ViewChild('loginForm') searchForm!: NgForm;
  productName: string = '';

  constructor(
    private commodityService: CommodityService,
    private tokenService: TokenService,
    private router: Router,
    private route: ActivatedRoute,
    private userService: ClientService,
  ) {
  }

  ngOnInit(): void {
    this.getCommodities('');
    this.user = this.userService.getUserResponseFromLocalStorage();
    
    if(this.user != null){
      for(let i = 0; i < this.user.roles.length; i++){
        let role = this.user.roles[i];
        if(role.name == "GUEST"){
          this.isGuest = true;
        }
      }
    }
  }

  signOut() {
    this.userService.removeUserFromLocalStorage();
    this.tokenService.removeToken();
    this.user = this.userService.getUserResponseFromLocalStorage();
  }

  search(){
    this.router.navigate(['/search/' + this.productName]);
  }

  redirectToLogin() {
    this.router.navigate(['/login']);
  }

  redirectToTrackOrder() {
    this.router.navigate(['/tracking-order']);
  }

  redirectToRegister(){
    this.router.navigate(['/register']);
  }

  getCommodities(name: string) {
    this.commodityService.getCommodities(name).subscribe({
      next: (response: any) => {
        this.commodities = response.data;
      },
      complete: () => {
      },
      error: (error: any) => {
        console.error('Error fetching products:', error);
      }
    });
  }
  
  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event) {
    const target = event.target as HTMLElement;
    if (!target.closest('.dropdown')) {
      this.isDropdownOpen = false;
    }
  }

  toggleInventoryDropdown() {
    this.isInventoryDropdownOpen = !this.isInventoryDropdownOpen;
  }

  
}
