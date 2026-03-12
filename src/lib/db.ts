import { collection, getDocs, doc, getDoc, addDoc, updateDoc, deleteDoc, serverTimestamp } from "firebase/firestore";
import { db } from "./firebase";

export interface ColorVariant {
  name: string;
  imageUrl: string;
}

export interface Product {
  id?: string;
  title: string;
  titleFr?: string;
  titleAr?: string;
  price: string | number;
  description: string;
  descriptionFr?: string;
  descriptionAr?: string;
  imageUrl?: string;
  category: string;
  sizes?: string[];
  stock?: number;
  colorVariants?: {
    name: string;
    nameFr?: string;
    nameAr?: string;
    imageUrl: string;
  }[];
  createdAt?: any;
}

export interface Order {
  id?: string;
  productId: string;
  productName: string;
  quantity?: number;
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
    const orderRef = doc(db, "orders", id);
    const orderSnap = await getDoc(orderRef);
    
    if (orderSnap.exists()) {
      const order = orderSnap.data() as Order;
      
      // If confirming a non-confirmed order, deduct stock
      if (status === 'confirmed' && order.status !== 'confirmed') {
        const productRef = doc(db, "products", order.productId);
        const productSnap = await getDoc(productRef);
        if (productSnap.exists()) {
          const productData = productSnap.data() as Product;
          const currentStock = productData.stock || 0;
          const qty = order.quantity || 1;
          await updateDoc(productRef, { stock: Math.max(0, currentStock - qty) });
        }
      } 
      // If un-confirming an order, restore stock
      else if (order.status === 'confirmed' && status !== 'confirmed') {
        const productRef = doc(db, "products", order.productId);
        const productSnap = await getDoc(productRef);
        if (productSnap.exists()) {
          const productData = productSnap.data() as Product;
          const currentStock = productData.stock || 0;
          const qty = order.quantity || 1;
          await updateDoc(productRef, { stock: currentStock + qty });
        }
      }
    }

    await updateDoc(orderRef, { status });
  } catch (error) {
    console.error("Error updating order status", error);
    throw error;
  }
}
