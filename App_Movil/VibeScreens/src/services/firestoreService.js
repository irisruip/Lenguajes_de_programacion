import { db } from "../../credenciales";
import {
  collection,
  doc,
  addDoc,
  serverTimestamp,
  onSnapshot,
  query,
  orderBy,
  deleteDoc,
  getDocs,
  where,
  updateDoc,
  increment,
  limit,
} from "firebase/firestore";

export const createNewList = async (
  userId,
  listName,
  description = "",
  isPublic = false
) => {
  try {
    const listRef = collection(db, "users", userId, "lists");
    await addDoc(listRef, {
      name: listName,
      description: description,
      isPublic: isPublic,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      userId: userId,
      movieCount: 0,
    });
  } catch (error) {
    console.error("Error creating new list: ", error);
    throw error;
  }
};

export const addMovieToList = async (userId, listId, itemDetails) => {
  console.log(
    "Adding item to list:",
    itemDetails.title || itemDetails.name,
    "to list:",
    listId,
    "for user:",
    userId
  );
  try {
    const itemRef = collection(db, "users", userId, "lists", listId, "items");
    const type = itemDetails.media_type || (itemDetails.title ? "movie" : "tv");
    const title = itemDetails.title || itemDetails.name;
    await addDoc(itemRef, {
      movieId: itemDetails.id,
      title: title,
      poster_path: itemDetails.poster_path,
      backdrop_path: itemDetails.backdrop_path,
      type: type,
      addedAt: serverTimestamp(),
    });

    // Update movieCount and coverPath in the list
    const listRef = doc(db, "users", userId, "lists", listId);
    await updateDoc(listRef, {
      movieCount: increment(1),
      coverPath: itemDetails.poster_path, // Set cover to the added item's poster
      updatedAt: serverTimestamp(),
    });

    console.log("Item added successfully");
  } catch (error) {
    console.error("Error adding item to list: ", error);
    throw error;
  }
};

export const getUserLists = (userId, callback) => {
  const q = query(
    collection(db, "users", userId, "lists"),
    orderBy("createdAt", "desc")
  );

  const unsubscribe = onSnapshot(q, (querySnapshot) => {
    const lists = [];
    querySnapshot.forEach((doc) => {
      lists.push({ id: doc.id, ...doc.data() });
    });
    callback(lists);
  });

  return unsubscribe;
};

export const removeItemFromList = async (userId, listId, itemId, type) => {
  try {
    const itemRef = collection(db, "users", userId, "lists", listId, "items");
    const q = query(
      itemRef,
      where("movieId", "==", itemId),
      where("type", "==", type)
    );
    const querySnapshot = await getDocs(q);
    const deletePromises = querySnapshot.docs.map((doc) => deleteDoc(doc.ref));
    await Promise.all(deletePromises);

    // Update movieCount and coverPath in the list
    const listRef = doc(db, "users", userId, "lists", listId);

    // Get remaining items to update cover (prioritize the same type for cover)
    const remainingQuery = query(
      itemRef,
      where("type", "==", type),
      orderBy("addedAt", "desc"),
      limit(1)
    );
    const remainingSnapshot = await getDocs(remainingQuery);
    let coverPath = null;
    if (!remainingSnapshot.empty) {
      coverPath = remainingSnapshot.docs[0].data().poster_path;
    }

    await updateDoc(listRef, {
      movieCount: increment(-1),
      coverPath: coverPath,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error("Error removing item from list: ", error);
    throw error;
  }
};

export const deleteList = async (userId, listId) => {
  console.log("Deleting list:", listId, "for user:", userId);
  try {
    // First, delete all items in the list
    const itemsRef = collection(db, "users", userId, "lists", listId, "items");
    const itemsSnapshot = await getDocs(itemsRef);
    console.log("Movies to delete:", itemsSnapshot.docs.length);
    const deletePromises = itemsSnapshot.docs.map((movieDoc) =>
      deleteDoc(movieDoc.ref)
    );
    await Promise.all(deletePromises);
    console.log("Movies deleted");

    // Then, delete the list
    const listRef = doc(db, "users", userId, "lists", listId);
    await deleteDoc(listRef);
    console.log("List deleted");
  } catch (error) {
    console.error("Error deleting list: ", error);
    throw error;
  }
};

export const getListItems = (userId, listId, callback) => {
  const q = query(
    collection(db, "users", userId, "lists", listId, "items"),
    orderBy("addedAt", "desc")
  );

  const unsubscribe = onSnapshot(q, (querySnapshot) => {
    const items = [];
    querySnapshot.forEach((doc) => {
      items.push({ id: doc.id, ...doc.data() });
    });
    callback(items);
  });

  return unsubscribe;
};

export const isItemInAnyList = async (userId, itemId, type) => {
  try {
    const listsRef = collection(db, "users", userId, "lists");
    const listsSnapshot = await getDocs(listsRef);
    for (const listDoc of listsSnapshot.docs) {
      const itemsRef = collection(
        db,
        "users",
        userId,
        "lists",
        listDoc.id,
        "items"
      );
      const q = query(
        itemsRef,
        where("movieId", "==", itemId),
        where("type", "==", type)
      );
      const itemsSnapshot = await getDocs(q);
      if (!itemsSnapshot.empty) {
        return true;
      }
    }
    return false;
  } catch (error) {
    console.error("Error checking if item is in any list: ", error);
    return false;
  }
};

export const isItemInList = async (userId, listId, itemId, type) => {
  try {
    const itemsRef = collection(db, "users", userId, "lists", listId, "items");
    const q = query(
      itemsRef,
      where("movieId", "==", itemId),
      where("type", "==", type)
    );
    const itemsSnapshot = await getDocs(q);
    return !itemsSnapshot.empty;
  } catch (error) {
    console.error("Error checking if item is in list: ", error);
    return false;
  }
};

export const addFavorite = async (userId, itemDetails) => {
  try {
    const favoritesRef = collection(db, "users", userId, "favorites");
    const type = itemDetails.media_type || (itemDetails.title ? "movie" : "tv");
    const title = itemDetails.title || itemDetails.name;
    await addDoc(favoritesRef, {
      contentId: itemDetails.id,
      title: title,
      poster_path: itemDetails.poster_path,
      backdrop_path: itemDetails.backdrop_path,
      type: type,
      addedAt: serverTimestamp(),
    });
    console.log("Favorite added successfully");
  } catch (error) {
    console.error("Error adding favorite: ", error);
    throw error;
  }
};

export const removeFavorite = async (userId, contentId, type) => {
  try {
    const favoritesRef = collection(db, "users", userId, "favorites");
    const q = query(
      favoritesRef,
      where("contentId", "==", contentId),
      where("type", "==", type)
    );
    const querySnapshot = await getDocs(q);
    const deletePromises = querySnapshot.docs.map((doc) => deleteDoc(doc.ref));
    await Promise.all(deletePromises);
    console.log("Favorite removed successfully");
  } catch (error) {
    console.error("Error removing favorite: ", error);
    throw error;
  }
};

export const isFavorite = async (userId, contentId, type) => {
  try {
    const favoritesRef = collection(db, "users", userId, "favorites");
    const q = query(
      favoritesRef,
      where("contentId", "==", contentId),
      where("type", "==", type)
    );
    const querySnapshot = await getDocs(q);
    return !querySnapshot.empty;
  } catch (error) {
    console.error("Error checking if item is favorite: ", error);
    return false;
  }
};

export const getUserFavorites = (userId, callback) => {
  const q = query(
    collection(db, "users", userId, "favorites"),
    orderBy("addedAt", "desc")
  );

  const unsubscribe = onSnapshot(q, (querySnapshot) => {
    const favorites = [];
    querySnapshot.forEach((doc) => {
      favorites.push({ id: doc.id, ...doc.data() });
    });
    callback(favorites);
  });

  return unsubscribe;
};
