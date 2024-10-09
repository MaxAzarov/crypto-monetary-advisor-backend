import { Injectable } from '@nestjs/common';
import Binance, { Candle } from 'binance-api-node';
import { interval, map, Observable, Subject, switchMap } from 'rxjs';

@Injectable()
export class BinanceServiceService {
  private binance: ReturnType<typeof Binance> = Binance({}) as never;

  private readonly CANDLE_REPEAT_INTERVAL = 150;

  getCandleEmitter() {
    return new Observable((subscriber) => {
      const repeatEmitter = new Subject<number>();

      const disposeCandle = this.binance.ws.candles(
        'ETHUSDT',
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
