import { LocationItem } from "../types";
// A function to sort by layer in the same way it is done in Stad In Kaart
export default function sortByLayer(unsortedList: LocationItem[]) {
    const districtList = unsortedList.filter((obj) => obj.layer.toLowerCase() === "district");
    const streetList = unsortedList.filter((obj) => obj.layer.toLowerCase() === "straatnaam");
    const leftoverList = unsortedList.filter((obj) => obj.layer.toLowerCase() !== "district" &&
        obj.layer.toLowerCase() !== "straatnaam");
    const combinedList: LocationItem[] = [];
    districtList.forEach((item) => combinedList.push(item));
    streetList.forEach((item) => combinedList.push(item));
    leftoverList.forEach((item) => combinedList.push(item));
    return combinedList;
}
