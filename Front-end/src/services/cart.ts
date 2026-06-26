  export type CartItem = {
    id: string;

    product_id: string;
    

    name: string;
    price: string;
    image: string;
    quantity: number;
  };

  type StoredUser = {
    id?: string;
    username?: string;
    full_name?: string;
    role?: string;
  };

  const GUEST_CART_STORAGE_KEY = 'peonia_cart_guest';
  const CART_STORAGE_PREFIX = 'peonia_cart_user_';

  function getCurrentUser(): StoredUser | null {
    try {
      const raw = localStorage.getItem('peonia_user');
      return raw ? (JSON.parse(raw) as StoredUser) : null;
    } catch {
      return null;
    }
  }

  function getUserCartStorageKey() {
    const user = getCurrentUser();
    if (!user || user.role === 'guest') return GUEST_CART_STORAGE_KEY;
    return `${CART_STORAGE_PREFIX}${user.id || user.username || 'unknown'}`;
  }

  export function getCartItems(): CartItem[] {
    try {
      const raw = localStorage.getItem(getUserCartStorageKey());
      return raw ? (JSON.parse(raw) as CartItem[]) : [];
    } catch {
      return [];
    }
  }

  export function setCartItems(items: CartItem[]) {
    localStorage.setItem(getUserCartStorageKey(), JSON.stringify(items));
    window.dispatchEvent(new Event('peonia-cart-updated'));
  }

  export function addToCart(item: Omit<CartItem, 'quantity'>, quantity = 1) {
    console.log('ADD TO CART ITEM =', item);

    const current = getCartItems();

    const index = current.findIndex(
      (cartItem) => cartItem.id === item.id
    );

    if (index >= 0) {
      current[index] = {
        ...current[index],
        quantity: current[index].quantity + quantity,
      };
    } else {
      current.push({ ...item, quantity });
    }

    setCartItems(current);
  }

  export function updateCartQuantity(id: string, quantity: number) {
    const next = getCartItems()
      .map((item) => (item.id === id ? { ...item, quantity } : item))
      .filter((item) => item.quantity > 0);
    setCartItems(next);
  }

  export function removeFromCart(id: string) {
    setCartItems(getCartItems().filter((item) => item.id !== id));
  }

  export function clearCart() {
    setCartItems([]);
  }

  export function syncGuestCartToUser() {
    const user = getCurrentUser();
    if (!user || user.role === 'guest') return;
    const userKey = getUserCartStorageKey();
    localStorage.removeItem(GUEST_CART_STORAGE_KEY);
    localStorage.setItem(userKey, JSON.stringify([]));
    window.dispatchEvent(new Event('peonia-cart-updated'));
  }
