import { adminDb } from '../admin';
import { Firestore, Query, DocumentData, WhereFilterOp } from 'firebase-admin/firestore';

export class DbService {
  private db: Firestore;

  constructor() {
    this.db = adminDb;
  }

  async create<T extends DocumentData>(collectionName: string, id: string, data: T): Promise<void> {
    await this.db.collection(collectionName).doc(id).set({
      ...data,
      updatedAt: new Date().toISOString(),
    });
  }

  async add<T extends DocumentData>(collectionName: string, data: T): Promise<string> {
    const docRef = await this.db.collection(collectionName).add({
      ...data,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    return docRef.id;
  }

  async get<T>(collectionName: string, id: string): Promise<T | null> {
    const doc = await this.db.collection(collectionName).doc(id).get();
    if (!doc.exists) return null;
    return { id: doc.id, ...doc.data() } as T;
  }

  async update<T extends DocumentData>(collectionName: string, id: string, data: Partial<T>): Promise<void> {
    await this.db.collection(collectionName).doc(id).update({
      ...data,
      updatedAt: new Date().toISOString(),
    });
  }

  async delete(collectionName: string, id: string): Promise<void> {
    await this.db.collection(collectionName).doc(id).delete();
  }

  async query<T>(
    collectionName: string,
    options: {
      where?: [string, WhereFilterOp, unknown][];
      orderBy?: [string, 'asc' | 'desc'][];
      limit?: number;
      startAfter?: unknown;
    } = {}
  ): Promise<T[]> {
    let query: Query = this.db.collection(collectionName);

    if (options.where) {
      options.where.forEach(([field, op, value]) => {
        query = query.where(field, op, value);
      });
    }

    if (options.orderBy) {
      options.orderBy.forEach(([field, direction]) => {
        query = query.orderBy(field, direction);
      });
    }

    if (options.limit) {
      query = query.limit(options.limit);
    }

    if (options.startAfter) {
      query = query.startAfter(options.startAfter);
    }

    const snapshot = await query.get();
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as T));
  }

  async count(
    collectionName: string,
    where?: [string, WhereFilterOp, unknown][]
  ): Promise<number> {
    let query: Query = this.db.collection(collectionName);

    if (where) {
      where.forEach(([field, op, value]) => {
        query = query.where(field, op, value);
      });
    }

    const snapshot = await query.count().get();
    return snapshot.data().count;
  }
}

export const dbService = new DbService();
