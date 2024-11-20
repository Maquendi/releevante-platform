import { FetchAllBookCategory, FetchAllBooks } from "@/actions/book-actions";
import SlideChangeHooks from "./MainSliderBooks";


const LandingPage = async () => {
  const bookCategories = await FetchAllBookCategory();
  const books = await FetchAllBooks()
  
  return(
    <SlideChangeHooks></SlideChangeHooks>
  )
};

export default LandingPage;
