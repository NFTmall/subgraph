// THIS IS AN AUTOGENERATED FILE. DO NOT EDIT THIS FILE DIRECTLY.

import {
  TypedMap,
  Entity,
  Value,
  ValueKind,
  store,
  Address,
  Bytes,
  BigInt,
  BigDecimal
} from "@graphprotocol/graph-ts";

export class NFT extends Entity {
  constructor(id: string) {
    super();
    this.set("id", Value.fromString(id));
  }

  save(): void {
    let id = this.get("id");
    assert(id !== null, "Cannot save NFT entity without an ID");
    assert(
      id.kind == ValueKind.STRING,
      "Cannot save NFT entity with non-string ID. " +
        'Considering using .toHex() to convert the "id" to a string.'
    );
    store.set("NFT", id.toString(), this);
  }

  static load(id: string): NFT | null {
    return store.get("NFT", id) as NFT | null;
  }

  get id(): string {
    let value = this.get("id");
    return value.toString();
  }

  set id(value: string) {
    this.set("id", Value.fromString(value));
  }

  get tokenId(): BigInt {
    let value = this.get("tokenId");
    return value.toBigInt();
  }

  set tokenId(value: BigInt) {
    this.set("tokenId", Value.fromBigInt(value));
  }

  get contractAddress(): Bytes {
    let value = this.get("contractAddress");
    return value.toBytes();
  }

  set contractAddress(value: Bytes) {
    this.set("contractAddress", Value.fromBytes(value));
  }

  get category(): string {
    let value = this.get("category");
    return value.toString();
  }

  set category(value: string) {
    this.set("category", Value.fromString(value));
  }

  get owner(): string {
    let value = this.get("owner");
    return value.toString();
  }

  set owner(value: string) {
    this.set("owner", Value.fromString(value));
  }

  get creator(): string {
    let value = this.get("creator");
    return value.toString();
  }

  set creator(value: string) {
    this.set("creator", Value.fromString(value));
  }

  get tokenURI(): string | null {
    let value = this.get("tokenURI");
    if (value === null || value.kind == ValueKind.NULL) {
      return null;
    } else {
      return value.toString();
    }
  }

  set tokenURI(value: string | null) {
    if (value === null) {
      this.unset("tokenURI");
    } else {
      this.set("tokenURI", Value.fromString(value as string));
    }
  }

  get createdAt(): BigInt {
    let value = this.get("createdAt");
    return value.toBigInt();
  }

  set createdAt(value: BigInt) {
    this.set("createdAt", Value.fromBigInt(value));
  }

  get updatedAt(): BigInt {
    let value = this.get("updatedAt");
    return value.toBigInt();
  }

  set updatedAt(value: BigInt) {
    this.set("updatedAt", Value.fromBigInt(value));
  }
}

export class Account extends Entity {
  constructor(id: string) {
    super();
    this.set("id", Value.fromString(id));
  }

  save(): void {
    let id = this.get("id");
    assert(id !== null, "Cannot save Account entity without an ID");
    assert(
      id.kind == ValueKind.STRING,
      "Cannot save Account entity with non-string ID. " +
        'Considering using .toHex() to convert the "id" to a string.'
    );
    store.set("Account", id.toString(), this);
  }

  static load(id: string): Account | null {
    return store.get("Account", id) as Account | null;
  }

  get id(): string {
    let value = this.get("id");
    return value.toString();
  }

  set id(value: string) {
    this.set("id", Value.fromString(value));
  }

  get address(): Bytes {
    let value = this.get("address");
    return value.toBytes();
  }

  set address(value: Bytes) {
    this.set("address", Value.fromBytes(value));
  }

  get ownedNFTs(): Array<string> | null {
    let value = this.get("ownedNFTs");
    if (value === null || value.kind == ValueKind.NULL) {
      return null;
    } else {
      return value.toStringArray();
    }
  }

  set ownedNFTs(value: Array<string> | null) {
    if (value === null) {
      this.unset("ownedNFTs");
    } else {
      this.set("ownedNFTs", Value.fromStringArray(value as Array<string>));
    }
  }

  get createdNFTs(): Array<string> | null {
    let value = this.get("createdNFTs");
    if (value === null || value.kind == ValueKind.NULL) {
      return null;
    } else {
      return value.toStringArray();
    }
  }

  set createdNFTs(value: Array<string> | null) {
    if (value === null) {
      this.unset("createdNFTs");
    } else {
      this.set("createdNFTs", Value.fromStringArray(value as Array<string>));
    }
  }

  get gem(): BigInt | null {
    let value = this.get("gem");
    if (value === null || value.kind == ValueKind.NULL) {
      return null;
    } else {
      return value.toBigInt();
    }
  }

  set gem(value: BigInt | null) {
    if (value === null) {
      this.unset("gem");
    } else {
      this.set("gem", Value.fromBigInt(value as BigInt));
    }
  }
}

export class Count extends Entity {
  constructor(id: string) {
    super();
    this.set("id", Value.fromString(id));
  }

  save(): void {
    let id = this.get("id");
    assert(id !== null, "Cannot save Count entity without an ID");
    assert(
      id.kind == ValueKind.STRING,
      "Cannot save Count entity with non-string ID. " +
        'Considering using .toHex() to convert the "id" to a string.'
    );
    store.set("Count", id.toString(), this);
  }

  static load(id: string): Count | null {
    return store.get("Count", id) as Count | null;
  }

  get id(): string {
    let value = this.get("id");
    return value.toString();
  }

  set id(value: string) {
    this.set("id", Value.fromString(value));
  }

  get orderTotal(): i32 {
    let value = this.get("orderTotal");
    return value.toI32();
  }

  set orderTotal(value: i32) {
    this.set("orderTotal", Value.fromI32(value));
  }

  get orderNFTmallERC721(): i32 {
    let value = this.get("orderNFTmallERC721");
    return value.toI32();
  }

  set orderNFTmallERC721(value: i32) {
    this.set("orderNFTmallERC721", Value.fromI32(value));
  }

  get nftmallERC721Total(): i32 {
    let value = this.get("nftmallERC721Total");
    return value.toI32();
  }

  set nftmallERC721Total(value: i32) {
    this.set("nftmallERC721Total", Value.fromI32(value));
  }

  get started(): i32 {
    let value = this.get("started");
    return value.toI32();
  }

  set started(value: i32) {
    this.set("started", Value.fromI32(value));
  }
}
