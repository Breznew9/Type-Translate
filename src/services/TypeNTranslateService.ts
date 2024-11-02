import axios from "axios";
import { translationParams } from "../components/Translation";



export const apiTranslation = async (params: translationParams) => {
  return await axios.get('https://api.mymemory.translated.net/get', {
    params: {
      q: params.textInput,
      langpair: `${params.sourceLanguage}|${params.targetLanguage}`,
    },
  });
};


