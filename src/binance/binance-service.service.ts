import { Injectable } from '@nestjs/common';
import Binance, { Candle } from 'binance-api-node';
import { interval, map, Observable, Subject, switchMap } from 'rxjs';

@Injectable()
export class BinanceService {
  private readonly binance: ReturnType<typeof Binance> = Binance({});

  private readonly CANDLE_REPEAT_INTERVAL = 200;

  getCandleEmitter(pair: string) {
    return new Observable((subscriber) => {
      const repeatEmitter = new Subject<number>();

      const disposeCandle = this.binance.ws.candles(
        pair,
        '1m',
        (candle: Candle) => {
          const price = parseFloat(candle.high);
          repeatEmitter.next(price);
          subscriber.next(price);
        },
      );

      const disposeRepeat = repeatEmitter
        .pipe(
          switchMap((val) =>
            interval(this.CANDLE_REPEAT_INTERVAL).pipe(map(() => val)),
          ),
        )
        .subscribe((val) => subscriber.next(val));

      return () => {
        disposeCandle();
        disposeRepeat.unsubscribe();
      };
    });
  }
}
