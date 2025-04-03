import {StorageEnum} from "../enums/storage-enum";
import {StorageInterface} from "../interfaces/storage.interface";

export type StorageType = { name: StorageEnum, instance: StorageInterface }[];
export type StorageConfig = { root: string, url: string };