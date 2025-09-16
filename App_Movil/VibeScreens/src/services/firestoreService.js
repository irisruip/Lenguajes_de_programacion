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

export const addMovieToList = async (userId, listId, movieDetails) => {
  console.log(
    "Adding movie to list:",
    movieDetails.title,
    "to list:",
    listId,
    "for user:",
    userId
  );
  try {
    const movieRef = collection(db, "users", userId, "lists", listId, "movies");
    await addDoc(movieRef, {
      movieId: movieDetails.id,
      title: movieDetails.title,
      poster_path: movieDetails.poster_path,
      backdrop_path: movieDetails.backdrop_path,
      type: movieDetails.media_type || "movie",
      addedAt: serverTimestamp(),
    });

    // Update movieCount and coverPath in the list
    const listRef = doc(db, "users", userId, "lists", listId);
    await updateDoc(listRef, {
      movieCount: increment(1),
      coverPath: movieDetails.poster_path, // Set cover to the added movie's poster
      updatedAt: serverTimestamp(),
    });

    console.log("Movie added successfully");
  } catch (error) {
    console.error("Error adding movie to list: ", error);
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

export const removeMovieFromList = async (userId, listId, movieId) => {
  try {
    const movieRef = collection(db, "users", userId, "lists", listId, "movies");
    const q = query(movieRef, where("movieId", "==", movieId));
    const querySnapshot = await getDocs(q);
    const deletePromises = querySnapshot.docs.map((doc) => deleteDoc(doc.ref));
    await Promise.all(deletePromises);

    // Update movieCount and coverPath in the list
    const listRef = doc(db, "users", userId, "lists", listId);

    // Get remaining movies to update cover
    const remainingQuery = query(
      movieRef,
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
    console.error("Error removing movie from list: ", error);
    throw error;
  }
};

export const deleteList = async (userId, listId) => {
  console.log("Deleting list:", listId, "for user:", userId);
  try {
    // First, delete all movies in the list
    const moviesRef = collection(
      db,
      "users",
      userId,
      "lists",
      listId,
      "movies"
    );
    const moviesSnapshot = await getDocs(moviesRef);
    console.log("Movies to delete:", moviesSnapshot.docs.length);
    const deletePromises = moviesSnapshot.docs.map((movieDoc) =>
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

export const getListMovies = (userId, listId, callback) => {
  const q = query(
    collection(db, "users", userId, "lists", listId, "movies"),
    orderBy("addedAt", "desc")
  );

  const unsubscribe = onSnapshot(q, (querySnapshot) => {
    const movies = [];
    querySnapshot.forEach((doc) => {
      movies.push({ id: doc.id, ...doc.data() });
    });
    callback(movies);
  });

  return unsubscribe;
};

export const isMovieInAnyList = async (userId, movieId) => {
  try {
    const listsRef = collection(db, "users", userId, "lists");
    const listsSnapshot = await getDocs(listsRef);
    for (const listDoc of listsSnapshot.docs) {
      const moviesRef = collection(
        db,
        "users",
        userId,
        "lists",
        listDoc.id,
        "movies"
      );
      const q = query(moviesRef, where("movieId", "==", movieId));
      const moviesSnapshot = await getDocs(q);
      if (!moviesSnapshot.empty) {
        return true;
      }
    }
    return false;
  } catch (error) {
    console.error("Error checking if movie is in any list: ", error);
    return false;
  }
};

export const isMovieInList = async (userId, listId, movieId) => {
  try {
    const moviesRef = collection(
      db,
      "users",
      userId,
      "lists",
      listId,
      "movies"
    );
    const q = query(moviesRef, where("movieId", "==", movieId));
    const moviesSnapshot = await getDocs(q);
    return !moviesSnapshot.empty;
  } catch (error) {
    console.error("Error checking if movie is in list: ", error);
    return false;
  }
};
