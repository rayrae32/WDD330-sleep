import axios from "axios";

export const getAnimalInfo = async (animalName) => {
  try {
    const response = await axios.get(
      `https://fr.wikipedia.org/w/api.php?action=query&format=json&origin=*&prop=extracts|pageimages&titles=${animalName}&exintro=1&explaintext=1&pithumbsize=500`,
    );

    const pages = response.data.query.pages;
    const pageId = Object.keys(pages)[0];
    return pages[pageId];
  } catch (error) {
    console.error("Error fetching Wikipedia data:", error);
    return null;
  }
};
