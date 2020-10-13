import { CommonProvider } from './../../providers/common/common';
import { FileTransfer } from '@ionic-native/file-transfer';
import { DocumentViewer } from '@ionic-native/document-viewer';
import { DomSanitizer } from '@angular/platform-browser';
import { OdooProvider } from './../../providers/odoo/odoo';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform } from 'ionic-angular';
import { File } from '@ionic-native/file';

/**
 * Generated class for the ProductsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-products',
  templateUrl: 'products.html',
})
export class ProductsPage {
  resobjproductpricing
  productPricing
  data: number[]
  name;
  allData: any[] = []
  productFiles;
  price;
  file: any[] =[];
  loader:boolean = false
  constructor(public navCtrl: NavController, public navParams: NavParams, public sanitizer: DomSanitizer,
    public odooProv: OdooProvider, private platform: Platform, private document: DocumentViewer, private files: File,
    private transfer: FileTransfer, private common: CommonProvider ) {
    this.data = []
    this.odooProv.getOdooData(this.odooProv.getUid(), this.odooProv.getPassword(),
     "product.template","search_read", [{ experssion: "%3D", filed: "type",
      value: 'financial' }], 
      [{ prop: "fields", prop_values: ["name", "description"] }]).map(res => res)
       .subscribe(res => {
        this.resobjproductpricing = res
        this.resobjproductpricing.forEach(rec => {
          let list = [];
          this.odooProv.getOdooData(this.odooProv.getUid(), this.odooProv.getPassword(),
              "product.pricing","search_read", [{ experssion: "%3D", filed: "product_price.name",
              value: rec.name }], 
              []).map(res => res)
              .subscribe(res => {
                // this.data = []
                this.productPricing = res
                // console.log(res)
                
                this.productPricing.forEach(rec => {
                  list.push(rec.price)
                  

                  // console.log(list);
                })
              })
              // let list = [];
              // this.file = []
              this.odooProv.getOdooData(this.odooProv.getUid(), this.odooProv.getPassword(),
                  "product.reports","search_read", [{ experssion: "%3D", filed: "product_reports.name",
                  value: rec.name }], 
                  []).map(res => res)
                  .subscribe(res => {
                    console.log(res)
                    // this.data = []
                    if (res){
                    this.productFiles = res
                    this.productFiles.forEach(rec => {
                      this.file.push(rec.name)
                      console.log(this.file)
                      
    
                      // console.log(list);
                    })
                  }

                    // console.log(res)
                    
                  })
        
        this.allData.push({name: rec.name, price:list ,file: this.file, description: rec.description})
        console.log(this.allData)
        
      })
      })
  }


  ionViewDidLoad() {
    console.log('ionViewDidLoad ProductsPage');
  }
  openDetails(i) {
    
    this.allData[i].open = !this.allData[i].open;
  }
  pdfURL(url){
    return this.sanitizer.bypassSecurityTrustResourceUrl(url)
  }
  countProps(obj) {
    var count = 0;
    
    for (var p of obj) {
      count++;
      var last = p;
    }
    return [last,count]; 
}
downloadAndOpenPdf(url){
  this.common.showLoading();
  let path = null;
  if (this.platform.is('ios')){
    path = this.files.documentsDirectory;
  } else {
    path = this.files.dataDirectory;
  }
  const transfer = this.transfer.create();
  transfer.download(url, path + 'product.pdf').then(entry =>{
    let newurl = entry.toURL();
    this.document.viewDocument(newurl, 'application/pdf', {})
  })
  this.common.hideLoading();
  // window.open(url, '_blank', 'location=no');
}


}
