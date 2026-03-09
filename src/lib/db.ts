import { collection, getDocs, doc, getDoc, addDoc, updateDoc, deleteDoc, serverTimestamp } from "firebase/firestore";
import { db } from "./firebase";

export interface Product {
  id?: string;
  title: string;
  description: string;
  price: number;
  imageUrl: string;
  category?: string;
  createdAt?: any;
}

export interface Order {
  id?: string;
  productId: string;
  productName: string;
  customerName: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
  status: string;
  createdAt?: any;
}

export async function getProducts(): Promise<Product[]> {
  try {
    const querySnapshot = await getDocs(collection(db, "products"));
    const products: Product[] = [];
    querySnapshot.forEach((d) => {
      products.push({ id: d.id, ...d.data() } as Product);
    });
    return products;
  } catch (error) {
    console.error("Error fetching products", error);
    return [];
  }
}

export async function getProductById(id: string): Promise<Product | null> {
  try {
    const docRef = doc(db, "products", id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as Product;
    }
  } catch (error) {
    console.error("Error fetching product", error);
  }
  return null;
}

export async function addProduct(product: Product) {
  try {
    const docRef = await addDoc(collection(db, "products"), {
      ...product,
      createdAt: serverTimestamp()
    });
    return docRef.id;
  } catch (error) {
    console.error("Error adding product", error);
    throw error;
  }
}

export async function updateProduct(id: string, product: Partial<Product>) {
  try {
    await updateDoc(doc(db, "products", id), product as Record<string, any>);
  } catch (error) {
    console.error("Error updating product", error);
    throw error;
  }
}

export async function deleteProduct(id: string) {
  try {
    await deleteDoc(doc(db, "products", id));
  } catch (error) {
    console.error("Error deleting product", error);
    throw error;
  }
}

export async function getOrders(): Promise<Order[]> {
  try {
    const querySnapshot = await getDocs(collection(db, "orders"));
    const orders: Order[] = [];
    querySnapshot.forEach((d) => {
      orders.push({ id: d.id, ...d.data() } as Order);
    });
    return orders.sort((a, b) => {
      const aTime = a.createdAt?.seconds || 0;
      const bTime = b.createdAt?.seconds || 0;
      return bTime - aTime;
    });
  } catch (error) {
    console.error("Error fetching orders", error);
    return [];
  }
}

export async function updateOrderStatus(
  id: string,
  status: 'pending' | 'confirmed' | 'retour' | 'canceled'
) {
  try {
    await updateDoc(doc(db, "orders", id), { status });
  } catch (error) {
    console.error("Error updating order status", error);
    throw error;
  }
}
