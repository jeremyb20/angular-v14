import { BarcodeFormat } from '@zxing/library';
export const BootstrapBreakpoints = [
    { Id: 0, Name: 'xs', MediaQuery: "(max-width: 575.98px)" },
    { Id: 1, Name: 'sm', MediaQuery: "(min-width: 576px) and (max-width: 767.98px)" },
    { Id: 2, Name: 'md', MediaQuery: "(min-width: 768px) and (max-width: 991.98px)" },
    { Id: 3, Name: 'lg', MediaQuery: "(min-width: 992px) and (max-width: 1199.98px)" },
    { Id: 4, Name: 'xl', MediaQuery: "(min-width: 1200px)" },
    { Id: 5, Name: 'landscape', MediaQuery: "(orientation: landscape)" }
 ];

 export const Options = {
  rowClickEvent: true,
  rowPerPageMenu: [5, 15, 20, 30],
  rowPerPage : 15,
  emptyDataMessage : 'No hay datos disponibles'
}

export class Notification {

  constructor(
    public id: number,
    public type: NotificationType,
    public title: string,
    public message: string,
    public classProp: string,
    public classPropAnimation: string,
    public timeout: number,
  ) { }
}
export interface Navigation {
  Id: number;
  routerLink: string;
  iconClass: string;
  translate: string;
  hasPermission: boolean;
  showInToolbar: boolean;
  showInSideNav: boolean;
  isNewRoute: boolean;
  EISubMenu: any;
}

export interface NavigationAdmin {
  Id: number;
  routerLink: string;
  iconClass: string;
  translate: string;
  hasPermission: boolean;
  EISubMenu: any;
}

export const formatsAvailable = [
  BarcodeFormat.CODE_128,
  BarcodeFormat.DATA_MATRIX,
  BarcodeFormat.EAN_13,
  BarcodeFormat.EAN_8,
  BarcodeFormat.ITF,
  BarcodeFormat.QR_CODE,
  BarcodeFormat.RSS_14,
];

export const formatNames = [
  'Aztec 2D barcode format.',
  'CODABAR 1D format.',
  'Code 39 1D format.',
  'Code 93 1D format.',
  'Code 128 1D format.',
  'Data Matrix 2D barcode format.',
  'EAN-8 1D format.',
  'EAN-13 1D format.',
  'ITF (Interleaved Two of Five) 1D format.',
  'MaxiCode 2D barcode format.',
  'PDF417 format.',
  'QR Code 2D barcode format.',
  'RSS 14',
  'RSS EXPANDED',
  'UPC-A 1D format.',
  'UPC-E 1D format.',
  'UPC/EAN extension format. Not a stand-alone format.',
];

export const NAVIGATION: Navigation[] = [
  {
    Id:33,
    routerLink: '/sports',
    iconClass: 'fas fa-futbol',
    translate: 'USER.NAVBAR.SPORTS',
    hasPermission: true,
    showInToolbar: true,
    showInSideNav: true,
    isNewRoute: true,
    EISubMenu: [
      {
        Id:43,
        routerLink: '/e-sports',
        iconClass: 'fas fa-gamepad',
        translate: 'USER.NAVBAR.E_SPORTS',
        hasPermission: true,
        showInToolbar: true,
        showInSideNav: true,
        isNewRoute: false,
        EISubMenu: []
      },
      {
        Id:44,
        routerLink: '/live-wager',
        iconClass: 'fas fa-wifi',
        translate: 'USER.NAVBAR.LIVE_WAGER',
        hasPermission: true,
        showInToolbar: true,
        showInSideNav: true,
        isNewRoute: false,
        EISubMenu: []
      },
      {
        Id:45,
        routerLink: '/casino',
        iconClass: 'fas fa-dice',
        translate: 'USER.NAVBAR.CASINO',
        hasPermission: true,
        showInToolbar: true,
        showInSideNav: true,
        isNewRoute: false,
        EISubMenu: []
      }, 
      {
        Id:46,
        routerLink: '/props-builder',
        iconClass: 'fas fa-tools',
        translate: 'USER.NAVBAR.PROPS_BUILDER',
        hasPermission: true,
        showInToolbar: true,
        showInSideNav: true,
        isNewRoute: false,
        EISubMenu: []
      },
      {
        Id:47,
        routerLink: '/racebook',
        iconClass: 'fas fa-horse-head',
        translate: 'USER.NAVBAR.RACEBOOK',
        hasPermission: true,
        showInToolbar: true,
        showInSideNav: true,
        isNewRoute: false,
        EISubMenu: []
      }
    ]
  },
  {
    Id:34,
    routerLink: '/e-sports',
    iconClass: 'fas fa-gamepad',
    translate: 'USER.NAVBAR.E_SPORTS',
    hasPermission: true,
    showInToolbar: true,
    showInSideNav: true,
    isNewRoute: false,
    EISubMenu: []
  },
  {
    Id:35,
    routerLink: '/live-wager',
    iconClass: 'fas fa-wifi',
    translate: 'USER.NAVBAR.LIVE_WAGER',
    hasPermission: true,
    showInToolbar: true,
    showInSideNav: true,
    isNewRoute: false,
    EISubMenu: []
  },
  {
    Id:36,
    routerLink: '/casino',
    iconClass: 'fas fa-dice',
    translate: 'USER.NAVBAR.CASINO',
    hasPermission: true,
    showInToolbar: true,
    showInSideNav: true,
    isNewRoute: false,
    EISubMenu: []
  }, 
  {
    Id:37,
    routerLink: '/props-builder',
    iconClass: 'fas fa-tools',
    translate: 'USER.NAVBAR.PROPS_BUILDER',
    hasPermission: true,
    showInToolbar: true,
    showInSideNav: true,
    isNewRoute: false,
    EISubMenu: []
  },
  {
    Id:38,
    routerLink: '/racebook',
    iconClass: 'fas fa-horse-head',
    translate: 'USER.NAVBAR.RACEBOOK',
    hasPermission: true,
    showInToolbar: true,
    showInSideNav: true,
    isNewRoute: false,
    EISubMenu: []
  }, {
    Id:39,
    routerLink: '/contest',
    iconClass: 'fas fa-medal',
    translate: 'USER.NAVBAR.CONTEST',
    hasPermission: true,
    showInToolbar: true,
    showInSideNav: true,
    isNewRoute: false,
    EISubMenu: []
  },
  {
    Id:40,
    routerLink: '/cockfight',
    iconClass: 'fas fa-gamepad',
    translate: 'USER.NAVBAR.COCKFIGHT',
    hasPermission: true,
    showInToolbar: true,
    showInSideNav: true,
    isNewRoute: false,
    EISubMenu: []
  },
  {
    Id:41,
    routerLink: '/virtual-sports',
    iconClass: 'fas fa-gamepad',
    translate: 'USER.NAVBAR.VIRTUAL_SPORTS',
    hasPermission: true,
    showInToolbar: true,
    showInSideNav: true,
    isNewRoute: false,
    EISubMenu: []
  },
  {
    Id:42,
    routerLink: '/poker',
    iconClass: 'fas fa-gamepad',
    translate: 'USER.NAVBAR.POKER',
    hasPermission: true,
    showInToolbar: true,
    showInSideNav: true,
    isNewRoute: false,
    EISubMenu: []
  }
]


export const NAVIGATION_ADMIN: NavigationAdmin[] = [
  {
    Id:4,
    routerLink: '/structures/inventory',
    iconClass: 'fas fa-truck-moving',
    translate: 'ADMIN.NAVBAR.STRUCTURES.INVENTORY',
    hasPermission: false,
    EISubMenu: []
  },
  {
    Id:5,
    routerLink: '/structures/users',
    iconClass: 'fas fa-users',
    translate: 'ADMIN.NAVBAR.STRUCTURES.USERS',
    hasPermission: false,
    EISubMenu: []
  },
  {
    Id:6,
    routerLink: '/structures/employees',
    iconClass: 'fas fa-users-cog',
    translate: 'ADMIN.NAVBAR.STRUCTURES.EMPLOYEES',
    hasPermission: false,
    EISubMenu: []
  },
  {
    Id:7,
    routerLink: '/structures/permissions',
    iconClass: 'fas fa-users-cog',
    translate: 'ADMIN.NAVBAR.STRUCTURES.PERMISSIONS',
    hasPermission: false,
    EISubMenu: []
  }
];

export interface Country {
  id: number;
  name: string;
  flag: string;
  area: number;
  population: number;
}

export enum NotificationType {
    success = 0,
    warning = 1,
    error = 2,
    info = 3
}
