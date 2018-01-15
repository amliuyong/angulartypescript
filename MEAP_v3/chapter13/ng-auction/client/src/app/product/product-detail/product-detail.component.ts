import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnChanges,
  SimpleChange
} from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import { combineLatest } from 'rxjs/observable/combineLatest';
import { startWith } from 'rxjs/operators';
import { BidMessage, BidService, Product } from '../../shared/services';

@Component({
  selector: 'nga-product-detail',
  styleUrls: [ './product-detail.component.scss' ],
  templateUrl: './product-detail.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductDetailComponent implements OnChanges {
  private readonly productChange$ = new Subject<Product>();
  price$: Observable<number>;
  @Input() product: Product;

  constructor(private bidService: BidService) {}

  ngOnInit() {
    this.price$ = combineLatest(
      this.productChange$.pipe(startWith(this.product)),
      this.bidService.priceUpdates.pipe(startWith<BidMessage|null>(null)),
      (product, bid) => bid && bid.productId === product.id ? bid.price : product.price
    );
  }

  ngOnChanges({ product }: { product: SimpleChange }) {
    this.productChange$.next(product.currentValue);
  }

  placeBid(price: number) {
    this.bidService.placeBid(this.product.id, price);
  }
}
