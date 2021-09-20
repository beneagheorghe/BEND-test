import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import {
  Order,
  SeparateZones,
  ChainsZone,
  SeparateChain,
} from '../models/blocks.model';

@Injectable({
  providedIn: 'root',
})
export class ConvertOrdersService {
  constructor(private httpClient: HttpClient) {}

  getOrders(): Observable<Array<Order>> {
    return this.httpClient.get<Array<Order>>('../assets/new things.json');
  }

  // Convert and preparing orders to drawing zones and chains in template
  convertedJson(data: Array<Order>): Array<Array<Array<Order>>> {
    const zones = this.separateZones(data);
    const separateChains = this.separateChain(zones);
    return this.convertAllInArray(separateChains);
  }

  // Separate Data in zones by areaId of the block and create Object of key with Array of the block as values
  private separateZones(data: Array<Order>): SeparateZones {
    return data.reduce((accumulator: SeparateZones, block: Order) => {
      accumulator[block.areaId]
        ? accumulator[block.areaId].push(block)
        : (accumulator[block.areaId] = [block]);
      return accumulator;
    }, {});
  }

  // Iterating zones and  Separate data in chains by block.id with joined.with
  private separateChain(zones: SeparateZones): SeparateChain {
    return Object.entries(zones).reduce(
      (
        accumulatorChains: SeparateChain,
        [key, arrayBlocks]: [string, Array<Order>]
      ) => {
        accumulatorChains[key] = arrayBlocks.reduce(
          (chainsZone: ChainsZone, block: Order) => {
            const chainKey = block.joinedWith ? block.joinedWith : block.id;
            chainsZone[chainKey]
              ? chainsZone[chainKey].push(block)
              : (chainsZone[chainKey] = [block]);
            return chainsZone;
          },
          {}
        );
        return accumulatorChains;
      },
      {}
    );
  }

  // Iterating zones and chains then transform in array
  // sort if chain not start with first block
  // sort in group
  private convertAllInArray(object: SeparateChain): Array<Array<Array<Order>>> {
    return Object.entries(object).map(([, chainsZone]: [string, ChainsZone]) =>
      Object.entries(chainsZone)
        .map(([, blocks]: [string, Array<Order>]) => {
          if (blocks[0].joinedWith === null) return blocks;
          return blocks.sort(this.sortChain);
        })
        .sort(this.sortGroup)
    );
  }

  private sortChain(firstBlock: Order, secondBlock: Order): number {
    if (firstBlock.joinedWith === null) return -1;
    if (secondBlock.joinedWith === null) return 1;
    return 0;
  }

  private sortGroup(firstChain: Array<Order>, secondChain: Array<Order>) {
    if (firstChain.length > secondChain.length) return -1;
    if (firstChain.length < secondChain.length) return 1;
    return 0;
  }
}
