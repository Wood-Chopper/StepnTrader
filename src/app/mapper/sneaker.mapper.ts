import {Sneaker, SneakerProperty, SneakerType} from "../model/sneaker.model";
import {SneakerDto} from "../client/sneaker.dto";

export function sneakerMapperList(sneakerDtos: SneakerDto[]): Sneaker[] {
  return sneakerDtos.map(snd => sneakerMapper(snd));
}

export function sneakerMapper(sneakerDto: SneakerDto): Sneaker {
  return {
    id: sneakerDto.id,
    orderId: sneakerDto.orderId,
    type: typeMapper(sneakerDto.type),
    breed: sneakerDto.breed,
    level: sneakerDto.level,

    efficiency: {
      base: sneakerDto.attrs[0]/10,
      added: sneakerDto.attrs[4]/10
    },
    luck: {
      base: sneakerDto.attrs[1]/10,
      added: sneakerDto.attrs[5]/10
    },
    comfort: {
      base: sneakerDto.attrs[2]/10,
      added: sneakerDto.attrs[6]/10
    },
    resilience: {
      base: sneakerDto.attrs[3]/10,
      added: sneakerDto.attrs[7]/10
    },

    price: sneakerDto.price / 1_000_000,
    newListing: sneakerDto.newListing
  }
}

function typeMapper(type: number): SneakerType {
  switch (type) {
    case 1:
      return SneakerType.WALKER
    case 2:
      return SneakerType.JOGGER
    case 3:
      return SneakerType.RUNNER
    case 4:
      return SneakerType.TRAINER
  }
  throw new Error('unrecognized type ' + type);
}

export function typeToStringMapper(type: SneakerType): string {
  switch (type) {
    case SneakerType.WALKER:
      return 'walker';
    case SneakerType.JOGGER:
      return 'jogger';
    case SneakerType.RUNNER:
      return 'runner';
    case SneakerType.TRAINER:
      return 'trainer';
  }
}
